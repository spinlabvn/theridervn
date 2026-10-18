import { site } from "@/config/site";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getAllPosts } from "@/lib/content";
import { href } from "@/lib/format";

export const revalidate = 300;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET(_req: Request, ctx: RouteContext<"/[locale]/rss.xml">) {
  const { locale } = await ctx.params;
  if (!isLocale(locale)) return new Response("Not found", { status: 404 });
  const t = getDictionary(locale);
  const posts = (await getAllPosts(locale)).slice(0, 30);

  const items = posts
    .map((p) => {
      const url = `${site.url}${href.post(locale, p.slug)}`;
      return `<item>
  <title>${esc(p.title)}</title>
  <link>${url}</link>
  <guid isPermaLink="true">${url}</guid>
  <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
  <category>${esc(p.category.title)}</category>
  <description>${esc(p.excerpt)}</description>
</item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${esc(t.meta.title)}</title>
  <link>${site.url}/${locale}</link>
  <description>${esc(t.meta.description)}</description>
  <language>${locale}</language>
  <atom:link href="${site.url}${href.rss(locale)}" rel="self" type="application/rss+xml"/>
${items}
</channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
