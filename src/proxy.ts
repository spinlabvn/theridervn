import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from "@/i18n/config";



function preferredLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookie && isLocale(cookie)) return cookie;
  const header = request.headers.get("accept-language") ?? "";
  const langs = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { lang: tag.toLowerCase().slice(0, 2), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  const match = langs.find((l) => isLocale(l.lang));
  return match ? (match.lang as Locale) : defaultLocale;
}

/** Mọi URL không có tiền tố ngôn ngữ (/, /blog/...) được chuyển hướng sang /vi/... hoặc /en/... */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const first = pathname.split("/")[1];
  if (isLocale(first)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLocale(request)}${pathname === "/" ? "" : pathname}`;
  url.search = search;
  return NextResponse.redirect(url);
}

export const config = {
  // Bỏ qua API, file tĩnh, ảnh tối ưu và các file có phần mở rộng (sitemap.xml, robots.txt, favicon…)
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
