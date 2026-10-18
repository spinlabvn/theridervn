import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArchive, blogMetadata, parsePage } from "@/components/Archives";
import { isLocale } from "@/i18n/config";

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps<"/[locale]/blog/page/[page]">): Promise<Metadata> {
  const { locale, page } = await params;
  return isLocale(locale) ? blogMetadata(locale, Number(page) || 1) : {};
}

export default async function BlogPagedPage({ params }: PageProps<"/[locale]/blog/page/[page]">) {
  const { locale, page } = await params;
  if (!isLocale(locale)) notFound();
  return <BlogArchive locale={locale} page={parsePage(page)} />;
}
