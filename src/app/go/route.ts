import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createHmac, timingSafeEqual } from "node:crypto";

export const dynamic = "force-dynamic";

// Link scanners and crawlers open links automatically; don't report those as clicks.
const BOT_RE =
  /bot|crawl|spider|preview|prefetch|scan|slurp|facebookexternalhit|headless|python|curl|wget|java\/|proofpoint|mimecast|barracuda|safelinks|googleimageproxy|monitor|check/i;

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Outreach emails link here as /go?v=<vertical>&c=<clinic>&s=<signature>.
// The signature is an HMAC of "<vertical>|<clinic>" keyed with the server's RESEND_API_KEY,
// so only links we generated can trigger a notification.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const v = (url.searchParams.get("v") ?? "").slice(0, 30);
  const c = (url.searchParams.get("c") ?? "").slice(0, 120);
  const s = url.searchParams.get("s") ?? "";

  const dest = new URL("/kontakt", url.origin);
  dest.searchParams.set("utm_source", "email");
  dest.searchParams.set("utm_medium", "outreach");
  if (v) dest.searchParams.set("utm_campaign", v);

  const key = process.env.RESEND_API_KEY;
  let valid = false;
  if (key && v && c && s) {
    const expected = createHmac("sha256", key).update(`${v}|${c}`).digest("hex").slice(0, 16);
    valid = s.length === expected.length && timingSafeEqual(Buffer.from(s), Buffer.from(expected));
  }

  if (valid && key) {
    dest.searchParams.set("clinic", c);
    const ua = request.headers.get("user-agent") ?? "";
    if (!BOT_RE.test(ua)) {
      try {
        const when = new Intl.DateTimeFormat("nb-NO", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Oslo" }).format(new Date());
        await new Resend(key).emails.send({
          from: "DentDigital <post@dentdigital.no>",
          to: ["post@dentdigital.no"],
          subject: `Klikk: ${c} (${v})`,
          html: `<p><strong>${esc(c)}</strong> klikket på «Book en uforpliktende prat» i e-posten (${esc(v)}).</p><p>Tid: ${esc(when)}</p><p style="color:#667">Kan i sjeldne tilfeller være en automatisk lenkeskanner.</p>`,
        });
      } catch (err) {
        console.error("Click notification failed:", err);
      }
    }
  }

  return NextResponse.redirect(dest, 302);
}
