import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { PostCard, PostMeta, PostOverlayCard, PostRow } from "@/components/PostCard";
import { SearchForm } from "@/components/SearchForm";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getAllPosts, getAllTags, getCategories, type PostSummary } from "@/lib/content";
import { href } from "@/lib/format";

export const revalidate = 60;

function SectionHeading({ title, lead, link }: { title: string; lead?: string; link?: { href: string; label: string } }) {
  return (
    <div className="mb-10 flex flex-col gap-4 border-t-4 border-ink pt-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="display text-5xl sm:text-6xl">{title}</h2>
        {lead ? <p className="mt-2 max-w-xl text-ink-2">{lead}</p> : null}
      </div>
      {link ? (
        <Link href={link.href} className="group inline-flex min-h-11 shrink-0 items-center gap-2 font-semibold">
          <span className="link-title">{link.label}</span>
          <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      ) : null}
    </div>
  );
}

function Hero({ post, locale }: { post: PostSummary; locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <section aria-labelledby="hero-title" className="scheme-dark relative isolate overflow-hidden bg-paper text-ink">
      <div className="absolute inset-0 -z-10">
        {post.coverUrl ? (
          <Image
            src={post.coverUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="hero-media object-cover"
            style={post.coverPosition ? { objectPosition: post.coverPosition } : undefined}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
      </div>

      <div className="container-x flex min-h-[calc(100svh-4rem)] flex-col justify-end pb-12 pt-32 lg:min-h-[calc(100svh-4.5rem)] lg:pb-16">
        <p className="rise eyebrow flex items-center gap-3 text-white/85" style={{ ["--i" as string]: 0 }}>
          <span className="h-px w-10 bg-accent" aria-hidden="true" />
          {t.home.eyebrow} · {post.category.title}
        </p>
        <h1
          id="hero-title"
          className="rise display mt-5 max-w-5xl text-[3.25rem] text-white sm:text-7xl lg:text-[7.5rem]"
          style={{ ["--i" as string]: 1 }}
        >
          <Link href={href.post(locale, post.slug)} className="hover:text-accent focus-visible:text-accent">
            {post.title}
          </Link>
        </h1>
        <div className="rise mt-6 grid gap-6 lg:grid-cols-12 lg:items-end" style={{ ["--i" as string]: 2 }}>
          <p className="max-w-2xl text-lg text-white/85 lg:col-span-7 lg:text-xl">{post.excerpt}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4 lg:col-span-5 lg:justify-end">
            <PostMeta post={post} locale={locale} className="text-white/75" />
            <Link
              href={href.post(locale, post.slug)}
              className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-6 font-semibold text-on-accent transition-colors duration-200 hover:bg-white"
            >
              {t.home.readStory}
              <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  const [posts, categories, tags] = await Promise.all([getAllPosts(locale), getCategories(locale), getAllTags(locale)]);
  if (!posts.length) {
    return <p className="container-x py-32 text-center text-lg text-ink-2">{t.list.empty}</p>;
  }

  const hero = posts.find((p) => p.featured) ?? posts[0];
  const rest = posts.filter((p) => p.slug !== hero.slug);
  const [lead, ...others] = rest;
  const rows = others.slice(0, 4);
  const more = others.slice(4, 7);
  const picks = rest.filter((p) => p.featured).slice(0, 2);
  const coverFor = (slug: string) => posts.find((p) => p.category.slug === slug && p.coverUrl);

  return (
    <>
      <Hero post={hero} locale={locale} />

      {/* Dải chuyên mục */}
      <nav aria-label={t.nav.categories} className="bg-accent text-on-accent">
        <ul className="container-x flex gap-x-8 gap-y-1 overflow-x-auto py-4 [scrollbar-width:none]">
          {categories.map((c, i) => (
            <li key={c.slug} className="flex shrink-0 items-center gap-8">
              {i > 0 ? <span aria-hidden="true" className="display text-2xl opacity-40">/</span> : null}
              <Link href={href.category(locale, c.slug)} className="display flex min-h-11 items-center text-2xl hover:underline sm:text-3xl">
                {c.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mới nhất */}
      {lead ? (
        <section aria-labelledby="latest" className="container-x pt-20 lg:pt-28">
          <div id="latest">
            <SectionHeading
              title={t.home.latest}
              lead={t.home.latestLead}
              link={{ href: href.blog(locale), label: t.home.allStories }}
            />
          </div>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <PostCard post={lead} locale={locale} size="lg" />
            </div>
            {rows.length ? (
              <ol className="lg:col-span-5">
                {rows.map((post, i) => (
                  <li key={post.slug} className="reveal">
                    <PostRow post={post} locale={locale} index={i} />
                  </li>
                ))}
              </ol>
            ) : null}
          </div>
          {more.length ? (
            <ul className="mt-16 grid gap-x-8 gap-y-14 border-t border-line pt-12 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((post) => (
                <li key={post.slug} className="reveal grid">
                  <PostCard post={post} locale={locale} />
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {/* Biên tập chọn */}
      {picks.length ? (
        <section aria-labelledby="picks" className="container-x pt-24 lg:pt-32">
          <div id="picks">
            <SectionHeading title={t.home.editorsPick} />
          </div>
          <ul className="grid gap-6 lg:grid-cols-2">
            {picks.map((post) => (
              <li key={post.slug} className="reveal grid">
                <PostOverlayCard post={post} locale={locale} className="lg:min-h-[34rem]" />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Chuyên mục */}
      <section aria-labelledby="explore" className="container-x pt-24 lg:pt-32">
        <div id="explore">
          <SectionHeading title={t.home.exploreTitle} lead={t.home.exploreLead} />
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => {
            const cover = coverFor(c.slug);
            return (
              <li key={c.slug} className="reveal grid">
                <Link
                  href={href.category(locale, c.slug)}
                  className="group scheme-dark relative isolate flex min-h-64 flex-col justify-between overflow-hidden bg-paper p-6 text-ink"
                >
                  {cover ? (
                    <Image
                      src={cover.coverUrl}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="media-zoom -z-10 object-cover opacity-55 transition-opacity duration-500 group-hover:opacity-75"
                      style={cover.coverPosition ? { objectPosition: cover.coverPosition } : undefined}
                    />
                  ) : null}
                  <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 to-black/20" />
                  <span className="eyebrow self-start rounded-full bg-black/40 px-3 py-1.5 text-white/90 backdrop-blur-sm">
                    {t.list.storiesCount(c.count)}
                  </span>
                  <span>
                    <span className="display flex items-center justify-between gap-4 text-5xl text-white">
                      {c.title}
                      <ArrowUpRight
                        className="size-8 shrink-0 text-accent transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="mt-2 block text-white/80">{c.description}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Tìm kiếm */}
      <section aria-labelledby="search-cta" className="container-x pt-24 lg:pt-32">
        <div className="grid gap-10 bg-surface-2 p-6 sm:p-10 lg:grid-cols-12 lg:p-16">
          <div className="lg:col-span-5">
            <h2 id="search-cta" className="display text-5xl sm:text-6xl">
              {t.home.searchTitle}
            </h2>
            <p className="mt-4 text-lg text-ink-2">{t.home.searchLead}</p>
          </div>
          <div className="lg:col-span-7 lg:self-end">
            <SearchForm locale={locale} />
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="eyebrow mr-1 text-ink-2">{t.search.popular}</span>
              {tags.slice(0, 6).map((tag) => (
                <Link
                  key={tag.slug}
                  href={href.tag(locale, tag.slug)}
                  className="inline-flex min-h-10 items-center rounded-full border border-line bg-paper px-4 text-sm transition-colors duration-200 hover:border-ink"
                >
                  #{tag.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
