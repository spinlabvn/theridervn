"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export default function NotFound() {
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale && isLocale(params.locale) ? params.locale : "vi";
  const t = getDictionary(locale);
  return (
    <div className="container-x flex min-h-[60vh] flex-col items-start justify-center py-24">
      <p className="display text-[6rem] leading-none text-accent sm:text-[9rem]" aria-hidden="true">
        404
      </p>
      <h1 className="display mt-2 text-3xl sm:text-4xl">{t.notFound.title}</h1>
      <p className="mt-4 max-w-lg text-lg text-ink-2">{t.notFound.lead}</p>
      <Link
        href={`/${locale}`}
        className="mt-8 inline-flex min-h-12 items-center rounded-full bg-ink px-6 font-semibold text-paper transition-colors duration-200 hover:bg-accent hover:text-on-accent"
      >
        {t.notFound.back}
      </Link>
    </div>
  );
}
