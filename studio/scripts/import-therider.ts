/**
 * Đưa toàn bộ nội dung đã chuyển từ therider.vn lên Sanity:
 *   - 8 chuyên mục (content/categories.json)
 *   - tác giả "TheRider"
 *   - 8 bài viết song ngữ (content/therider.json) kèm ảnh trong public/media
 *
 * Chạy trong thư mục studio/:  npm run import-therider
 * Chạy lại nhiều lần vẫn an toàn: tài liệu dùng _id cố định nên chỉ được ghi đè.
 */
import { readFileSync, createReadStream } from "node:fs";
import { basename, resolve } from "node:path";
import { getCliClient } from "sanity/cli";

type Loc<T> = { vi?: T; en?: T };
type Node = { _type: string; _key: string; [k: string]: unknown };
type Post = {
  slug: string;
  publishedAt: string;
  featured: boolean;
  category: string;
  tags: string[];
  coverUrl: string;
  coverAlt: Loc<string>;
  title: Loc<string>;
  excerpt: Loc<string>;
  body: Loc<Node[]>;
};

const root = resolve(process.cwd(), "..");
const read = <T>(file: string): T => JSON.parse(readFileSync(resolve(root, file), "utf8"));
const client = getCliClient({ apiVersion: "2025-02-19" });

const uploaded = new Map<string, string>();
async function asset(url: string): Promise<string> {
  if (uploaded.has(url)) return uploaded.get(url)!;
  const file = resolve(root, "public", url.replace(/^\//, ""));
  const doc = await client.assets.upload("image", createReadStream(file), { filename: basename(file) });
  uploaded.set(url, doc._id);
  console.log("  ảnh:", basename(file));
  return doc._id;
}

const image = async (url: string, extra: Record<string, unknown> = {}) => ({
  _type: "image",
  asset: { _type: "reference", _ref: await asset(url) },
  ...extra,
});

/** figure → image, gallery → nhiều image; youtube/specTable/block giữ nguyên. */
async function toSanityBody(nodes: Node[] = []) {
  const out: Record<string, unknown>[] = [];
  for (const n of nodes) {
    if (n._type === "figure") {
      out.push({ _key: n._key, ...(await image(n.url as string, { alt: n.alt || "", caption: n.caption || undefined })) });
    } else if (n._type === "gallery") {
      for (const img of n.images as { _key: string; url: string; alt?: string }[]) {
        out.push({ _key: img._key, ...(await image(img.url, { alt: img.alt || "" })) });
      }
    } else {
      out.push(n);
    }
  }
  return out;
}

async function main() {
  const categories = read<{ slug: string; order: number; title: Loc<string>; description: Loc<string> }[]>("content/categories.json");
  const posts = read<Post[]>("content/therider.json");
  const tx = client.transaction();

  for (const c of categories) {
    tx.createOrReplace({
      _id: `category-${c.slug}`,
      _type: "category",
      title: { _type: "localeString", ...c.title },
      slug: { _type: "slug", current: c.slug },
      description: { _type: "localeText", ...c.description },
      order: c.order,
    });
  }

  tx.createOrReplace({
    _id: "author-therider",
    _type: "author",
    name: "TheRider",
    role: { _type: "localeString", vi: "Ban biên tập", en: "Editorial team" },
  });

  for (const p of posts) {
    console.log("Bài:", p.slug);
    tx.createOrReplace({
      _id: `post-${p.slug}`,
      _type: "post",
      title: { _type: "localeString", ...p.title },
      slug: { _type: "slug", current: p.slug },
      excerpt: { _type: "localeText", ...p.excerpt },
      coverImage: await image(p.coverUrl, { alt: { _type: "localeString", ...p.coverAlt } }),
      body: { _type: "localeBlockContent", vi: await toSanityBody(p.body.vi), en: await toSanityBody(p.body.en) },
      category: { _type: "reference", _ref: `category-${p.category}` },
      author: { _type: "reference", _ref: "author-therider" },
      tags: p.tags,
      publishedAt: p.publishedAt,
      featured: p.featured,
    });
  }

  await tx.commit();
  console.log(`Xong: ${categories.length} chuyên mục, ${posts.length} bài, ${uploaded.size} ảnh.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
