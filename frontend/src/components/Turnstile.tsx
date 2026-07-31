"use client";
import { useEffect, useRef } from "react";

// Cloudflare-Turnstile-Widget. Erscheint nur, wenn
// NEXT_PUBLIC_TURNSTILE_SITE_KEY gesetzt ist — ohne Schlüssel bleibt das
// Formular unverändert und der Server prüft auch nicht.
declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: { sitekey: string; callback: (token: string) => void; "expired-callback"?: () => void }) => string;
    };
  }
}

export default function Turnstile({ onVerify }: { onVerify: (token: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const rendered = useRef(false);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey || !ref.current || rendered.current) return;
    const render = () => {
      if (rendered.current || !ref.current || !window.turnstile) return;
      rendered.current = true;
      window.turnstile.render(ref.current, {
        sitekey: siteKey,
        callback: onVerify,
        "expired-callback": () => onVerify(""),
      });
    };
    if (window.turnstile) {
      render();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>("script[data-turnstile]");
    if (existing) {
      existing.addEventListener("load", render);
      return () => existing.removeEventListener("load", render);
    }
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.dataset.turnstile = "true";
    script.addEventListener("load", render);
    document.head.appendChild(script);
  }, [siteKey, onVerify]);

  if (!siteKey) return null;
  return <div ref={ref} />;
}
