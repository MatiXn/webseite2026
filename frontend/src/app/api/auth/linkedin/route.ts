import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { signToken } from "@/lib/confirm-token";

// Startet den „Mit LinkedIn bewerben"-Flow (Sign In with LinkedIn, OpenID
// Connect). Aktiv sobald NEXT_PUBLIC_LINKEDIN_CLIENT_ID gesetzt ist.
const REDIRECT_URI = "https://www.phe-perm.de/api/auth/linkedin/callback";

export async function GET(req: NextRequest) {
  const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
  const ret = req.nextUrl.searchParams.get("return") ?? "/jobs";
  // Nur relative Pfade als Rücksprungziel (kein Open Redirect)
  const safeReturn = ret.startsWith("/") && !ret.startsWith("//") ? ret : "/jobs";
  if (!clientId) {
    return NextResponse.redirect(new URL(`${safeReturn}?linkedin=unavailable`, req.url));
  }

  // Job-Infos wandern signiert in den State: der Callback verschickt die
  // Bewerbung damit automatisch (Ein-Klick-Bewerbung)
  const jobTitle = (req.nextUrl.searchParams.get("jobTitle") ?? "").slice(0, 200);
  const jobCity = (req.nextUrl.searchParams.get("jobCity") ?? "").slice(0, 100);

  // Nonce bindet den Flow an diesen Browser (CSRF-Schutz), State ist signiert
  const nonce = randomBytes(16).toString("hex");
  const state = signToken({ nonce, ret: safeReturn, jobTitle, jobCity, exp: Date.now() + 10 * 60 * 1000 });

  const url = new URL("https://www.linkedin.com/oauth/v2/authorization");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", REDIRECT_URI);
  url.searchParams.set("scope", "openid profile email");
  url.searchParams.set("state", state);

  const res = NextResponse.redirect(url);
  res.cookies.set("li_nonce", nonce, {
    httpOnly: true, secure: true, sameSite: "lax", maxAge: 600, path: "/",
  });
  return res;
}
