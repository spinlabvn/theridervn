"use client";

import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { hasChildren, mainMenu, menuHref, menuLabel } from "@/config/menu";
import type { Locale } from "@/i18n/config";

type Item = { href: string; label: string };

export function MobileMenu({
  labels,
  locale,
  primary,
  searchHref,
  children,
}: {
  labels: { open: string; close: string; categories: string; search: string };
  locale: Locale;
  primary: Item[];
  searchHref: string;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  // Đóng menu khi chuyển trang
  useEffect(() => {
    ref.current?.close();
  }, [pathname]);

  const close = () => ref.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        aria-label={labels.open}
        aria-haspopup="dialog"
        className="grid size-11 place-items-center rounded-full transition-colors duration-200 hover:bg-surface-2 lg:hidden"
      >
        <Menu className="size-6" strokeWidth={1.8} aria-hidden="true" />
      </button>

      <dialog
        ref={ref}
        aria-label={labels.categories}
        onClick={(e) => {
          if (e.target === ref.current) close();
        }}
        className="m-0 ml-auto h-full max-h-full w-full max-w-sm bg-paper p-0 text-ink backdrop:bg-black/60 backdrop:backdrop-blur-sm open:flex open:flex-col"
      >
        <div className="flex h-16 items-center justify-between border-b border-line px-4">
          <span className="eyebrow text-ink-2">{labels.categories}</span>
          <button
            type="button"
            onClick={close}
            aria-label={labels.close}
            autoFocus
            className="grid size-11 place-items-center rounded-full hover:bg-surface-2"
          >
            <X className="size-6" strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6">
          {/* Cùng cấu trúc menu với therider.vn: mục đơn + nhóm có menu con */}
          <ul className="space-y-1">
            {mainMenu.map((item) =>
              hasChildren(item) ? (
                <li key={item.label} className="py-3">
                  <p className="eyebrow text-ink-2">{item.label}</p>
                  <ul className="mt-2 grid grid-cols-2 gap-2">
                    {item.children.map((child) => (
                      <li key={menuHref(child, locale)}>
                        <Link
                          href={menuHref(child, locale)}
                          onClick={close}
                          className="flex min-h-11 items-center rounded-md bg-surface-2 px-3 text-sm font-semibold uppercase tracking-[0.02em] hover:bg-accent hover:text-on-accent"
                        >
                          {menuLabel(child.label, locale)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={menuHref(item, locale)}>
                  <Link
                    href={menuHref(item, locale)}
                    onClick={close}
                    className="display block py-1.5 text-2xl hover:opacity-80"
                  >
                    {menuLabel(item.label, locale)}
                  </Link>
                </li>
              ),
            )}
          </ul>
          {primary.length ? (
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-1 border-t border-line pt-5">
              {primary.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} onClick={close} className="flex min-h-11 items-center font-medium text-ink-2 hover:text-ink">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
          <Link
            href={searchHref}
            onClick={close}
            className="mt-6 flex min-h-12 items-center gap-3 rounded-md border border-line px-4 text-ink-2 hover:border-ink hover:text-ink"
          >
            <Search className="size-5" strokeWidth={1.8} aria-hidden="true" />
            {labels.search}
          </Link>
        </nav>

        <div className="flex items-center justify-between border-t border-line px-4 py-4">{children}</div>
      </dialog>
    </>
  );
}
