import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import type { Category, PostSummary } from "@/lib/content";
import { href } from "@/lib/format";
import { Pagination } from "./Pagination";
import { PostCard } from "./PostCard";

/** Bố cục chung cho trang "Tất cả bài viết", trang chuyên mục và trang thẻ. */
export function ArchiveView({
  locale,
  eyebrow,
  title,
  lead,
  total,
  posts,
  categories,
  activeCategory,
  page,
  totalPages,
  hrefFor,
}: {
  locale: Locale;
  eyebrow?: string;
  title: string;
  lead?: string;
  total: number;
  posts: PostSummary[];
  categories?: Category[];
  activeCategory?: string;
  page: number;
  totalPages: number;
  hrefFor: (page: number) => string;
}) {
  const t = getDictionary(locale);
  const chip =
    "inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full border px-4 text-sm font-medium transition-colors duration-200";

  return (
    <div className="container-x pt-12 sm:pt-16">
      <header className="grid gap-6 border-b border-line pb-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          {eyebrow ? <p className="eyebrow text-accent-ink">{eyebrow}</p> : null}
          <h1 className="display mt-3 text-6xl sm:text-7xl lg:text-8xl">{title}</h1>
        </div>
        <div className="lg:col-span-4">
          {lead ? <p className="text-lg text-ink-2">{lead}</p> : null}
          <p className="eyebrow mt-3 text-ink-2">{t.list.storiesCount(total)}</p>
        </div>
      </header>

      {categories?.length ? (
        <nav aria-label={t.nav.categories} className="-mx-4 overflow-x-auto px-4 py-6 [scrollbar-width:none] sm:mx-0 sm:px-0">
          <ul className="flex gap-2">
            <li>
              <Link
                href={href.blog(locale)}
                aria-current={!activeCategory ? "page" : undefined}
                className={`${chip} ${!activeCategory ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"}`}
              >
                {t.list.all}
              </Link>
            </li>
            {categories.map((c) => {
              const active = c.slug === activeCategory;
              return (
                <li key={c.slug}>
                  <Link
                    href={href.category(locale, c.slug)}
                    aria-current={active ? "page" : undefined}
                    className={`${chip} ${active ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"}`}
                  >
                    {c.title}
                    <span className={`text-xs ${active ? "text-paper/70" : "text-ink-2"}`}>{c.count}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      ) : (
        <div className="h-10" />
      )}

      {posts.length ? (
        <ul className="grid gap-x-8 gap-y-14 pt-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <li key={post.slug} className="reveal grid">
              <PostCard post={post} locale={locale} priority={i < 3} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-20 text-center text-lg text-ink-2">{t.list.empty}</p>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        hrefFor={hrefFor}
        labels={{ nav: t.list.pagination, prev: t.list.prev, next: t.list.next, page: t.list.page }}
      />
    </div>
  );
}
