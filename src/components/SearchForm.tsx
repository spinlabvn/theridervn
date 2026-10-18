import { Search } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { href } from "@/lib/format";

/** Form GET thuần – hoạt động cả khi JavaScript chưa tải. */
export function SearchForm({
  locale,
  defaultValue = "",
  autoFocus = false,
  size = "lg",
}: {
  locale: Locale;
  defaultValue?: string;
  autoFocus?: boolean;
  size?: "md" | "lg";
}) {
  const t = getDictionary(locale);
  return (
    <form action={href.search(locale)} method="get" role="search" className="w-full">
      <label htmlFor={`q-${size}`} className="sr-only">
        {t.search.label}
      </label>
      <div className="flex items-stretch border-b-2 border-ink focus-within:border-accent">
        <Search className={`shrink-0 self-center text-ink-2 ${size === "lg" ? "size-7" : "size-5"}`} strokeWidth={1.8} aria-hidden="true" />
        <input
          id={`q-${size}`}
          type="search"
          name="q"
          defaultValue={defaultValue}
          autoFocus={autoFocus}
          autoComplete="off"
          enterKeyHint="search"
          placeholder={t.search.placeholder}
          className={`min-w-0 flex-1 bg-transparent px-3 outline-none placeholder:text-ink-2/70 focus-visible:outline-none ${
            size === "lg" ? "h-16 text-xl sm:text-2xl" : "h-12 text-base"
          }`}
        />
        <button
          type="submit"
          className="my-2 shrink-0 rounded-full bg-accent px-5 text-sm font-semibold text-on-accent transition-colors duration-200 hover:bg-ink hover:text-paper"
        >
          {t.search.submit}
        </button>
      </div>
    </form>
  );
}
