import Link from "next/link";
import { Search } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getCategories } from "@/lib/content";
import { href } from "@/lib/format";
import { Logo } from "./Logo";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileMenu } from "./MobileMenu";
import { NavLink } from "./NavLink";
import { ThemeToggle } from "./ThemeToggle";

export async function Header({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const categories = await getCategories(locale);
  const catItems = categories.map((c) => ({ href: href.category(locale, c.slug), label: c.title }));

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md supports-[backdrop-filter]:bg-paper/75">
      <div className="container-x flex h-16 items-center gap-6 lg:h-[4.5rem]">
        <Link href={href.home(locale)} className="shrink-0" aria-label={`TheRider – ${t.nav.home}`}>
          <Logo />
        </Link>

        <nav aria-label={t.nav.categories} className="hidden flex-1 xl:block">
          <ul className="flex items-center gap-1">
            {catItems.map((item) => (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  className="relative flex h-11 items-center px-2.5 text-sm font-medium text-ink-2 transition-colors duration-200 hover:text-ink aria-[current=page]:text-ink after:absolute after:inset-x-2.5 after:-bottom-[13px] after:h-[3px] after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 aria-[current=page]:after:scale-x-100"
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Link
            href={href.search(locale)}
            aria-label={t.nav.search}
            className="grid size-11 place-items-center rounded-full transition-colors duration-200 hover:bg-surface-2"
          >
            <Search className="size-5" strokeWidth={1.8} aria-hidden="true" />
          </Link>
          <div className="hidden sm:block">
            <LocaleSwitcher locale={locale} label={t.language.switch} />
          </div>
          <ThemeToggle label={t.theme.toggle} />
          <MobileMenu
            labels={{ open: t.nav.menu, close: t.nav.close, categories: t.nav.categories, search: t.nav.search }}
            primary={[
              { href: href.home(locale), label: t.nav.home },
              { href: href.blog(locale), label: t.nav.stories },
            ]}
            categories={catItems}
            searchHref={href.search(locale)}
          >
            <LocaleSwitcher locale={locale} label={t.language.switch} />
            <ThemeToggle label={t.theme.toggle} />
          </MobileMenu>
        </div>
      </div>
    </header>
  );
}
