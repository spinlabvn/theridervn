"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALE_COOKIE, localeMeta, locales, type Locale } from "@/i18n/config";

/** Giữ nguyên trang đang xem, chỉ đổi tiền tố ngôn ngữ (slug bài viết dùng chung cho hai ngôn ngữ). */
export function LocaleSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname() || `/${locale}`;
  const rest = pathname.replace(/^\/(vi|en)(?=\/|$)/, "");

  return (
    <nav aria-label={label} className="flex items-center rounded-full border border-line p-0.5 text-xs font-semibold">
      {locales.map((l) => {
        const active = l === locale;
        return (
          <Link
            key={l}
            href={`/${l}${rest}`}
            hrefLang={l}
            lang={l}
            aria-current={active ? "true" : undefined}
            aria-label={localeMeta[l].label}
            onClick={() => {
              document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
            }}
            className={`grid h-9 min-w-10 place-items-center rounded-full px-2.5 tracking-wider transition-colors duration-200 ${
              active ? "bg-ink text-paper" : "text-ink-2 hover:text-ink"
            }`}
          >
            {localeMeta[l].short}
          </Link>
        );
      })}
    </nav>
  );
}
