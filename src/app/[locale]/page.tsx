import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { PostFeedItem, PostTile } from "@/components/PostCard";
import { SearchForm } from "@/components/SearchForm";
import { site } from "@/config/site";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getAllPosts, getAllTags, getCategories } from "@/lib/content";
import { href } from "@/lib/format";
import { getViewCounts } from "@/lib/views";

export const revalidate = 60;

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

  const [posts, categories, tags, views] = await Promise.all([
    getAllPosts(locale),
    getCategories(locale),
    getAllTags(locale),
    getViewCounts(),
  ]);
  if (!posts.length) {
    return <p className="container-x py-32 text-center text-lg text-ink-2">{t.list.empty}</p>;
  }

  const feed = posts.slice(0, site.postsPerPage);
  // Xem nhiều nhất; khi chưa đủ dữ liệu lượt xem thì bù bằng bài nổi bật rồi bài mới nhất
  const ranked = posts
    .filter((p) => (views.get(p.slug) ?? 0) > 0)
    .sort((a, b) => views.get(b.slug)! - views.get(a.slug)! || b.publishedAt.localeCompare(a.publishedAt));
  const picks = [...new Set([...ranked, ...posts.filter((p) => p.featured), ...posts])].slice(0, 3);

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
            <Panel id="most-viewed" title={t.home.mostViewed}>
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                {picks.map((post) => (
                  <li key={post.slug}>
                    <PostTile post={post} locale={locale} views={views.get(post.slug)} />
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
    </>
  );
}
