import Image from "next/image";
import Link from "next/link";
import { Clock3, Eye, Play } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import type { PostSummary } from "@/lib/content";
import { slugify } from "@/lib/content/text";
import { daysAgo, formatDate, href } from "@/lib/format";

export function PostMeta({ post, locale, className = "" }: { post: PostSummary; locale: Locale; className?: string }) {
  const t = getDictionary(locale);
  return (
    <p className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8125rem] ${className}`}>
      <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>
      <span aria-hidden="true" className="size-1 rounded-full bg-current opacity-50" />
      {post.isVideo ? (
        <span className="inline-flex items-center gap-1">
          <Play className="size-3.5" strokeWidth={2} aria-hidden="true" />
          {t.post.video}
        </span>
      ) : (
        <span className="inline-flex items-center gap-1">
          <Clock3 className="size-3.5" strokeWidth={2} aria-hidden="true" />
          {post.readingMinutes} {t.post.minRead}
        </span>
      )}
    </p>
  );
}

export function CategoryLabel({ post, locale, solid = false }: { post: PostSummary; locale: Locale; solid?: boolean }) {
  return (
    <Link
      href={href.category(locale, post.category.slug)}
      className={`eyebrow relative z-10 inline-flex min-h-6 items-center ${
        solid ? "bg-accent px-2 py-1 text-on-accent hover:bg-ink hover:text-paper" : "text-accent-ink hover:underline"
      }`}
    >
      {post.category.title}
    </Link>
  );
}

function Cover({
  post,
  sizes,
  className = "",
  priority = false,
}: {
  post: PostSummary;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden bg-surface-2 ${className}`}>
      {post.coverUrl ? (
        <Image
          src={post.coverUrl}
          alt={post.coverAlt}
          fill
          sizes={sizes}
          priority={priority}
          className="media-zoom object-cover"
          style={post.coverPosition ? { objectPosition: post.coverPosition } : undefined}
        />
      ) : null}
      {post.isVideo ? (
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent text-on-accent shadow-lg transition-transform duration-300 group-hover:scale-110 [.w-24_&]:size-9"
        >
          <Play className="size-6 translate-x-px fill-current [.w-24_&]:size-4" aria-hidden="true" />
        </span>
      ) : null}
    </div>
  );
}

/**
 * Thẻ bài viết tiêu chuẩn: ảnh trên, chữ dưới.
 * Cả thẻ có thể bấm nhờ lớp phủ ::after trên liên kết tiêu đề – nhãn chuyên mục vẫn bấm riêng được.
 */
