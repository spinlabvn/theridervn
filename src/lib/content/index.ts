import "server-only";
import { cache } from "react";
import { site } from "@/config/site";
import type { Locale } from "@/i18n/config";
import { localCategories, localPosts } from "./local-data";
import { sanityCategories, sanityEnabled, sanityPost, sanityPostSummaries } from "./sanity";
import { bodyToPlainText, normalizeText, slugify } from "./text";
import type { BodyNode, Category, Localized, Post, PostSummary, RawCategory, RawPost } from "./types";

export type { Category, Post, PostSummary } from "./types";

type RawSummary = Omit<RawPost, "body"> & { plain: Localized<string> };

function pick<T>(value: Localized<T> | undefined, locale: Locale, fallback: T): T {
  if (!value) return fallback;
  return value[locale] ?? value.vi ?? value.en ?? fallback;
}

/* ------------------------------------------------------------------ */
/* Nguồn dữ liệu: Sanity nếu đã cấu hình, ngược lại dùng nội dung      */
/* đã chuyển từ therider.vn (content/*.json)                          */
/* ------------------------------------------------------------------ */

const loadCategories = cache(async (): Promise<RawCategory[]> => {
  return sanityEnabled ? sanityCategories() : localCategories;
});

const loadSummaries = cache(async (): Promise<RawSummary[]> => {
  if (sanityEnabled) return sanityPostSummaries();
  return [...localPosts]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .map(({ body, ...rest }) => ({
      ...rest,
      plain: { vi: bodyToPlainText(body.vi ?? []), en: bodyToPlainText(body.en ?? []) },
    }));
});

const loadPost = cache(async (slug: string): Promise<(RawSummary & { body: Localized<BodyNode[]> }) | null> => {
  if (sanityEnabled) return sanityPost(slug);
  const post = localPosts.find((p) => p.slug === slug);
  if (!post) return null;
  return {
    ...post,
    plain: { vi: bodyToPlainText(post.body.vi ?? []), en: bodyToPlainText(post.body.en ?? []) },
  };
});

/* ------------------------------------------------------------------ */
/* Chuyển dữ liệu thô sang dạng đã chọn ngôn ngữ                       */
/* ------------------------------------------------------------------ */

function minutesFromPlain(text: string) {
  return Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 220));
}

function localizeSummary(raw: RawSummary, locale: Locale): PostSummary {
  return {
    slug: raw.slug,
    title: pick(raw.title, locale, "Untitled"),
    excerpt: pick(raw.excerpt, locale, ""),
    coverUrl: raw.coverUrl,
    coverPosition: raw.coverPosition,
    coverAlt: pick(raw.coverAlt, locale, ""),
    category: {
      slug: raw.category?.slug ?? "uncategorized",
      title: pick(raw.category?.title, locale, ""),
    },
    tags: raw.tags ?? [],
    author: {
      name: raw.author?.name ?? site.name,
      role: pick(raw.author?.role, locale, ""),
      avatarUrl: raw.author?.avatarUrl,
    },
    publishedAt: raw.publishedAt,
    featured: raw.featured,
    readingMinutes: minutesFromPlain(pick(raw.plain, locale, "")),
    isVideo: Boolean(raw.hasVideo) && pick(raw.plain, locale, "").split(/\s+/).filter(Boolean).length < 120,
  };
}

/* ------------------------------------------------------------------ */
/* API công khai cho các trang                                          */
/* ------------------------------------------------------------------ */

export async function getAllPosts(locale: Locale): Promise<PostSummary[]> {
  return (await loadSummaries()).map((p) => localizeSummary(p, locale));
}

export async function getCategories(locale: Locale): Promise<Category[]> {
  const [cats, posts] = await Promise.all([loadCategories(), loadSummaries()]);
  return cats.map((c) => ({
    slug: c.slug,
    title: pick(c.title, locale, c.slug),
    description: pick(c.description, locale, ""),
    count: posts.filter((p) => p.category?.slug === c.slug).length,
  }));
}

export async function getCategory(locale: Locale, slug: string): Promise<Category | null> {
  return (await getCategories(locale)).find((c) => c.slug === slug) ?? null;
}

export function paginate<T>(items: T[], page: number, perPage = site.postsPerPage) {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const current = Math.min(Math.max(1, page), totalPages);
  return {
    items: items.slice((current - 1) * perPage, current * perPage),
    page: current,
    totalPages,
    total: items.length,
  };
}

export async function getPostsByCategory(locale: Locale, slug: string) {
  return (await getAllPosts(locale)).filter((p) => p.category.slug === slug);
}

/** Thẻ được so khớp theo dạng slug (không dấu) để URL luôn gọn: /tag/ha-giang */
export async function getAllTags(locale: Locale) {
  const map = new Map<string, { slug: string; label: string; count: number }>();
  for (const post of await getAllPosts(locale)) {
    for (const tag of post.tags) {
      const slug = slugify(tag);
      const entry = map.get(slug) ?? { slug, label: tag, count: 0 };
      entry.count += 1;
      map.set(slug, entry);
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
}

export async function getPostsByTag(locale: Locale, tagSlug: string) {
  return (await getAllPosts(locale)).filter((p) => p.tags.some((t) => slugify(t) === tagSlug));
}

export async function getPost(locale: Locale, slug: string): Promise<Post | null> {
  const raw = await loadPost(slug);
  if (!raw) return null;
  const own = raw.body[locale];
  const body = own?.length ? own : (raw.body.vi ?? raw.body.en ?? []);
  return {
    ...localizeSummary(raw, locale),
    body,
    isFallbackLanguage: !own?.length || !raw.title[locale],
  };
}

export async function getRelatedPosts(locale: Locale, post: PostSummary, limit = 3) {
  const all = (await getAllPosts(locale)).filter((p) => p.slug !== post.slug);
  const score = (p: PostSummary) =>
    (p.category.slug === post.category.slug ? 3 : 0) + p.tags.filter((t) => post.tags.includes(t)).length;
  return all
    .map((p) => ({ p, s: score(p) }))
    .sort((a, b) => b.s - a.s || b.p.publishedAt.localeCompare(a.p.publishedAt))
    .slice(0, limit)
    .map(({ p }) => p);
}

/**
 * Tìm kiếm không phân biệt dấu ("da lat" khớp "Đà Lạt"), chấm điểm theo vị trí khớp:
 * tiêu đề > thẻ > tóm tắt > thân bài.
 */
export async function searchPosts(locale: Locale, rawQuery: string): Promise<PostSummary[]> {
  const terms = normalizeText(rawQuery).split(/\s+/).filter((t) => t.length > 1);
  if (!terms.length) return [];
  const raws = await loadSummaries();
  return raws
    .map((raw) => {
      const p = localizeSummary(raw, locale);
      const fields = {
        title: normalizeText(p.title),
        tags: normalizeText(p.tags.join(" ")),
        category: normalizeText(p.category.title),
        excerpt: normalizeText(p.excerpt),
        body: normalizeText(pick(raw.plain, locale, "")),
      };
      let score = 0;
      for (const term of terms) {
        const hit =
          (fields.title.includes(term) ? 8 : 0) +
          (fields.tags.includes(term) ? 5 : 0) +
          (fields.category.includes(term) ? 4 : 0) +
          (fields.excerpt.includes(term) ? 3 : 0) +
          (fields.body.includes(term) ? 1 : 0);
        if (!hit) return { p, score: 0 }; // mọi từ khoá đều phải xuất hiện
        score += hit;
      }
      return { p, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || b.p.publishedAt.localeCompare(a.p.publishedAt))
    .map((r) => r.p);
}
