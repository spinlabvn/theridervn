# TheRider – Website tạp chí xe đạp thể thao

Website song ngữ (Tiếng Việt / English) cho **TheRider**, xây bằng **Next.js 16 (Node.js)**, nội dung quản lý trên **Sanity CMS**, triển khai trên **Hostinger Node.js Web App**.

- Trang chủ phong cách điện ảnh, tối/sáng tuỳ chọn (ghi nhớ lựa chọn của người đọc)
- Blog: chuyên mục, thẻ, phân trang, bài liên quan, mục lục bám dính, thanh tiến độ đọc, chia sẻ
- Tìm kiếm **không phân biệt dấu** ("da lat" tìm ra "Đà Lạt")
- SEO: metadata, Open Graph, `hreflang`, sitemap.xml, robots.txt, RSS (`/vi/rss.xml`, `/en/rss.xml`), JSON-LD NewsArticle
- Tự cập nhật khi xuất bản bài trên Sanity (ISR 60 giây + webhook tức thì)
- Chạy được ngay với **10 bài viết mẫu** khi chưa kết nối Sanity

> Hướng dẫn đưa website lên GitHub, Hostinger và kết nối Sanity: xem **[DEPLOY.md](DEPLOY.md)**.

## Chạy trên máy

Yêu cầu Node.js 20.9 trở lên (khuyên dùng 22).

```bash
npm install
cp .env.example .env.local   # để trống Sanity thì website dùng bài mẫu
npm run dev                  # http://localhost:3000
```

Build bản production:

```bash
npm run build && npm start
```

## Cấu trúc thư mục

```
src/
  app/
    [locale]/                 # /vi/... và /en/...
      page.tsx                # Trang chủ
      blog/                   # Danh sách, phân trang, chi tiết bài
      category/[slug]/        # Trang chuyên mục
      tag/[slug]/             # Trang thẻ
      search/                 # Tìm kiếm
      rss.xml/                # RSS feed
    api/revalidate/           # Webhook Sanity → cập nhật ngay
    sitemap.ts, robots.ts
    globals.css               # Token màu, font, kiểu chữ bài viết
  components/                 # Header, Footer, thẻ bài viết, mục lục…
  config/site.ts              # Tên, logo, email, mạng xã hội
  i18n/                       # Cấu hình ngôn ngữ + toàn bộ chữ trên giao diện
  lib/content/                # Lớp dữ liệu: Sanity hoặc bài mẫu
  proxy.ts                    # Chuyển / → /vi hoặc /en theo trình duyệt
studio/                       # Sanity Studio (deploy riêng, không lên Hostinger)
```

## Tuỳ chỉnh thương hiệu

| Muốn đổi | Sửa ở đâu |
| --- | --- |
| Logo | Chép file vào `public/brand/`, khai báo `logo.light` / `logo.dark` trong `src/config/site.ts` |
| Màu thương hiệu | Khối **BRAND TOKENS** đầu file `src/app/globals.css` (có cả bản sáng và tối) |
| Email, mạng xã hội | `src/config/site.ts` |
| Chữ trên giao diện (menu, nút…) | `src/i18n/dictionaries.ts` |
| Favicon | `src/app/icon.svg` |
| Ảnh chia sẻ mặc định | `src/app/[locale]/opengraph-image.tsx` |

Khi đổi màu `--accent`, hãy giữ độ tương phản: chữ trên nền accent dùng `--on-accent`, còn chữ màu accent trên nền giấy dùng `--accent-ink` (≥ 4.5:1).

## Thiết kế

- Font: **Barlow Condensed** (tiêu đề), **Be Vietnam Pro** (giao diện), **Newsreader** (thân bài) – cả ba đều hỗ trợ đầy đủ dấu tiếng Việt, tự host qua `next/font`.
- Màu: giấy `#F5F3EE` / mực `#111214`, accent cam tín hiệu `#FF4F1A`; chế độ tối dùng bộ màu riêng, đã kiểm tra tương phản WCAG AA.
- Chuyển động: chỉ dùng `transform`/`opacity`, tắt hoàn toàn khi người dùng bật "giảm chuyển động".
