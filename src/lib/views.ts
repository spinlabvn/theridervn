import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

/*
 * Lượt xem bài viết.
 * - Có SANITY_API_WRITE_TOKEN: lưu trên Sanity, mỗi bài một tài liệu "postViews.<slug>"
 *   (ID có dấu chấm nên không đọc công khai được; không kích hoạt webhook vì khác _type "post").
 * - Không có: lưu file JSON trên máy chủ (VIEWS_FILE, mặc định .data/views.json). File có thể
 *   mất khi Hostinger deploy lại, nên khi chạy thật hãy dùng Sanity.
 */

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const writeToken = process.env.SANITY_API_WRITE_TOKEN;

const sanity =
  projectId && writeToken
    ? createClient({
        projectId,
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
        apiVersion: "2025-02-19",
        token: writeToken,
        useCdn: false,
      })
    : null;

const FILE = process.env.VIEWS_FILE || path.join(process.cwd(), ".data", "views.json");

let fileCounts: Map<string, number> | null = null;
let writeTimer: NodeJS.Timeout | null = null;

async function loadFile(): Promise<Map<string, number>> {
  if (fileCounts) return fileCounts;
  try {
    fileCounts = new Map(Object.entries(JSON.parse(await fs.readFile(/*turbopackIgnore: true*/ FILE, "utf8")) as Record<string, number>));
  } catch {
    fileCounts = new Map();
  }
  return fileCounts;
}

/** Gom nhiều lượt xem rồi ghi file một lần, tránh ghi đĩa liên tục. */
function scheduleWrite() {
  if (writeTimer) return;
  writeTimer = setTimeout(async () => {
    writeTimer = null;
    if (!fileCounts) return;
    await fs.mkdir(/*turbopackIgnore: true*/ path.dirname(FILE), { recursive: true });
    const tmp = `${FILE}.tmp`;
    await fs.writeFile(/*turbopackIgnore: true*/ tmp, JSON.stringify(Object.fromEntries(fileCounts)));
    await fs.rename(/*turbopackIgnore: true*/ tmp, FILE);
  }, 2000);
}

export async function recordView(slug: string): Promise<void> {
  if (sanity) {
    const id = `postViews.${slug}`;
    await sanity
      .transaction()
      .createIfNotExists({ _id: id, _type: "postViews", slug, views: 0 })
      .patch(id, (p) => p.inc({ views: 1 }))
      .commit({ visibility: "async" });
    return;
  }
  const counts = await loadFile();
  counts.set(slug, (counts.get(slug) ?? 0) + 1);
  scheduleWrite();
}

/** slug → số lượt xem. Lỗi đọc (mạng, quyền) trả về rỗng để trang chủ vẫn hiển thị. */
export async function getViewCounts(): Promise<Map<string, number>> {
  try {
    if (sanity) {
      const rows = await sanity.fetch<{ slug: string; views: number }[]>(
        `*[_type == "postViews"]{slug, views}`,
        {},
        { next: { revalidate: 60, tags: ["views"] } },
      );
      return new Map(rows.map((r) => [r.slug, r.views]));
    }
    // Đọc thẳng từ đĩa: trang và route API có thể là hai bản module khác nhau, không chung bộ nhớ.
    return new Map(Object.entries(JSON.parse(await fs.readFile(/*turbopackIgnore: true*/ FILE, "utf8")) as Record<string, number>));
  } catch {
    return new Map();
  }
}
