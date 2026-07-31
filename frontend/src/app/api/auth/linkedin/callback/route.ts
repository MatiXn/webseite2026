import { NextRequest, NextResponse } from "next/server";
import { signToken, verifyToken } from "@/lib/confirm-token";

// OAuth-Rückweg von LinkedIn: Code gegen Token tauschen, Profil abrufen und
// die verifizierten Daten (Name, E-Mail) signiert ans Formular übergeben.
const REDIRECT_URI = "https://www.phe-perm.de/api/auth/linkedin/callback";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code") ?? "";
  const state = verifyToken(req.nextUrl.searchParams.get("state") ?? "");
  const nonceCookie = req.cookies.get("li_nonce")?.value;
  const ret = typeof state?.ret === "string" && state.ret.startsWith("/") ? state.ret : "/jobs";

  const fail = (reason: string) =>
    NextResponse.redirect(new URL(`${ret}?linkedin=${reason}`, req.url));

  if (!code || !state || !nonceCookie || state.nonce !== nonceCookie) {
    return fail("error");
  }

  const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  if (!clientId || !clientSecret) return fail("unavailable");

  try {
    const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
        client_id: clientId,
        client_secret: clientSecret,
      }),
      signal: AbortSignal.timeout(8000),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData?.access_token) return fail("error");

    const userRes = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
      signal: AbortSignal.timeout(8000),
    });
    const user = await userRes.json();
    if (typeof user?.email !== "string" || typeof user?.name !== "string") {
      return fail("error");
    }

    // Signiertes Kurzzeit-Token: beweist dem Contact-API später, dass die
    // E-Mail wirklich von LinkedIn verifiziert wurde
    const liToken = signToken({
      liName: user.name,
      liEmail: user.email,
      exp: Date.now() + 30 * 60 * 1000,
    });

    const res = NextResponse.redirect(new URL(`${ret}?linkedin=success`, req.url));
    // JS-lesbar fürs Formular-Prefill; die Signatur im Token verhindert Manipulation
    res.cookies.set(
      "li_profile",
      Buffer.from(JSON.stringify({ name: user.name, email: user.email, token: liToken })).toString("base64url"),
      { httpOnly: false, secure: true, sameSite: "lax", maxAge: 1800, path: "/" }
    );
    res.cookies.delete("li_nonce");
    return res;
  } catch {
    return fail("error");
  }
}
