import Link from "next/link";
import { ArrowUpRight, Mail, Rss } from "lucide-react";
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
    <footer className="scheme-dark mt-24 bg-paper text-ink">
      <div className="container-x">
        <div className="border-b border-line py-14 lg:py-20">
          <p className="display max-w-4xl text-5xl sm:text-6xl lg:text-8xl">
            {locale === "vi" ? (
              <>
                Đạp xa hơn. <span className="text-accent">Kể hay hơn.</span>
              </>
            ) : (
              <>
                Ride further. <span className="text-accent">Tell it better.</span>
              </>
            )}
          </p>
        </div>

        <div className="grid gap-10 py-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo />
            <p className="mt-4 max-w-sm text-ink-2">{t.footer.tagline}</p>
            <a
              href={`mailto:${site.email}`}
              className="group mt-6 inline-flex min-h-11 items-center gap-2 font-medium hover:text-accent-ink"
            >
              <Mail className="size-5" strokeWidth={1.8} aria-hidden="true" />
              <span>
                {t.footer.contact}: <span className="link-title">{site.email}</span>
              </span>
            </a>
          </div>

          <nav aria-label={t.footer.explore} className="md:col-span-4">
            <h2 className="eyebrow text-ink-2">{t.footer.explore}</h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-6">
              <li>
                <Link href={href.blog(locale)} className="flex min-h-11 items-center hover:text-accent-ink">
                  {t.nav.stories}
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
            <a href={href.rss(locale)} className="mt-4 inline-flex min-h-11 items-center gap-2 text-ink-2 hover:text-ink">
              <Rss className="size-4" strokeWidth={1.8} aria-hidden="true" />
              {t.footer.rss}
              <ArrowUpRight className="size-4" strokeWidth={1.8} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-line py-6 text-sm text-ink-2 sm:flex-row sm:justify-between">
          <p>
            © {year} {site.name}. {t.footer.rights}
          </p>
          <p>{new URL(site.url).host}</p>
        </div>
      </div>
    </footer>
  );
}
