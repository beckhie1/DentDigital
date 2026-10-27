import { GDTS_SOCIAL, fbCaption, igCaption, type SocialPost } from "./social-schedule";

/** Publishes one Reel to the GDTS Instagram account and Facebook page via the Graph API. */

const G = "https://graph.facebook.com/v21.0";
const firstLine = (p: SocialPost) => p.text.split("\n")[0];

async function graph<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const sep = path.includes("?") ? "&" : "?";
  const res = await fetch(`${G}/${path}${sep}access_token=${encodeURIComponent(token)}`, init);
  const json = await res.json();
  if (json.error) throw new Error(`${path.split("?")[0]}: ${json.error.message}`);
  return json as T;
}

const form = (params: Record<string, string>) => ({ method: "POST", body: new URLSearchParams(params) });

/** Returns "skipped" if a post with the same first line already exists (cron retries are safe). */
export async function publishInstagram(post: SocialPost, token: string, dryRun = false): Promise<string> {
  const ig = GDTS_SOCIAL.igUserId;
  const recent = await graph<{ data: { caption?: string }[] }>(`${ig}/media?fields=caption&limit=15`, token);
  if (recent.data.some((m) => m.caption?.startsWith(firstLine(post)))) return "skipped (already posted)";

  const { id: container } = await graph<{ id: string }>(
    `${ig}/media`,
    token,
    form({ media_type: "REELS", video_url: post.videoUrl, caption: igCaption(post), share_to_feed: "true" }),
  );
  for (let i = 0; i < 48; i++) {
    const { status_code, status } = await graph<{ status_code: string; status?: string }>(
      `${container}?fields=status_code,status`,
      token,
    );
    if (status_code === "FINISHED") break;
    if (status_code === "ERROR" || status_code === "EXPIRED") throw new Error(`IG container ${status_code}: ${status}`);
    if (i === 47) throw new Error(`IG container still ${status_code} after 4 min`);
    await new Promise((r) => setTimeout(r, 5000));
  }
  if (dryRun) return `dry-run ok (container ${container} ready, not published)`;
  const { id } = await graph<{ id: string }>(`${ig}/media_publish`, token, form({ creation_id: container }));
  return `published ${id}`;
}

export async function publishFacebook(post: SocialPost, token: string, dryRun = false): Promise<string> {
  const page = GDTS_SOCIAL.pageId;
  const recent = await graph<{ data: { description?: string }[] }>(`${page}/video_reels?fields=description&limit=15`, token);
  if (recent.data.some((v) => v.description?.startsWith(firstLine(post)))) return "skipped (already posted)";
  if (dryRun) return "dry-run ok (page token can read reels)";

  const { video_id } = await graph<{ video_id: string }>(`${page}/video_reels`, token, form({ upload_phase: "start" }));
  const up = await fetch(`https://rupload.facebook.com/video-upload/v21.0/${video_id}`, {
    method: "POST",
    headers: { Authorization: `OAuth ${token}`, file_url: post.videoUrl },
  });
  const upJson = await up.json();
  if (!upJson.success) throw new Error(`FB upload: ${JSON.stringify(upJson)}`);
  await graph(
    `${page}/video_reels`,
    token,
    form({ upload_phase: "finish", video_id, video_state: "PUBLISHED", description: fbCaption(post) }),
  );
  return `published ${video_id}`;
}
