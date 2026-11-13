import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { ChevronLeft, ChevronRight, Megaphone } from "lucide-react";
import { site } from "@/config/site";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getAllPosts, getAllTags, type PostSummary } from "@/lib/content";
import { href } from "@/lib/format";
import { getViewCounts } from "@/lib/views";
import { PostFeedItem, PostTile } from "./PostCard";
import { SearchForm } from "./SearchForm";

/** Khối có thanh tiêu đề đỏ thương hiệu, như các hộp trên Pinkbike. */
function Panel({
  id,
  title,
  as: Heading = "h2",
  children,
  className = "",
}: {
  id: string;
  title: string;
  as?: "h1" | "h2";
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section aria-labelledby={id} className={`flex flex-col border border-line ${className}`}>
      <Heading id={id} className="on-brand display bg-paper px-4 py-2 text-lg text-ink">
        {title}
      </Heading>
      <div className="flex flex-1 flex-col p-4">{children}</div>
    </section>
  );
}

/**
 * Ô quảng cáo: banner khai báo trong site.ads, hoặc ô mời đặt quảng cáo khi chưa có.
 * "sidebar" giãn theo chiều cao khối chứa; "feed" là banner ngang tỉ lệ 970:250 trong dòng tin.
 */
function AdSlot({ locale, slot }: { locale: Locale; slot: keyof typeof site.ads }) {
  const t = getDictionary(locale);
  const { image, href: link, alt } = site.ads[slot];
  const box = slot === "feed" ? "aspect-[970/250]" : "min-h-[18rem] flex-1";
  if (image) {
    return (
      <a
        href={link || `mailto:${site.email}`}
        target="_blank"
        rel="sponsored noopener"
        className={`relative block overflow-hidden bg-surface-2 ${box}`}
      >
        <Image
          src={image}
          alt={alt}
          fill
          sizes={slot === "feed" ? "(min-width: 1280px) 840px, (min-width: 1024px) 60vw, 100vw" : "(min-width: 1280px) 250px, (min-width: 1024px) 33vw, 100vw"}
          className="object-cover"
        />
      </a>
    );
  }
  return (
    <a
      href={`mailto:${site.email}`}
      className={`group flex items-center justify-center border-2 border-dashed border-line bg-surface-2 text-center transition-colors duration-200 hover:border-accent ${box} ${
        slot === "feed" ? "gap-3 px-4 sm:gap-5" : "flex-col gap-3 p-6"
      }`}
    >
      <Megaphone className="size-7 shrink-0 text-accent-ink sm:size-8" strokeWidth={1.6} aria-hidden="true" />
      <span className={slot === "feed" ? "text-left" : "contents"}>
        <span className={`display block ${slot === "feed" ? "text-base sm:text-xl" : "text-xl"}`}>{t.home.adCta}</span>
        <span className={`block text-sm text-ink-2 ${slot === "feed" ? "hidden sm:block" : "max-w-[16rem]"}`}>{t.home.adLead}</span>
        <span className="mt-1 block text-sm font-semibold">
          <span className="link-title">{site.email}</span>
        </span>
      </span>
    </a>
  );
}

/** Các số trang cần hiện: trang đầu, cuối và hai bên trang hiện tại; chỗ bị lược là "…". */
function pageWindow(page: number, total: number): (number | "gap")[] {
  const keep = [...new Set([1, page - 1, page, page + 1, total])].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  keep.forEach((n, i) => {
    if (i > 0 && n - keep[i - 1] > 1) out.push("gap");
    out.push(n);
  });
  return out;
}

/** Thanh chuyển trang cuối dòng tin, kiểu Pinkbike: Trang trước · số trang · Trang sau. */
function FeedPagination({
  locale,
  page,
  totalPages,
  hrefFor,
}: {
  locale: Locale;
  page: number;
  totalPages: number;
  hrefFor: (page: number) => string;
}) {
  if (totalPages <= 1) return null;
  const t = getDictionary(locale);
  const step = "inline-flex min-h-10 items-center gap-1 rounded-sm px-3 text-sm font-semibold transition-colors duration-200";
  return (
    <nav aria-label={t.list.pagination} className="mt-2 flex items-center justify-between gap-2 border-t border-line pt-4">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} rel="prev" aria-label={t.list.prev} className={`${step} bg-surface-2 hover:bg-ink hover:text-paper`}>
          <ChevronLeft className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">{t.list.prev}</span>
        </Link>
      ) : (
        <span />
      )}
      <ol className="flex items-center gap-1">
        {pageWindow(page, totalPages).map((n, i) =>
          n === "gap" ? (
            <li key={`gap-${i}`} aria-hidden="true" className="px-1 text-ink-2">
              …
            </li>
          ) : (
            <li key={n}>
              <Link
                href={hrefFor(n)}
                aria-current={n === page ? "page" : undefined}
                aria-label={`${t.list.page} ${n}`}
                className={`grid size-10 place-items-center rounded-sm text-sm font-semibold transition-colors duration-200 ${
                  n === page ? "bg-ink text-paper" : "hover:bg-surface-2"
                }`}
              >
                {n}
              </Link>
            </li>
          ),
        )}
      </ol>
      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} rel="next" aria-label={t.list.next} className={`${step} bg-accent text-on-accent hover:bg-ink hover:text-paper`}>
          <span className="hidden sm:inline">{t.list.next}</span>
          <ChevronRight className="size-4" aria-hidden="true" />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}

