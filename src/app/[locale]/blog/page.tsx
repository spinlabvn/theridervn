import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArchive, blogMetadata } from "@/components/Archives";
import { isLocale } from "@/i18n/config";

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps<"/[locale]/blog">): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? blogMetadata(locale) : {};
}

export default async function BlogPage({ params }: PageProps<"/[locale]/blog">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <BlogArchive locale={locale} page={1} />;
}
