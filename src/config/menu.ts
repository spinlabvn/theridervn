import type { Locale } from "@/i18n/config";
import { href } from "@/lib/format";

/**
 * Menu chính – theo cấu trúc của therider.vn:
 *   Trang Chủ · Bike Check · Reviews ▾ (Bikes, Parts) · Videos ▾ (How To, Events, Podcast, Interview) · Sự Kiện
 * Mỗi mục trỏ tới một chuyên mục (slug trong content/categories.json hoặc trên Sanity), riêng "Trang Chủ" về trang chủ.
 * Nhãn là chuỗi (giống nhau ở hai ngôn ngữ) hoặc { vi, en }.
 */
type Label = string | Record<Locale, string>;
export type MenuLink = { label: Label; category: string } | { label: Label; home: true };
export type MenuItem = MenuLink | { label: string; children: MenuLink[] };

export const mainMenu: MenuItem[] = [
  { label: { vi: "Trang Chủ", en: "Home" }, home: true },
  { label: "Bike Check", category: "bike-check" },
  {
    label: "Reviews",
    children: [
      { label: "Bikes", category: "review-bikes" },
      { label: "Parts", category: "review-parts" },
    ],
  },
  {
    label: "Videos",
    children: [
      { label: "How To", category: "how-to" },
      { label: "Events", category: "events" },
      { label: "Podcast", category: "podcast" },
      { label: "Interview", category: "interview" },
    ],
  },
  { label: { vi: "Sự Kiện", en: "Events" }, category: "events" },
];

export const hasChildren = (item: MenuItem): item is { label: string; children: MenuLink[] } => "children" in item;

export const menuLabel = (label: Label, locale: Locale) => (typeof label === "string" ? label : label[locale]);

export const menuHref = (link: MenuLink, locale: Locale) => ("home" in link ? href.home(locale) : href.category(locale, link.category));

/** Mục đang mở: trang chủ (kể cả các trang /page/n) hoặc chuyên mục tương ứng. */
export const isMenuActive = (link: MenuLink, locale: Locale, pathname: string) =>
  "home" in link
    ? pathname === href.home(locale) || pathname.startsWith(`${href.home(locale)}/page/`)
    : pathname.startsWith(href.category(locale, link.category));
