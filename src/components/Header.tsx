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
    // Desktop: hàng logo (cao 5rem) trôi đi khi cuộn nhờ -top-20, chỉ hàng menu dính lại trên cùng.
    <header className="on-brand sticky top-0 z-40 bg-paper text-ink lg:-top-20">
      <div className="container-x relative flex h-16 items-center gap-6 lg:h-20 lg:justify-center">
        <Link href={href.home(locale)} className="shrink-0" aria-label={`TheRider – ${t.nav.home}`}>
          <Logo className="lg:h-10" />
        </Link>

        <div className="ml-auto flex items-center gap-1 sm:gap-2 lg:absolute lg:inset-y-0 lg:right-10">
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

      <div className="hidden border-y border-[var(--brand-dark-red)] bg-[var(--brand-dark-red)] lg:block">
        <div className="container-x flex h-14 items-center justify-center">
          <MainNav locale={locale} label={t.nav.categories} />
        </div>
      </div>
    </header>
  );
}
