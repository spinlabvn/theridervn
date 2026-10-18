import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArchiveView } from "@/components/ArchiveView";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getAllTags, getPostsByTag } from "@/lib/content";
import { href } from "@/lib/format";

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps<"/[locale]/tag/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const tag = (await getAllTags(locale)).find((t) => t.slug === slug);
  if (!tag) return {};
  return {
    title: `#${tag.label}`,
    alternates: { canonical: href.tag(locale, slug), languages: { vi: href.tag("vi", slug), en: href.tag("en", slug) } },
  };
}

export default async function TagPage({ params }: PageProps<"/[locale]/tag/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const [tags, posts] = await Promise.all([getAllTags(locale), getPostsByTag(locale, slug)]);
  const tag = tags.find((x) => x.slug === slug);
  if (!tag) notFound();
  return (
    <ArchiveView
      locale={locale}
      eyebrow={t.list.tagTitle}
      title={`#${tag.label}`}
      total={posts.length}
      posts={posts}
      page={1}
      totalPages={1}
      hrefFor={() => href.tag(locale, slug)}
    />
  );
}
