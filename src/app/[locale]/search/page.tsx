import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostRow } from "@/components/PostCard";
import { SearchForm } from "@/components/SearchForm";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getAllTags, getCategories, searchPosts } from "@/lib/content";
import { href } from "@/lib/format";

export async function generateMetadata({ params }: PageProps<"/[locale]/search">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDictionary(locale).search.title, robots: { index: false, follow: true } };
}

export default async function SearchPage({ params, searchParams }: PageProps<"/[locale]/search">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const raw = (await searchParams).q;
  const q = (Array.isArray(raw) ? raw[0] : raw)?.trim().slice(0, 100) ?? "";

  const [results, categories, tags] = await Promise.all([
    q ? searchPosts(locale, q) : Promise.resolve([]),
    getCategories(locale),
    getAllTags(locale),
  ]);

  return (
    <div className="container-x pt-12 sm:pt-16">
      <h1 className="display text-6xl sm:text-7xl lg:text-8xl">{t.search.title}</h1>
      <div className="mt-8 max-w-3xl">
        <SearchForm locale={locale} defaultValue={q} autoFocus={!q} />
      </div>

      <div className="mt-12 grid gap-14 lg:grid-cols-12">
        <section aria-live="polite" className="lg:col-span-8">
          {q ? (
            results.length ? (
              <>
                <h2 className="eyebrow text-ink-2">{t.search.results(results.length, q)}</h2>
                <ol className="mt-4 border-b border-line">
                  {results.map((post) => (
                    <li key={post.slug}>
                      <PostRow post={post} locale={locale} />
                    </li>
                  ))}
                </ol>
              </>
            ) : (
              <div className="border-t border-line pt-8">
                <h2 className="display text-4xl">{t.search.noResults(q)}</h2>
                <p className="mt-3 text-ink-2">{t.search.noResultsHint}</p>
              </div>
            )
          ) : (
            <p className="border-t border-line pt-8 text-lg text-ink-2">{t.search.prompt}</p>
          )}
        </section>

        <aside className="space-y-10 lg:col-span-4">
          <div>
            <h2 className="eyebrow text-ink-2">{t.nav.categories}</h2>
            <ul className="mt-4 border-t border-line">
              {categories.map((c) => (
                <li key={c.slug} className="border-b border-line">
                  <Link href={href.category(locale, c.slug)} className="group flex min-h-12 items-center justify-between py-2">
                    <span className="display text-2xl group-hover:text-accent-ink">{c.title}</span>
                    <span className="text-sm text-ink-2">{c.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="eyebrow text-ink-2">{t.search.popular}</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {tags.slice(0, 12).map((tag) => (
                <li key={tag.slug}>
                  <Link
                    href={href.tag(locale, tag.slug)}
                    className="inline-flex min-h-10 items-center rounded-full border border-line px-4 text-sm transition-colors duration-200 hover:border-ink"
                  >
                    #{tag.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