export function PostCard({
  post,
  locale,
  size = "md",
  priority = false,
}: {
  post: PostSummary;
  locale: Locale;
  size?: "md" | "lg";
  priority?: boolean;
}) {
  return (
    <article className="group relative flex flex-col">
      <Cover
        post={post}
        priority={priority}
        className={size === "lg" ? "aspect-[4/3] sm:aspect-[16/10]" : "aspect-[3/2]"}
        sizes={size === "lg" ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"}
      />
      <div className="mt-4 flex flex-1 flex-col">
        <CategoryLabel post={post} locale={locale} />
        <h3 className={`display mt-2 ${size === "lg" ? "text-4xl sm:text-5xl" : "text-[1.75rem]"}`}>
          <Link href={href.post(locale, post.slug)} className="after:absolute after:inset-0">
            <span className="link-title">{post.title}</span>
          </Link>
        </h3>
        <p className={`mt-3 text-ink-2 ${size === "lg" ? "text-lg" : "line-clamp-3"}`}>{post.excerpt}</p>
        <PostMeta post={post} locale={locale} className="mt-auto pt-4 text-ink-2" />
      </div>
    </article>
  );
}

/** Thẻ ngang gọn – dùng cho danh sách đánh số, kết quả tìm kiếm, kho bài viết. */
export function PostRow({ post, locale, index }: { post: PostSummary; locale: Locale; index?: number }) {
  return (
    <article className="group relative grid grid-cols-[1fr_auto] gap-4 border-t border-line py-5 sm:grid-cols-[auto_1fr_auto] sm:gap-6">
      {typeof index === "number" ? (
        <span aria-hidden="true" className="display hidden w-12 text-5xl text-line sm:block group-hover:text-accent">
          {String(index + 1).padStart(2, "0")}
        </span>
      ) : null}
      <div className="min-w-0">
        <CategoryLabel post={post} locale={locale} />
        <h3 className="display mt-1.5 text-2xl sm:text-[1.75rem]">
          <Link href={href.post(locale, post.slug)} className="after:absolute after:inset-0">
            <span className="link-title">{post.title}</span>
          </Link>
        </h3>
        <PostMeta post={post} locale={locale} className="mt-2 text-ink-2" />
      </div>
      <Cover post={post} className="aspect-square w-24 sm:aspect-[4/3] sm:w-40" sizes="160px" />
    </article>
  );
}

/** Thẻ nhỏ: ảnh vuông bên trái, tiêu đề bên phải – dùng cho mục "Đọc tiếp" cuối bài. */
export function PostMini({ post, locale }: { post: PostSummary; locale: Locale }) {
  return (
    <article className="group relative grid grid-cols-[auto_1fr] items-center gap-4 border-t border-line py-4">
      <Cover post={post} className="aspect-square w-24" sizes="96px" />
      <div className="min-w-0">
        <CategoryLabel post={post} locale={locale} />
        <h3 className="display mt-1 line-clamp-2 text-xl">
          <Link href={href.post(locale, post.slug)} className="after:absolute after:inset-0">
            <span className="link-title">{post.title}</span>
          </Link>
        </h3>
        <PostMeta post={post} locale={locale} className="mt-1.5 text-ink-2" />
      </div>
    </article>
  );
}

/** Thẻ dọc gọn cho cột phụ hẹp: ảnh trên, chuyên mục + tiêu đề dưới, kèm lượt xem nếu có. */
export function PostTile({ post, locale, views }: { post: PostSummary; locale: Locale; views?: number }) {
  const t = getDictionary(locale);
  return (
    <article className="group relative">
      <Cover post={post} className="aspect-[16/9]" sizes="(min-width: 1024px) 300px, 100vw" />
      <div className="mt-3">
        <CategoryLabel post={post} locale={locale} />
        <h3 className="mt-1 font-bold leading-snug">
          <Link href={href.post(locale, post.slug)} className="after:absolute after:inset-0">
            <span className="link-title">{post.title}</span>
          </Link>
        </h3>
        {views ? (
          <p className="mt-1.5 inline-flex items-center gap-1 text-[0.8125rem] text-ink-2">
            <Eye className="size-3.5" strokeWidth={2} aria-hidden="true" />
            {t.post.views(new Intl.NumberFormat(locale).format(views))}
          </p>
        ) : null}
      </div>
    </article>
  );
}

/**
 * Một dòng trong dòng tin trang chủ (kiểu Pinkbike): ảnh bên trái; tác giả + ngày,
 * tiêu đề đậm, tóm tắt, chuyên mục và thẻ bên phải.
 */
export function PostFeedItem({ post, locale, priority = false }: { post: PostSummary; locale: Locale; priority?: boolean }) {
  const t = getDictionary(locale);
  const ago = daysAgo(post.publishedAt);
  return (
    <article className="group relative grid grid-cols-[7.5rem_1fr] gap-4 py-5 sm:grid-cols-[13rem_1fr] sm:gap-5">
      <Cover post={post} priority={priority} className="aspect-[4/3] self-start sm:aspect-[3/2] [&_span]:size-10" sizes="(min-width: 640px) 208px, 120px" />
      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8125rem] text-ink-2">
          <span className="font-semibold text-ink">{post.author.name}</span>
          {ago !== null ? (
            <span className="rounded-sm bg-yellow-300 px-1.5 py-px font-semibold text-black">
              {ago === 0 ? t.home.today : t.home.yesterday}
            </span>
          ) : (
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>
          )}
        </p>
        <h3 className="mt-1 text-lg font-bold leading-snug sm:text-[1.375rem]">
          <Link href={href.post(locale, post.slug)} className="after:absolute after:inset-0">
            <span className="link-title">{post.title}</span>
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 hidden text-[0.9375rem] text-ink-2 sm:block">{post.excerpt}</p>
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[0.8125rem]">
          <Link
            href={href.category(locale, post.category.slug)}
            className="relative z-10 inline-flex min-h-7 items-center rounded-sm bg-accent px-2 font-semibold text-on-accent hover:bg-ink hover:text-paper"
          >
            {post.category.title}
          </Link>
          {post.tags.slice(0, 4).map((tag) => (
            <Link
              key={tag}
              href={href.tag(locale, slugify(tag))}
              className="relative z-10 hidden min-h-7 items-center rounded-sm bg-surface-2 px-2 text-ink-2 hover:bg-ink hover:text-paper sm:inline-flex"
            >
              {tag}
            </Link>
          ))}
          <span className="inline-flex items-center gap-1 pl-1 text-ink-2">
            {post.isVideo ? <Play className="size-3.5" strokeWidth={2} aria-hidden="true" /> : <Clock3 className="size-3.5" strokeWidth={2} aria-hidden="true" />}
            {post.isVideo ? t.post.video : `${post.readingMinutes} ${t.post.minRead}`}
          </span>
        </div>
      </div>
    </article>
  );
}
