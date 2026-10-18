import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryArchive, categoryMetadata, parsePage } from "@/components/Archives";
import { isLocale } from "@/i18n/config";

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps<"/[locale]/category/[slug]/page/[page]">): Promise<Metadata> {
  const { locale, slug, page } = await params;
  return isLocale(locale) ? categoryMetadata(locale, slug, Number(page) || 1) : {};
}

export default async function CategoryPagedPage({ params }: PageProps<"/[locale]/category/[slug]/page/[page]">) {
  const { locale, slug, page } = await params;
  if (!isLocale(locale)) notFound();
  return <CategoryArchive locale={locale} slug={slug} page={parsePage(page)} />;
}
