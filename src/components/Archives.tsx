import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { site } from "@/config/site";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getAllPosts, getAllTags, getCategory, getPostsByCategory, getPostsByTag, paginate } from "@/lib/content";
import { href } from "@/lib/format";
import { FeedLayout } from "./FeedLayout";

/** Phân tích số trang từ URL /page/[page]; trang 1 luôn dùng URL gốc. */
export function parsePage(value: string): number {
  if (!/^\d+$/.test(value)) notFound();
  const page = Number(value);
  if (page < 2) notFound();
  return page;
}

export function homeMetadata(locale: Locale, page: number): Metadata {
  const t = getDictionary(locale);
  return {
    title: `${t.home.news} – ${t.list.page} ${page}`,
    alternates: { canonical: href.home(locale, page), languages: { vi: href.home("vi", page), en: href.home("en", page) } },
  };
}

export async function HomeArchive({ locale, page }: { locale: Locale; page: number }) {
  const t = getDictionary(locale);
  const result = paginate(await getAllPosts(locale), page);
  if (page > result.totalPages) notFound();
  return (
    <>
      <h1 className="sr-only">
        {site.name} – {t.home.eyebrow}
        {page > 1 ? ` – ${t.list.page} ${page}` : ""}
      </h1>
      <FeedLayout
        locale={locale}
        title={t.home.news}
        showSearch={page === 1}
        posts={result.items}
        page={result.page}
        totalPages={result.totalPages}
        hrefFor={(p) => href.home(locale, p)}
      />
    </>
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
  const [category, posts] = await Promise.all([getCategory(locale, slug), getPostsByCategory(locale, slug)]);
  if (!category) notFound();
  const result = paginate(posts, page);
  if (page > result.totalPages) notFound();
  return (
    <FeedLayout
      locale={locale}
      title={category.title}
      isPageTitle
      lead={category.description}
      posts={result.items}
      page={result.page}
      totalPages={result.totalPages}
      hrefFor={(p) => href.category(locale, slug, p)}
    />
  );
}

export async function tagMetadata(locale: Locale, slug: string, page = 1): Promise<Metadata> {
  const tag = (await getAllTags(locale)).find((x) => x.slug === slug);
  if (!tag) return {};
  const t = getDictionary(locale);
  return {
    title: page > 1 ? `#${tag.label} – ${t.list.page} ${page}` : `#${tag.label}`,
    alternates: { canonical: href.tag(locale, slug, page), languages: { vi: href.tag("vi", slug, page), en: href.tag("en", slug, page) } },
  };
}

export async function TagArchive({ locale, slug, page }: { locale: Locale; slug: string; page: number }) {
  const [tags, posts] = await Promise.all([getAllTags(locale), getPostsByTag(locale, slug)]);
  const tag = tags.find((x) => x.slug === slug);
  if (!tag) notFound();
  const result = paginate(posts, page);
  if (page > result.totalPages) notFound();
  return (
    <FeedLayout
      locale={locale}
      title={`#${tag.label}`}
      isPageTitle
      posts={result.items}
      page={result.page}
      totalPages={result.totalPages}
      hrefFor={(p) => href.tag(locale, slug, p)}
    />
  );
}
