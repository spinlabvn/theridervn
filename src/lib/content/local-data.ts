/**
 * Nội dung chuyển từ therider.vn (8 bài + ảnh trong public/media), dùng khi chưa cấu hình Sanity.
 * Khi đã có Sanity: chạy `npm run import-therider` trong thư mục studio/ để đưa toàn bộ nội dung này lên CMS.
 */
import categoriesJson from "../../../content/categories.json";
import postsJson from "../../../content/therider.json";
import type { BodyNode, Localized, RawCategory, RawPost } from "./types";

type JsonPost = {
  slug: string;
  publishedAt: string;
  featured: boolean;
  category: string;
  tags: string[];
  author: string;
  coverUrl: string;
  coverAlt: Localized<string>;
  title: Localized<string>;
  excerpt: Localized<string>;
  body: Localized<BodyNode[]>;
};

export const localCategories: RawCategory[] = categoriesJson as RawCategory[];

const editorial = { name: "TheRider", role: { vi: "Ban biên tập", en: "Editorial team" } };

export const localPosts: RawPost[] = (postsJson as unknown as JsonPost[]).map((p) => ({
  slug: p.slug,
  publishedAt: p.publishedAt,
  featured: p.featured,
  category: localCategories.find((c) => c.slug === p.category)!,
  tags: p.tags,
  author: editorial,
  coverUrl: p.coverUrl,
  coverAlt: p.coverAlt,
  title: p.title,
  excerpt: p.excerpt,
  body: p.body,
  hasVideo: (p.body.vi ?? []).some((n) => n._type === "youtube"),
}));
