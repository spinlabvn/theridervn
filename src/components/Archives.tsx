import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getCategories, getAllPosts, getCategory, getPostsByCategory, paginate } from "@/lib/content";
import { href } from "@/lib/format";
import { ArchiveView } from "./ArchiveView";

/** Phân tích số trang từ URL /page/[page]; trang 1 luôn dùng URL gốc. */
export function parsePage(value: string): number {
  if (!/^\d+$/.test(value)) notFound();
  const page = Number(value);
  if (page < 2) notFound();
  return page;
}

export function blogMetadata(locale: Locale, page = 1): Metadata {
  const t = getDictionary(locale);
  return {
    title: page > 1 ? `${t.list.title} – ${t.list.page} ${page}` : t.list.title,
    description: t.list.lead,
    alternates: { canonical: href.blog(locale, page), languages: { vi: href.blog("vi", page), en: href.blog("en", page) } },
  };
}

export async function BlogArchive({ locale, page }: { locale: Locale; page: number }) {
  const t = getDictionary(locale);
  const [posts, categories] = await Promise.all([getAllPosts(locale), getCategories(locale)]);
  const result = paginate(posts, page);
  if (page > result.totalPages) notFound();
  return (
    <ArchiveView
      locale={locale}
      eyebrow="TheRider"
      title={t.list.title}
      lead={t.list.lead}
      total={result.total}
      posts={result.items}
      categories={categories}
      page={result.page}
      totalPages={result.totalPages}
      hrefFor={(p) => href.blog(locale, p)}
    />
  );
}

export async function categoryMetadata(locale: Locale, slug: string, page = 1): Promise<Metadata> {
  const category = await getCategory(locale, slug);
  if (!category) return {};
  const t = getDictionary(locale);
  return {
    title: page > 1 ? `${category.title} – ${t.list.page} ${page}` : category.title,
    description: category.description,
    alternates: {
      canonical: href.category(locale, slug, page),
      languages: { vi: href.category("vi", slug, page), en: href.category("en", slug, page) },
    },
  };
}

export async function CategoryArchive({ locale, slug, page }: { locale: Locale; slug: string; page: number }) {
  const t = getDictionary(locale);
  const [category, categories, posts] = await Promise.all([
    getCategory(locale, slug),
    getCategories(locale),
    getPostsByCategory(locale, slug),
  ]);
  if (!category) notFound();
  const result = paginate(posts, page);
  if (page > result.totalPages) notFound();
  return (
    <ArchiveView
      locale={locale}
      eyebrow={t.nav.categories}
      title={category.title}
      lead={category.description}
      total={result.total}
      posts={result.items}
      categories={categories}
      activeCategory={slug}
      page={result.page}
      totalPages={result.totalPages}
      hrefFor={(p) => href.category(locale, slug, p)}
    />
  );
}
