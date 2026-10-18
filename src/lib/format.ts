import type { Locale } from "@/i18n/config";

const dateFormatters: Record<Locale, Intl.DateTimeFormat> = {
  vi: new Intl.DateTimeFormat("vi-VN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Ho_Chi_Minh" }),
  en: new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Ho_Chi_Minh" }),
};

const shortFormatters: Record<Locale, Intl.DateTimeFormat> = {
  vi: new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Asia/Ho_Chi_Minh" }),
  en: new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Ho_Chi_Minh" }),
};

export function formatDate(iso: string, locale: Locale, style: "long" | "short" = "long") {
  return (style === "long" ? dateFormatters : shortFormatters)[locale].format(new Date(iso));
}

/** Đường dẫn nội bộ luôn có tiền tố ngôn ngữ */
export const href = {
  home: (l: Locale) => `/${l}`,
  blog: (l: Locale, page = 1) => (page > 1 ? `/${l}/blog/page/${page}` : `/${l}/blog`),
  post: (l: Locale, slug: string) => `/${l}/blog/${slug}`,
  category: (l: Locale, slug: string, page = 1) =>
    page > 1 ? `/${l}/category/${slug}/page/${page}` : `/${l}/category/${slug}`,
  tag: (l: Locale, slug: string) => `/${l}/tag/${slug}`,
  search: (l: Locale, q?: string) => (q ? `/${l}/search?q=${encodeURIComponent(q)}` : `/${l}/search`),
  rss: (l: Locale) => `/${l}/rss.xml`,
};
