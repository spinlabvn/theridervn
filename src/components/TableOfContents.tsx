"use client";

import { useEffect, useState } from "react";

type Heading = { id: string; text: string; level: number };

/** Mục lục bám dính, tự đánh dấu mục đang đọc. */
export function TableOfContents({ headings, label }: { headings: Heading[]; label: string }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const els = headings.map((h) => document.getElementById(h.id)).filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-90px 0px -65% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav aria-label={label}>
      <p className="eyebrow text-ink-2">{label}</p>
      <ol className="mt-4 space-y-1 border-l border-line">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              aria-current={active === h.id ? "location" : undefined}
              className={`-ml-px block border-l-2 py-1.5 text-sm leading-snug transition-colors duration-200 ${
                h.level === 3 ? "pl-7" : "pl-4"
              } ${active === h.id ? "border-accent font-semibold text-ink" : "border-transparent text-ink-2 hover:text-ink"}`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
