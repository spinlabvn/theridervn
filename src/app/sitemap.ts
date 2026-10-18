import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { locales } from "@/i18n/config";
import { getAllPosts, getCategories } from "@/lib/content";
import { href } from "@/lib/format";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const abs = (path: string) => `${site.url}${path}`;
  const alt = (fn: (l: (typeof locales)[number]) => string) => ({
    languages: Object.fromEntries(locales.map((l) => [l, abs(fn(l))])),
  });

  const [posts, categories] = await Promise.all([getAllPosts("vi"), getCategories("vi")]);
  const entries: MetadataRoute.Sitemap = [];

  for (const l of locales) {
    entries.push({ url: abs(href.home(l)), changeFrequency: "daily", priority: 1, alternates: alt(href.home) });
    entries.push({ url: abs(href.blog(l)), changeFrequency: "daily", priority: 0.8, alternates: alt((x) => href.blog(x)) });
    for (const c of categories) {
      entries.push({
        url: abs(href.category(l, c.slug)),
        changeFrequency: "weekly",
        priority: 0.6,
        alternates: alt((x) => href.category(x, c.slug)),
      });
    }
    for (const p of posts) {
      entries.push({
        url: abs(href.post(l, p.slug)),
        lastModified: p.publishedAt,
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: alt((x) => href.post(x, p.slug)),
      });
    }
  }
  return entries;
}
