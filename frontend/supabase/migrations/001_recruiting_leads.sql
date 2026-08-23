-- ═══════════════════════════════════════════════════════════════════════════
-- 001 — Recruiting-Leads aus den Meta-Ads-Landingpages (/stellen/<slug>)
--
-- ACHTUNG — dieser Ordner gehört NICHT zum FastAPI-Backend.
-- `backend/supabase/migrations/` betrifft die ATS-Datenbank; diese Migration
-- hier gehört zum Frontend und wurde am 23.08.2026 in der CRM-Datenbank
-- (Supabase-Projekt lkmrsvvgisdthvlqjhdk) ausgeführt. Ein eigenes
-- Supabase-Projekt hätte 10 USD/Monat gekostet — die Tabelle ist
-- eigenständig und berührt keine bestehende CRM-Tabelle.
--
-- Zugriff ausschließlich serverseitig über den Service-Role-Key aus dem
-- Next.js-Route-Handler `src/app/api/recruiting-lead/route.ts`. Es gibt
-- bewusst KEINE Policy für `anon` oder `authenticated` — niemand darf mit
-- einem öffentlichen Schlüssel in diese Tabelle schreiben oder daraus lesen.
--
-- Ausführen:
--   Supabase-Dashboard → SQL Editor → Inhalt einfügen → Run
--   oder: supabase db push   (bei eingerichteter CLI-Verknüpfung)
-- ═══════════════════════════════════════════════════════════════════════════

create extension if not exists "pgcrypto";

create table if not exists public.recruiting_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- ── Kontaktdaten ────────────────────────────────────────────────────────
  first_name              text not null,
  last_name               text not null,
  email                   text not null,
  phone                   text not null,
  -- Einheitliche Schreibweise (+49… → 0…) für den Dublettenabgleich
  phone_normalized        text not null,
  postal_code             text,
  current_job_title       text,
  preferred_contact_time  text,

  -- ── Antworten aus dem Funnel ────────────────────────────────────────────
  -- Vier feste Spalten für die Fragen, die in jeder Kampagne vorkommen und
  -- nach denen ausgewertet wird. Alle Antworten stehen zusätzlich in
  -- `answers`, damit eine Kampagne beliebige weitere Fragen stellen kann,
  -- ohne dass diese Tabelle geändert werden muss.
  qualification     text,
  experience_level  text,
  location_match    text,
  driving_license   text,
  job_preferences   text[] not null default '{}',
  answers           jsonb  not null default '{}'::jsonb,

  -- ── Stelle ──────────────────────────────────────────────────────────────
  job_slug   text not null,
  job_title  text not null,

  -- ── Herkunft der Anfrage ────────────────────────────────────────────────
  campaign_source   text,
  campaign_name     text,
  campaign_id       text,
  adset_id          text,
  ad_id             text,
  utm_source        text,
  utm_medium        text,
  utm_campaign      text,
  utm_content       text,
  fbclid            text,
  landing_page_url  text,
  referrer          text,

  -- ── Einwilligung ────────────────────────────────────────────────────────
  -- `consent_version` hält fest, WELCHEM Wortlaut zugestimmt wurde. Ohne sie
  -- ist eine Einwilligung im Streitfall nicht belegbar.
  consent_given        boolean     not null default false,
  consent_timestamp    timestamptz not null,
  consent_version      text        not null,
  -- Talentpool ist eine eigene, freiwillige Einwilligung und NICHT von der
  -- Pflicht-Einwilligung zur Kontaktaufnahme gedeckt.
  talent_pool_consent  boolean     not null default false,

  -- ── Bearbeitungsstand ───────────────────────────────────────────────────
  lead_status  text not null default 'new',

  notification_status  text not null default 'pending',
  notification_error   text,

  salesforce_id           text,
  salesforce_sync_status  text not null default 'pending',
  salesforce_error        text,

  -- Deduplizierungs-ID für den Abgleich zwischen Browser-Pixel und
  -- Conversions API: Meta zählt beide Meldungen dann als ein Ereignis.
  event_id uuid not null,

  constraint recruiting_leads_email_format
    check (position('@' in email) > 1),
  constraint recruiting_leads_consent_given
    check (consent_given = true),
  constraint recruiting_leads_lead_status
    check (lead_status in ('new', 'contacted', 'qualified', 'rejected', 'placed')),
  constraint recruiting_leads_notification_status
    check (notification_status in ('pending', 'sent', 'failed')),
  constraint recruiting_leads_salesforce_status
    check (salesforce_sync_status in ('pending', 'synced', 'failed', 'disabled'))
);

