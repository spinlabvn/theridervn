"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { hasChildren, mainMenu, type MenuLink } from "@/config/menu";
import type { Locale } from "@/i18n/config";
import { href } from "@/lib/format";

const itemClass =
  "relative flex h-11 items-center gap-1 px-3 text-[0.9375rem] font-semibold text-ink-2 transition-colors duration-200 hover:text-ink aria-[current=page]:text-ink data-[active=true]:text-ink after:absolute after:inset-x-3 after:-bottom-[13px] after:h-[3px] after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 aria-[current=page]:after:scale-x-100 data-[active=true]:after:scale-x-100";

/** Menu ngang trên desktop, có menu con mở bằng rê chuột, bấm hoặc bàn phím (Esc để đóng). */
export function MainNav({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const isActive = (l: MenuLink) => pathname.startsWith(href.category(locale, l.category));

  useEffect(() => setOpen(null), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        navRef.current?.querySelector<HTMLButtonElement>(`[data-menu="${open}"]`)?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <nav ref={navRef} aria-label={label} className="hidden flex-1 lg:block">
      <ul className="flex items-center gap-1">
        {mainMenu.map((item) => {
          if (!hasChildren(item)) {
            return (
              <li key={item.label}>
                <Link
                  href={href.category(locale, item.category)}
                  aria-current={isActive(item) ? "page" : undefined}
                  className={itemClass}
                >
                  {item.label}
                </Link>
              </li>
            );
          }
          const expanded = open === item.label;
          const id = `submenu-${item.label.toLowerCase()}`;
          return (
            <li
              key={item.label}
              className="relative"
              onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(item.label)}
              onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(null)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(null);
              }}
            >
              <button
                type="button"
                data-menu={item.label}
                aria-expanded={expanded}
                aria-controls={id}
                data-active={item.children.some(isActive)}
                onClick={() => setOpen(expanded ? null : item.label)}
                className={itemClass}
              >
                {item.label}
                <ChevronDown
                  className={`size-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                  strokeWidth={2.2}
                  aria-hidden="true"
                />
              </button>
              {/* pt-3 nối liền vùng rê chuột giữa nút và menu con */}
              <div id={id} hidden={!expanded} className="absolute left-0 top-full z-50 pt-3">
                <ul className="min-w-48 overflow-hidden rounded-md bg-[var(--brand-dark-red)] py-2 shadow-xl shadow-black/25">
                  {item.children.map((child) => (
                    <li key={child.category}>
                      <Link
                        href={href.category(locale, child.category)}
                        aria-current={isActive(child) ? "page" : undefined}
                        className="flex min-h-11 items-center px-4 text-[0.9375rem] font-medium text-white/85 transition-colors duration-150 hover:bg-white/10 hover:text-white aria-[current=page]:bg-white/10 aria-[current=page]:text-white"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
