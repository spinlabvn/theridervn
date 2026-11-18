import Link from "next/link";
import { site } from "@/config/site";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getCategories } from "@/lib/content";
import { href } from "@/lib/format";
import { Logo } from "./Logo";
import { FacebookIcon, InstagramIcon, TiktokIcon, YoutubeIcon } from "./SocialIcons";

const socials = [
  { key: "facebook", label: "Facebook", Icon: FacebookIcon },
  { key: "instagram", label: "Instagram", Icon: InstagramIcon },
  { key: "youtube", label: "YouTube", Icon: YoutubeIcon },
  { key: "tiktok", label: "TikTok", Icon: TiktokIcon },
] as const;

export async function Footer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const categories = await getCategories(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="scheme-dark mt-16 bg-paper text-ink lg:mt-20">
      <div className="container-x">
        <div className="grid gap-10 py-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo />
            <address className="mt-4 text-sm leading-relaxed text-ink-2 not-italic">
              <p className="font-semibold text-ink">{site.company.name}</p>
              <p>
                {t.footer.taxId}: {site.company.taxId}
              </p>
              <p>{site.company.address}</p>
            </address>
          </div>

          <nav aria-label={t.footer.explore} className="md:col-span-4">
            <h2 className="eyebrow text-ink-2">{t.footer.explore}</h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-6">
              <li>
                <Link href={href.home(locale)} className="flex min-h-11 items-center hover:text-accent-ink">
                  {t.nav.home}
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={href.category(locale, c.slug)} className="flex min-h-11 items-center hover:text-accent-ink">
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <h2 className="eyebrow text-ink-2">{t.footer.follow}</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {socials.map(({ key, label, Icon }) => (
                <li key={key}>
                  <a
                    href={site.social[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="grid size-11 place-items-center rounded-full border border-line transition-colors duration-200 hover:border-accent hover:bg-accent hover:text-on-accent"
                  >
                    <Icon />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-line py-6 text-sm text-ink-2">
          <p>
            © {year} {site.name}. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
