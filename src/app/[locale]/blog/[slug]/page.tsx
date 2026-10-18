import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ArticleBody } from "@/components/ArticleBody";
import { CategoryLabel, PostCard, PostMeta } from "@/components/PostCard";
import { ReadingProgress } from "@/components/ReadingProgress";
import { ShareBar } from "@/components/ShareBar";
import { TableOfContents } from "@/components/TableOfContents";
import { site } from "@/config/site";
import { isLocale, localeMeta, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getAllPosts, getPost, getRelatedPosts } from "@/lib/content";
import { headingsOf, slugify } from "@/lib/content/text";
import { formatDate, href } from "@/lib/format";

export const revalidate = 60;
export const dynamicParams = true; // bài mới đăng trên Sanity được render ngay khi có người truy cập

export async function generateStaticParams() {
  const params = [];
  for (const locale of locales) {
    for (const post of await getAllPosts(locale)) params.push({ locale, slug: post.slug });
  }
  return params;
}

export async function generateMetadata({ params }: PageProps<"/[locale]/blog/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const post = await getPost(locale, slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: post.author.name }],
    alternates: {
      canonical: href.post(locale, slug),
      languages: { vi: href.post("vi", slug), en: href.post("en", slug), "x-default": href.post("vi", slug) },
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      locale: localeMeta[locale].ogLocale,
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      section: post.category.title,
      tags: post.tags,
      images: post.coverUrl ? [{ url: post.coverUrl, width: 2000, height: 1250, alt: post.coverAlt }] : undefined,
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt },
  };
}

export default async function PostPage({ params }: PageProps<"/[locale]/blog/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const post = await getPost(locale, slug);
  if (!post) notFound();

  const t = getDictionary(locale);
  const related = await getRelatedPosts(locale, post);
  const headings = headingsOf(post.body);
  const url = `${site.url}${href.post(locale, slug)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: post.excerpt,
    image: post.coverUrl ? [new URL(post.coverUrl, site.url).toString()] : undefined,
    datePublished: post.publishedAt,
    inLanguage: locale,
    mainEntityOfPage: url,
    articleSection: post.category.title,
    keywords: post.tags.join(", "),
    author: { "@type": "Person", name: post.author.name },
    publisher: { "@type": "Organization", name: site.name, url: site.url },
  };

  return (
    <>
      <ReadingProgress targetId="article-body" label={t.post.progress} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <article>
        <header className="container-x pt-10 sm:pt-14">
          <Link
            href={href.blog(locale)}
            className="group inline-flex min-h-11 items-center gap-2 text-sm font-medium text-ink-2 hover:text-ink"
          >
            <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" aria-hidden="true" />
            {t.post.backToStories}
          </Link>
          <div className="mx-auto mt-6 max-w-5xl text-center">
            <CategoryLabel post={post} locale={locale} solid />
            <h1 className="rise display mt-5 text-5xl sm:text-7xl lg:text-[5.5rem]">{post.title}</h1>
            <p className="rise mx-auto mt-6 max-w-3xl text-lg text-ink-2 sm:text-xl" style={{ ["--i" as string]: 1 }}>
              {post.excerpt}
            </p>
            <div className="rise mt-8 flex flex-col items-center gap-3" style={{ ["--i" as string]: 2 }}>
              <div className="flex items-center gap-3">
                {post.author.avatarUrl ? (
                  <Image
                    src={`${post.author.avatarUrl}?auto=format&w=96&h=96&fit=crop`}
                    alt=""
                    width={44}
                    height={44}
                    className="size-11 rounded-full object-cover"
                  />
                ) : (
                  <span aria-hidden="true" className="display grid size-11 place-items-center rounded-full bg-ink text-lg text-paper">
                    {post.author.name
                      .split(" ")
                      .map((w) => w[0])
                      .slice(-2)
                      .join("")}
                  </span>
                )}
                <span className="text-left text-sm">
                  <span className="block font-semibold">
                    {t.post.by} {post.author.name}
                  </span>
                  <span className="block text-ink-2">{post.author.role}</span>
                </span>
              </div>
              <PostMeta post={post} locale={locale} className="text-ink-2" />
            </div>
          </div>
        </header>

        {post.coverUrl ? (
          <figure className="container-x mt-10 sm:mt-14">
            <div className="relative aspect-[16/10] overflow-hidden bg-surface-2 lg:aspect-[21/9]">
              <Image
                src={post.coverUrl}
                alt={post.coverAlt}
                fill
                priority
                sizes="(min-width: 1320px) 1240px, 100vw"
                className="object-cover"
                style={post.coverPosition ? { objectPosition: post.coverPosition } : undefined}
              />
            </div>
          </figure>
        ) : null}

        <div className="container-x mt-12 grid gap-12 lg:mt-16 lg:grid-cols-12">
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-28 space-y-10">
              <TableOfContents headings={headings} label={t.post.contents} />
            </div>
          </aside>

          <div id="article-body" className="mx-auto w-full max-w-[44rem] lg:col-span-6">
            {post.isFallbackLanguage && locale === "en" ? (
              <p className="mb-8 border-l-4 border-accent bg-surface-2 px-4 py-3 text-sm">
                This story is currently only available in Vietnamese.
              </p>
            ) : null}
            <ArticleBody body={post.body} videoTitle={post.title} />

            <footer className="mt-14 space-y-8 border-t border-line pt-8">
              {post.tags.length ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="eyebrow mr-1 text-ink-2">{t.post.tags}</span>
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={href.tag(locale, slugify(tag))}
                      className="inline-flex min-h-10 items-center rounded-full border border-line px-4 text-sm transition-colors duration-200 hover:border-ink"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              ) : null}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <ShareBar url={url} title={post.title} labels={{ share: t.post.share, copy: t.post.copyLink, copied: t.post.copied }} />
                <p className="text-sm text-ink-2">
                  {t.post.published} <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>
                </p>
              </div>
            </footer>
          </div>
        </div>
      </article>

      {related.length ? (
        <section aria-labelledby="related" className="container-x mt-24">
          <h2 id="related" className="display border-t-4 border-ink pt-5 text-5xl sm:text-6xl">
            {t.post.related}
          </h2>
          <ul className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <li key={p.slug} className="reveal grid">
                <PostCard post={p} locale={locale} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
