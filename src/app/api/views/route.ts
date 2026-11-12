import { NextResponse, type NextRequest } from "next/server";
import { getAllPosts } from "@/lib/content";
import { recordView } from "@/lib/views";

const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse/i;
const WINDOW_MS = 30 * 60 * 1000;
const recent = new Map<string, number>();

/**
 * Ghi một lượt xem: POST /api/views {"slug": "..."} (trang bài viết gửi qua sendBeacon).
 * Bỏ qua bot, slug không tồn tại và lượt lặp lại từ cùng IP trong 30 phút.
 */
export async function POST(request: NextRequest) {
  if (BOT.test(request.headers.get("user-agent") ?? "")) return new NextResponse(null, { status: 204 });

  let slug: unknown;
  try {
    slug = (await request.json())?.slug;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (typeof slug !== "string" || !/^[a-z0-9-]{1,160}$/.test(slug)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (!(await getAllPosts("vi")).some((p) => p.slug === slug)) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  const key = `${ip}|${slug}`;
  const now = Date.now();
  if (now - (recent.get(key) ?? 0) < WINDOW_MS) return new NextResponse(null, { status: 204 });
  recent.set(key, now);
  if (recent.size > 5000) {
    for (const [k, t] of recent) if (now - t >= WINDOW_MS) recent.delete(k);
  }

  try {
    await recordView(slug);
  } catch {
    return NextResponse.json({ ok: false }, { status: 502 });
  }
  return new NextResponse(null, { status: 204 });
}
