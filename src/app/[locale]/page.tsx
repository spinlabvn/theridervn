import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { PostFeedItem, PostTile } from "@/components/PostCard";
import { SearchForm } from "@/components/SearchForm";
import { site } from "@/config/site";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getAllPosts, getAllTags, getCategories } from "@/lib/content";
import { href } from "@/lib/format";

export const revalidate = 60;

function SectionHeading({ title, lead, link }: { title: string; lead?: string; link?: { href: string; label: string } }) {
  return (
    <div className="mb-10 flex flex-col gap-4 border-t-4 border-ink pt-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="display text-5xl sm:text-6xl">{title}</h2>
        {lead ? <p className="mt-2 max-w-xl text-ink-2">{lead}</p> : null}
      </div>
      {link ? (
        <Link href={link.href} className="group inline-flex min-h-11 shrink-0 items-center gap-2 font-semibold">
          <span className="link-title">{link.label}</span>
          <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      ) : null}
    </div>
  );
}

/** Khối có thanh tiêu đề đỏ thương hiệu, như các hộp trên Pinkbike. */
function Panel({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="border border-line">
      <h2 id={id} className="on-brand display bg-paper px-4 pb-1.5 pt-2 text-2xl text-ink">
        {title}
      </h2>
      <div className="p-4 sm:px-5">{children}</div>
    </section>
  );
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  const [posts, categories, tags] = await Promise.all([getAllPosts(locale), getCategories(locale), getAllTags(locale)]);
  if (!posts.length) {
    return <p className="container-x py-32 text-center text-lg text-ink-2">{t.list.empty}</p>;
  }

  const feed = posts.slice(0, site.postsPerPage);
  const picks = posts.filter((p) => p.featured).slice(0, 3);
  const coverFor = (slug: string) => posts.find((p) => p.category.slug === slug && p.coverUrl);

  return (
    <>
      <h1 className="sr-only">
        {site.name} – {t.home.eyebrow}
      </h1>

      {/* Dòng tin kiểu Pinkbike: chuyên mục | tin mới nhất | biên tập chọn + thẻ */}
      <div className="container-x grid gap-8 pt-8 lg:grid-cols-12 lg:pt-10">
        <aside className="hidden xl:col-span-2 xl:block">
          <Panel id="home-categories" title={t.nav.categories}>
            <ul className="-my-1">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={href.category(locale, c.slug)}
                    className="flex min-h-10 items-center justify-between gap-2 text-[0.9375rem] font-medium hover:text-accent-ink"
                  >
                    {c.title}
                    <span className="text-[0.8125rem] tabular-nums text-ink-2">{c.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>
        </aside>

        <div className="min-w-0 lg:col-span-8 xl:col-span-7">
          <Panel id="latest" title={t.home.news}>
            <SearchForm locale={locale} size="md" />
            <ul className="mt-1 divide-y divide-line">
              {feed.map((post, i) => (
                <li key={post.slug}>
                  <PostFeedItem post={post} locale={locale} priority={i < 2} />
                </li>
              ))}
            </ul>
            <Link
              href={href.blog(locale)}
              className="group mt-2 flex min-h-12 items-center justify-center gap-2 border-t border-line pt-2 font-semibold"
            >
              <span className="link-title">{t.home.allStories}</span>
              <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </Panel>
        </div>

        <aside className="space-y-8 lg:col-span-4 xl:col-span-3">
          {picks.length ? (
            <Panel id="picks" title={t.home.editorsPick}>
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                {picks.map((post) => (
                  <li key={post.slug}>
                    <PostTile post={post} locale={locale} />
                  </li>
                ))}
              </ul>
            </Panel>
          ) : null}
          {tags.length ? (
            <Panel id="home-tags" title={t.home.popularTags}>
              <div className="flex flex-wrap gap-1.5">
                {tags.slice(0, 12).map((tag) => (
                  <Link
                    key={tag.slug}
                    href={href.tag(locale, tag.slug)}
                    className="inline-flex min-h-8 items-center rounded-sm bg-surface-2 px-2.5 text-[0.8125rem] text-ink-2 hover:bg-ink hover:text-paper"
                  >
                    {tag.label}
                  </Link>
                ))}
              </div>
            </Panel>
          ) : null}
        </aside>
      </div>

      {/* Chuyên mục */}
      <section aria-labelledby="explore" className="container-x pt-24 lg:pt-32">
        <div id="explore">
          <SectionHeading title={t.home.exploreTitle} lead={t.home.exploreLead} />
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories
            .filter((c) => c.count > 0)
            .map((c) => {
            const cover = coverFor(c.slug);
            return (
              <li key={c.slug} className="reveal grid">
                <Link
                  href={href.category(locale, c.slug)}
                  className="group scheme-dark relative isolate flex min-h-64 flex-col justify-between overflow-hidden bg-paper p-6 text-ink"
                >
                  {cover ? (
                    <Image
                      src={cover.coverUrl}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="media-zoom -z-10 object-cover opacity-55 transition-opacity duration-500 group-hover:opacity-75"
                      style={cover.coverPosition ? { objectPosition: cover.coverPosition } : undefined}
                    />
                  ) : null}
                  <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 to-black/20" />
                  <span className="eyebrow self-start rounded-full bg-black/40 px-3 py-1.5 text-white/90 backdrop-blur-sm">
                    {t.list.storiesCount(c.count)}
                  </span>
                  <span>
                    <span className="display flex items-center justify-between gap-4 text-5xl text-white">
                      {c.title}
                      <ArrowUpRight
                        className="size-8 shrink-0 text-accent transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="mt-2 block text-white/80">{c.description}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Tìm kiếm */}
      <section aria-labelledby="search-cta" className="container-x pt-24 lg:pt-32">
        <div className="grid gap-10 bg-surface-2 p-6 sm:p-10 lg:grid-cols-12 lg:p-16">
          <div className="lg:col-span-5">
            <h2 id="search-cta" className="display text-5xl sm:text-6xl">
              {t.home.searchTitle}
            </h2>
            <p className="mt-4 text-lg text-ink-2">{t.home.searchLead}</p>
          </div>
          <div className="lg:col-span-7 lg:self-end">
            <SearchForm locale={locale} />
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="eyebrow mr-1 text-ink-2">{t.search.popular}</span>
              {tags.slice(0, 6).map((tag) => (
                <Link
                  key={tag.slug}
                  href={href.tag(locale, tag.slug)}
                  className="inline-flex min-h-10 items-center rounded-full border border-line bg-paper px-4 text-sm transition-colors duration-200 hover:border-ink"
                >
                  #{tag.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
