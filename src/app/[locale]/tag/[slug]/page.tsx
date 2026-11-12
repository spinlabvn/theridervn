import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TagArchive, tagMetadata } from "@/components/Archives";
import { isLocale } from "@/i18n/config";

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps<"/[locale]/tag/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  return isLocale(locale) ? tagMetadata(locale, slug) : {};
}

export default async function TagPage({ params }: PageProps<"/[locale]/tag/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  return <TagArchive locale={locale} slug={slug} page={1} />;
}
