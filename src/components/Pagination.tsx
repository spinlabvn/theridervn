import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  page,
  totalPages,
  hrefFor,
  labels,
}: {
  page: number;
  totalPages: number;
  hrefFor: (page: number) => string;
  labels: { nav: string; prev: string; next: string; page: string };
}) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const btn = "grid min-h-11 min-w-11 place-items-center rounded-full border px-3 text-sm font-semibold transition-colors duration-200";

  return (
    <nav aria-label={labels.nav} className="mt-14 flex items-center justify-center gap-2">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} rel="prev" aria-label={labels.prev} className={`${btn} border-line hover:border-ink`}>
          <ChevronLeft className="size-5" aria-hidden="true" />
        </Link>
      ) : null}
      <ul className="flex items-center gap-2">
        {pages.map((p) => (
          <li key={p}>
            <Link
              href={hrefFor(p)}
              aria-current={p === page ? "page" : undefined}
              aria-label={`${labels.page} ${p}`}
              className={`${btn} ${p === page ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"}`}
            >
              {p}
            </Link>
          </li>
        ))}
      </ul>
      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} rel="next" aria-label={labels.next} className={`${btn} border-line hover:border-ink`}>
          <ChevronRight className="size-5" aria-hidden="true" />
        </Link>
      ) : null}
    </nav>
  );
}
