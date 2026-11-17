import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from "@/i18n/config";

/**
 * Mặc định luôn là tiếng Việt; chỉ dùng ngôn ngữ khác khi người đọc đã tự chọn bằng nút đổi ngôn ngữ (cookie).
 * Không dựa vào ngôn ngữ trình duyệt.
 */
function preferredLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  return cookie && isLocale(cookie) ? cookie : defaultLocale;
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
