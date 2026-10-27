import { NextResponse } from "next/server";
import { GDTS_POSTS, osloDate } from "@/lib/social-schedule";
import { publishFacebook, publishInstagram } from "@/lib/social-publish";

// IG Reels need time to process before they can be published.
export const maxDuration = 300;

/**
 * Weekly organic Reel for Groruddalen Tannlegesenter (FB + IG).
 * Triggered by Vercel Cron on Saturdays (vercel.json). Protected by CRON_SECRET.
 * Optional ?date=YYYY-MM-DD to catch up a missed week, ?dry=1 to test without publishing.
 */
export async function GET(req: Request) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const token = process.env.META_PAGE_ACCESS_TOKEN_GDTS;
  if (!token) return NextResponse.json({ error: "META_PAGE_ACCESS_TOKEN_GDTS not set" }, { status: 500 });

  const url = new URL(req.url);
  const date = url.searchParams.get("date") ?? osloDate();
  const dryRun = url.searchParams.get("dry") === "1";
  const post = GDTS_POSTS.find((p) => p.date === date);
  if (!post) return NextResponse.json({ ok: true, date, result: "nothing scheduled" });

  const [instagram, facebook] = await Promise.allSettled([
    publishInstagram(post, token, dryRun),
    publishFacebook(post, token, dryRun),
  ]);
  const out = (r: PromiseSettledResult<string>) => (r.status === "fulfilled" ? r.value : `ERROR: ${r.reason}`);
  const result = { ok: instagram.status === "fulfilled" && facebook.status === "fulfilled", date, tag: post.tag, instagram: out(instagram), facebook: out(facebook) };
  if (!result.ok) console.error("social-weekly", result);
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