-- Eine Person bewirbt sich einmal je Stelle. Ein zweites Absenden aktualisiert
-- nichts und erzeugt keinen Fehler — der Route-Handler erkennt 23505 und
-- meldet der Person trotzdem Erfolg.
create unique index if not exists recruiting_leads_stelle_email_uniq
  on public.recruiting_leads (job_slug, lower(email));

create index if not exists recruiting_leads_created_at_idx
  on public.recruiting_leads (created_at desc);

create index if not exists recruiting_leads_job_slug_idx
  on public.recruiting_leads (job_slug, created_at desc);

-- Für das Nachholen fehlgeschlagener Benachrichtigungen und Abgleiche
create index if not exists recruiting_leads_nacharbeit_idx
  on public.recruiting_leads (notification_status, salesforce_sync_status)
  where notification_status = 'failed' or salesforce_sync_status = 'failed';

create index if not exists recruiting_leads_phone_idx
  on public.recruiting_leads (phone_normalized);

-- ── updated_at automatisch mitführen ──────────────────────────────────────
-- SECURITY INVOKER, nicht DEFINER: Die Funktion läuft ausschließlich im
-- Trigger, und der wird nur über den Service-Role-Key ausgelöst. Als
-- SECURITY DEFINER wäre sie zusätzlich über /rest/v1/rpc/recruiting_leads_touch
-- von außen aufrufbar gewesen — der Supabase-Linter meldet das zu Recht
-- (Regel 0028/0029).
create or replace function public.recruiting_leads_touch()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

revoke execute on function public.recruiting_leads_touch() from anon, authenticated, public;

drop trigger if exists recruiting_leads_touch_trg on public.recruiting_leads;
create trigger recruiting_leads_touch_trg
  before update on public.recruiting_leads
  for each row execute function public.recruiting_leads_touch();

-- ── Row Level Security ────────────────────────────────────────────────────
-- RLS ist aktiv, und es wird KEINE Policy angelegt. Wirkung: Jeder Zugriff
-- über den öffentlichen anon-Key oder einen angemeldeten Nutzer läuft ins
-- Leere. Nur der Service-Role-Key umgeht RLS — und der existiert
-- ausschließlich serverseitig in den Vercel-Umgebungsvariablen.
-- Der Supabase-Linter meldet hierzu „RLS Enabled No Policy" (Regel 0008,
-- Stufe INFO). Das ist genau die Absicht und kein Versäumnis.
alter table public.recruiting_leads enable row level security;

-- Zusätzlich die Standardrechte entziehen, damit ein späteres versehentliches
-- Anlegen einer Policy nicht sofort alles öffnet.
revoke all on public.recruiting_leads from anon, authenticated;

comment on table public.recruiting_leads is
  'Bewerber-Leads aus den Meta-Ads-Landingpages unter /stellen/<slug>. Zugriff nur serverseitig über den Service-Role-Key; RLS aktiv ohne Policy.';

comment on column public.recruiting_leads.consent_version is
  'Fassung des Einwilligungstextes, dem zugestimmt wurde. Quelle: EINWILLIGUNG_VERSION in frontend/src/landingpages/einwilligung.ts';

comment on column public.recruiting_leads.answers is
  'Alle Funnel-Antworten als Schlüssel-Wert-Paare, auch solche ohne eigene Spalte.';

comment on column public.recruiting_leads.event_id is
  'Deduplizierungs-ID für Meta: identisch in Browser-Pixel und Conversions API.';
