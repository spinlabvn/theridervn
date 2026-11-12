import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { ArrowRight, Megaphone } from "lucide-react";
import { notFound } from "next/navigation";
import { PostFeedItem, PostTile } from "@/components/PostCard";
import { SearchForm } from "@/components/SearchForm";
import { site } from "@/config/site";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getAllPosts, getAllTags } from "@/lib/content";
import { href } from "@/lib/format";
import { getViewCounts } from "@/lib/views";

export const revalidate = 60;

/** Khối có thanh tiêu đề đỏ thương hiệu, như các hộp trên Pinkbike. */
function Panel({
  id,
  title,
  children,
  className = "",
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section aria-labelledby={id} className={`flex flex-col border border-line ${className}`}>
      <h2 id={id} className="on-brand display bg-paper px-4 pb-1.5 pt-2 text-2xl text-ink">
        {title}
      </h2>
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
        <span className={`display block ${slot === "feed" ? "text-xl sm:text-3xl" : "text-3xl"}`}>{t.home.adCta}</span>
        <span className={`block text-sm text-ink-2 ${slot === "feed" ? "hidden sm:block" : "max-w-[16rem]"}`}>{t.home.adLead}</span>
        <span className="mt-1 block text-sm font-semibold">
          <span className="link-title">{site.email}</span>
        </span>
      </span>
    </a>
  );
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  const [posts, tags, views] = await Promise.all([getAllPosts(locale), getAllTags(locale), getViewCounts()]);
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

      {/*
        Dòng tin kiểu Pinkbike: quảng cáo | tin mới nhất | xem nhiều nhất + thẻ. Màn hình rộng: khung 1400px,
        cột tin ~870px như Pinkbike, hai cột bên bằng nhau 252px.
        Hàng 1 cao theo khối "Xem nhiều nhất" và ô quảng cáo giãn bằng nó; dòng tin trải qua
        cả hàng 1fr cuối nên không kéo giãn hàng 1. Dưới xl, quảng cáo xuống cột phải sau "Xem nhiều nhất".
      */}
      <div className="container-x grid gap-8 pt-8 lg:grid-cols-12 lg:grid-rows-[auto_auto_1fr] lg:pt-10 xl:grid-cols-[252px_minmax(0,1fr)_252px] xl:grid-rows-[auto_1fr] xl:gap-3">
        <div className="order-1 min-w-0 lg:col-span-8 lg:row-span-3 xl:order-none xl:col-span-1 xl:col-start-2 xl:row-span-2 xl:row-start-1">
          <Panel id="latest" title={t.home.news}>
            <SearchForm locale={locale} size="md" />
            <ul className="mt-1 divide-y divide-line">
              {feed.map((post, i) => (
                <Fragment key={post.slug}>
                  <li>
                    <PostFeedItem post={post} locale={locale} priority={i < 2} />
                  </li>
                  {i === 2 && feed.length > 3 ? (
                    <li aria-label={t.home.ad} className="py-5">
                      <p className="eyebrow mb-2 text-[0.6875rem] text-ink-2">{t.home.ad}</p>
                      <AdSlot locale={locale} slot="feed" />
                    </li>
                  ) : null}
                </Fragment>
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

        <Panel
          id="home-ad"
          title={t.home.ad}
          className="order-3 lg:col-span-4 xl:order-none xl:col-span-1 xl:col-start-1 xl:row-start-1"
        >
          <AdSlot locale={locale} slot="sidebar" />
        </Panel>

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
    </>
  );
}
