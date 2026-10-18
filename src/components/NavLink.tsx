"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

/** Liên kết tự đánh dấu aria-current khi đang ở trang tương ứng (hoặc trang con). */
export function NavLink({ href, exact = false, className = "", ...props }: ComponentProps<typeof Link> & { href: string; exact?: boolean }) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  return <Link href={href} aria-current={active ? "page" : undefined} className={className} {...props} />;
}
