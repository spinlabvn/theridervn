import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TagArchive, parsePage, tagMetadata } from "@/components/Archives";
import { isLocale } from "@/i18n/config";

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps<"/[locale]/tag/[slug]/page/[page]">): Promise<Metadata> {
  const { locale, slug, page } = await params;
  return isLocale(locale) ? tagMetadata(locale, slug, Number(page) || 1) : {};
}

export default async function TagPagedPage({ params }: PageProps<"/[locale]/tag/[slug]/page/[page]">) {
  const { locale, slug, page } = await params;
  if (!isLocale(locale)) notFound();
  return <TagArchive locale={locale} slug={slug} page={parsePage(page)} />;
}
