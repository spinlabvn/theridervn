import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ArticleBody } from "@/components/ArticleBody";
import { CategoryLabel, PostMini } from "@/components/PostCard";
import { ReadingProgress } from "@/components/ReadingProgress";
import { ShareBar } from "@/components/ShareBar";
import { TableOfContents } from "@/components/TableOfContents";
import { ViewTracker } from "@/components/ViewTracker";
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
  const hasToc = headings.length >= 2; // TableOfContents tự ẩn khi ít hơn 2 mục
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
      <ViewTracker slug={slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <article>
        <header className="container-x pt-10 sm:pt-14">
          <Link
            href={href.category(locale, post.category.slug)}
            className="group inline-flex min-h-11 items-center gap-2 text-sm font-medium text-ink-2 hover:text-ink"
          >
            <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" aria-hidden="true" />
            {post.category.title}
          </Link>
          <div className="mx-auto mt-6 max-w-5xl text-center">
            <CategoryLabel post={post} locale={locale} solid />
            <h1 className="rise display mt-5 text-3xl sm:text-5xl lg:text-[3.5rem]">{post.title}</h1>
            <p className="rise mx-auto mt-6 max-w-3xl text-lg text-ink-2 sm:text-xl" style={{ ["--i" as string]: 1 }}>
              {post.excerpt}
            </p>
          </div>
        </header>

        {post.coverUrl ? (
          <figure className="container-x mt-10 sm:mt-14">
            {/* Ảnh bìa giữ đúng tỉ lệ gốc (không cắt), rộng bằng khối tiêu đề; chỉ ảnh dọc quá cao mới bị giới hạn chiều cao */}
            <Image
              src={post.coverUrl}
              alt={post.coverAlt}
              width={1600}
              height={1067}
              priority
              sizes="(min-width: 1064px) 1024px, 100vw"
              className="mx-auto h-auto max-h-[80vh] w-full max-w-5xl bg-surface-2 object-cover"
              style={post.coverPosition ? { objectPosition: post.coverPosition } : undefined}
            />
          </figure>
        ) : null}

        {/* Hai cột bên bằng nhau nên cột bài luôn nằm giữa trang, thẳng trục với tiêu đề và ảnh bìa; mục lục ở cột trái */}
        <div className="container-x mt-12 grid gap-12 lg:mt-16 xl:grid-cols-[13rem_minmax(0,1fr)_13rem]">
          {hasToc ? (
            <aside className="hidden xl:block">
              <div className="sticky top-28 space-y-10">
                <TableOfContents headings={headings} label={t.post.contents} />
              </div>
            </aside>
          ) : null}

          <div id="article-body" className="w-full min-w-0 xl:col-start-2">
            {post.isFallbackLanguage && locale === "en" ? (
              <p className="mx-auto mb-8 max-w-[44rem] border-l-4 border-accent bg-surface-2 px-4 py-3 text-sm">
                This story is currently only available in Vietnamese.
              </p>
            ) : null}
            <ArticleBody body={post.body} videoTitle={post.title} />

            <footer className="mx-auto mt-14 max-w-[44rem] space-y-8 border-t border-line pt-8">
              {/* Thời gian lên bài – đặt cuối bài */}
              <p className="text-sm text-ink-2">
                {t.post.published} <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>
              </p>
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
              <ShareBar url={url} title={post.title} labels={{ share: t.post.share, copy: t.post.copyLink, copied: t.post.copied }} />
            </footer>
          </div>
        </div>
      </article>

      {related.length ? (
        <section aria-labelledby="related" className="container-x mt-16 lg:mt-20">
          <h2 id="related" className="display border-t-4 border-ink pt-4 text-2xl sm:text-3xl">
            {t.post.related}
          </h2>
          <ul className="mt-4 grid gap-x-8 md:grid-cols-3">
            {related.map((p) => (
              <li key={p.slug} className="grid">
                <PostMini post={p} locale={locale} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
