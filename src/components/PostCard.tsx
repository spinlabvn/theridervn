import Image from "next/image";
import Link from "next/link";
import { Clock3 } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import type { PostSummary } from "@/lib/content";
import { formatDate, href } from "@/lib/format";

export function PostMeta({ post, locale, className = "" }: { post: PostSummary; locale: Locale; className?: string }) {
  const t = getDictionary(locale);
  return (
    <p className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8125rem] ${className}`}>
      <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>
      <span aria-hidden="true" className="size-1 rounded-full bg-current opacity-50" />
      <span className="inline-flex items-center gap-1">
        <Clock3 className="size-3.5" strokeWidth={2} aria-hidden="true" />
        {post.readingMinutes} {t.post.minRead}
      </span>
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

/** Thẻ lớn có chữ đè trên ảnh – dùng cho mục "Biên tập chọn". */
export function PostOverlayCard({ post, locale, className = "" }: { post: PostSummary; locale: Locale; className?: string }) {
  return (
    <article className={`group scheme-dark relative isolate flex min-h-[26rem] flex-col justify-end overflow-hidden ${className}`}>
      <Cover post={post} className="absolute inset-0 -z-10" sizes="(min-width: 1024px) 50vw, 100vw" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/45 to-black/5" />
      <div className="p-6 sm:p-8">
        <CategoryLabel post={post} locale={locale} solid />
        <h3 className="display mt-3 text-4xl text-white sm:text-5xl">
          <Link href={href.post(locale, post.slug)} className="after:absolute after:inset-0">
            <span className="link-title">{post.title}</span>
          </Link>
        </h3>
        <PostMeta post={post} locale={locale} className="mt-3 text-white/80" />
      </div>
    </article>
  );
}