/**
 * Bố cục dòng tin kiểu Pinkbike, dùng cho trang chủ, trang chuyên mục và trang thẻ:
 * quảng cáo | dòng tin (8 bài/trang, banner sau bài thứ 3, phân trang) | xem nhiều nhất + thẻ.
 * Màn hình rộng: khung 1400px, cột tin ~870px như Pinkbike, hai cột bên bằng nhau 252px.
 * Hàng 1 cao theo khối "Xem nhiều nhất" và ô quảng cáo giãn bằng nó; dòng tin trải qua cả hàng 1fr
 * cuối nên không kéo giãn hàng 1. Dưới xl, quảng cáo xuống cột phải sau "Xem nhiều nhất".
 */
export async function FeedLayout({
  locale,
  title,
  isPageTitle = false,
  lead,
  showSearch = false,
  posts,
  page,
  totalPages,
  hrefFor,
}: {
  locale: Locale;
  title: string;
  /** true: tiêu đề khối dòng tin là h1 của trang (trang chuyên mục, thẻ). */
  isPageTitle?: boolean;
  lead?: string;
  showSearch?: boolean;
  posts: PostSummary[];
  page: number;
  totalPages: number;
  hrefFor: (page: number) => string;
}) {
  const t = getDictionary(locale);
  const [all, tags, views] = await Promise.all([getAllPosts(locale), getAllTags(locale), getViewCounts()]);

  // Xem nhiều nhất; khi chưa đủ dữ liệu lượt xem thì bù bằng bài nổi bật rồi bài mới nhất
  const ranked = all
    .filter((p) => (views.get(p.slug) ?? 0) > 0)
    .sort((a, b) => views.get(b.slug)! - views.get(a.slug)! || b.publishedAt.localeCompare(a.publishedAt));
  const picks = [...new Set([...ranked, ...all.filter((p) => p.featured), ...all])].slice(0, 3);

  return (
    <div className="container-x grid gap-8 pt-8 lg:grid-cols-12 lg:grid-rows-[auto_auto_1fr] lg:pt-10 xl:grid-cols-[252px_minmax(0,1fr)_252px] xl:grid-rows-[auto_1fr] xl:gap-3">
      <div className="order-1 min-w-0 lg:col-span-8 lg:row-span-3 xl:order-none xl:col-span-1 xl:col-start-2 xl:row-span-2 xl:row-start-1">
        <Panel id="latest" title={title} as={isPageTitle ? "h1" : "h2"}>
          {lead ? <p className="text-ink-2">{lead}</p> : null}
          {showSearch ? <SearchForm locale={locale} size="md" /> : null}
          {posts.length ? (
            <ul className="mt-1 divide-y divide-line">
              {posts.map((post, i) => (
                <Fragment key={post.slug}>
                  <li>
                    <PostFeedItem post={post} locale={locale} priority={i < 2} />
                  </li>
                  {i === 2 && posts.length > 3 ? (
                    <li aria-label={t.home.ad} className="py-5">
                      <p className="eyebrow mb-2 text-[0.6875rem] text-ink-2">{t.home.ad}</p>
                      <AdSlot locale={locale} slot="feed" />
                    </li>
                  ) : null}
                </Fragment>
              ))}
            </ul>
          ) : (
            <p className="py-16 text-center text-ink-2">{t.list.empty}</p>
          )}
          <FeedPagination locale={locale} page={page} totalPages={totalPages} hrefFor={hrefFor} />
        </Panel>
      </div>

      {picks.length ? (
        <Panel
          id="most-viewed"
          title={t.home.mostViewed}
          className="order-2 lg:col-span-4 xl:order-none xl:col-span-1 xl:col-start-3 xl:row-start-1"
        >
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            {picks.map((post) => (
              <li key={post.slug}>
                <PostTile post={post} locale={locale} views={views.get(post.slug)} />
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}

      {/* Không có thanh tiêu đề: banner phủ kín khung, cao bằng khối "Xem nhiều nhất" */}
      <aside aria-label={t.home.ad} className="order-3 flex flex-col lg:col-span-4 xl:order-none xl:col-span-1 xl:col-start-1 xl:row-start-1">
        <AdSlot locale={locale} slot="sidebar" />
      </aside>

      {tags.length ? (
        <Panel
          id="home-tags"
          title={t.home.popularTags}
          className="order-4 self-start lg:col-span-4 xl:order-none xl:col-span-1 xl:col-start-3 xl:row-start-2"
        >
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
    </div>
  );
}
