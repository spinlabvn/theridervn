import Link from "next/link";
import { Search } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { href } from "@/lib/format";
import { Logo } from "./Logo";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileMenu } from "./MobileMenu";
import { MainNav } from "./MainNav";
import { ThemeToggle } from "./ThemeToggle";

export function Header({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <header className="on-brand sticky top-0 z-40 border-b border-[var(--brand-dark-red)] bg-paper text-ink">
      <div className="container-x flex h-16 items-center gap-6 lg:h-[4.5rem]">
        <Link href={href.home(locale)} className="shrink-0" aria-label={`TheRider – ${t.nav.home}`}>
          <Logo />
        </Link>

        <MainNav locale={locale} label={t.nav.categories} />

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
            locale={locale}
            primary={[
              { href: href.home(locale), label: t.nav.home },
              { href: href.blog(locale), label: t.nav.stories },
            ]}
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
