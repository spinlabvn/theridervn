import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomeArchive, homeMetadata, parsePage } from "@/components/Archives";
import { isLocale } from "@/i18n/config";

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps<"/[locale]/page/[page]">): Promise<Metadata> {
  const { locale, page } = await params;
  return isLocale(locale) ? homeMetadata(locale, Number(page) || 1) : {};
}

export default async function HomePagedPage({ params }: PageProps<"/[locale]/page/[page]">) {
  const { locale, page } = await params;
  if (!isLocale(locale)) notFound();
  return <HomeArchive locale={locale} page={parsePage(page)} />;
}
