import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { notFound } from "next/navigation";
import Script from "next/script";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { site } from "@/config/site";
import { isLocale, localeMeta, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { href } from "@/lib/format";
import { themeInitScript } from "@/lib/theme";
import "../globals.css";

// Một họ font cho toàn site như website Spinlab: Be Vietnam Pro (đủ dấu tiếng Việt), tiêu đề đậm 800 in hoa
const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-be-vietnam",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Cùng màu đỏ của thanh đầu trang; không đổi theo chế độ tối của hệ điều hành
  themeColor: "#bc2b28",
};

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return {
    metadataBase: new URL(site.url),
    title: { default: t.meta.title, template: `%s | ${site.name}` },
    description: t.meta.description,
    applicationName: site.name,
    alternates: {
      canonical: `/${locale}`,
      languages: { vi: "/vi", en: "/en", "x-default": "/vi" },
      types: { "application/rss+xml": href.rss(locale) },
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: localeMeta[locale].ogLocale,
      title: t.meta.title,
      description: t.meta.description,
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <html
      lang={localeMeta[locale].htmlLang}
      data-theme="light"
      suppressHydrationWarning
      className={beVietnam.variable}
    >
      <body className="flex min-h-dvh flex-col">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <a
          href="#main"
          className="fixed left-4 top-3 z-[100] -translate-y-24 rounded-md bg-accent px-4 py-3 font-semibold text-on-accent transition-transform focus:translate-y-0"
        >
          {t.nav.skip}
        </a>
        <Header locale={locale} />
        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <Footer locale={locale} />
      </body>
    </html>
  );
}
