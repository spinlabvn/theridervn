export const locales = ["vi", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "vi";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const localeMeta: Record<Locale, { label: string; short: string; htmlLang: string; ogLocale: string }> = {
  vi: { label: "Tiếng Việt", short: "VI", htmlLang: "vi", ogLocale: "vi_VN" },
  en: { label: "English", short: "EN", htmlLang: "en", ogLocale: "en_US" },
};

/** Cookie ghi nhớ ngôn ngữ người đọc đã chọn */
export const LOCALE_COOKIE = "NEXT_LOCALE";
