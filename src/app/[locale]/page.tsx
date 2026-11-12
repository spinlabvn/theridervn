import { notFound } from "next/navigation";
import { HomeArchive } from "@/components/Archives";
import { isLocale } from "@/i18n/config";

export const revalidate = 60;

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <HomeArchive locale={locale} page={1} />;
}
