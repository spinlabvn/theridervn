import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryArchive, categoryMetadata } from "@/components/Archives";
import { isLocale, locales } from "@/i18n/config";
import { getCategories } from "@/lib/content";

export const revalidate = 60;

export async function generateStaticParams() {
  const params = [];
  for (const locale of locales) {
    for (const c of await getCategories(locale)) params.push({ locale, slug: c.slug });
  }
  return params;
}

export async function generateMetadata({ params }: PageProps<"/[locale]/category/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  return isLocale(locale) ? categoryMetadata(locale, slug) : {};
}

export default async function CategoryPage({ params }: PageProps<"/[locale]/category/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  return <CategoryArchive locale={locale} slug={slug} page={1} />;
}
