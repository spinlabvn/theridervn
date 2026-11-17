# TheRider – Website tạp chí xe đạp thể thao

Website song ngữ (Tiếng Việt / English) cho **TheRider**, xây bằng **Next.js 16 (Node.js)**, nội dung quản lý trên **Sanity CMS**, triển khai trên **Hostinger Node.js Web App**.

- Trang chủ dạng dòng tin như Pinkbike (chuyên mục | tin mới nhất | xem nhiều nhất – tự đếm lượt xem), tối/sáng tuỳ chọn (ghi nhớ lựa chọn của người đọc)
- Trang chủ, mỗi chuyên mục và mỗi thẻ: 8 bài/trang, nút sang trang như Pinkbike; bài liên quan, mục lục bám dính, thanh tiến độ đọc, chia sẻ
- Tìm kiếm **không phân biệt dấu** ("da lat" tìm ra "Đà Lạt")
- SEO: metadata, Open Graph, `hreflang`, sitemap.xml, robots.txt, RSS (`/vi/rss.xml`, `/en/rss.xml`), JSON-LD NewsArticle
- Tự cập nhật khi xuất bản bài trên Sanity (ISR 60 giây + webhook tức thì)
- Đã chuyển toàn bộ nội dung từ therider.vn (8 bài, 8 chuyên mục, ảnh, logo) và dịch sang tiếng Anh – website chạy được ngay cả khi chưa kết nối Sanity

> Hướng dẫn đưa website lên GitHub, Hostinger và kết nối Sanity: xem **[DEPLOY.md](DEPLOY.md)**.

## Chạy trên máy

Yêu cầu Node.js 20.9 trở lên (khuyên dùng 22).

```bash
npm install
cp .env.example .env.local   # để trống Sanity thì website dùng nội dung trong content/
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
      page.tsx, page/[page]/  # Trang chủ (dòng tin, phân trang)
      blog/[slug]/            # Chi tiết bài
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
  lib/content/                # Lớp dữ liệu: Sanity hoặc content/*.json
  proxy.ts                    # Chuyển / → /vi hoặc /en theo trình duyệt
content/
  therider.json               # 8 bài viết chuyển từ therider.vn (vi + en)
  categories.json             # 8 chuyên mục giống therider.vn
public/media/                 # Ảnh bài viết tải về từ therider.vn
public/brand/                 # Logo TheRider
studio/                       # Sanity Studio (deploy riêng, không lên Hostinger)
```

## Nội dung chuyển từ therider.vn

| Chuyên mục | Bài |
| --- | --- |
| Tin mới (News) | Keegan Swenson & bánh hai van, Revel Bikes, Propain Tyee 2025 |
| Bike Check | Canyon Grizl CF SL AXS (gallery, video, bảng cấu hình) |
| How To | 4 video The Rider Academy: Bunny Hop, Hop, Track Stand, Wheelie |
| Review Bikes, Review Parts, Events, Podcast, Interview | Chưa có bài (giống therider.vn) |

Ba bài "Tin mới" trên therider.vn không thuộc chuyên mục nào (chỉ hiện ở mục *New* trang chủ), nên được gom vào chuyên mục **Tin mới**. Dòng ghi nguồn cuối bài (cyclingnow.com, Pinkbike, Vital MTB) được giữ nguyên. Bản tiếng Anh do Claude dịch – nên rà lại trước khi ra mắt.

## Tuỳ chỉnh thương hiệu

| Muốn đổi | Sửa ở đâu |
| --- | --- |
| Logo | `public/brand/therider-logo.png` (lấy từ therider.vn), khai báo trong `src/config/site.ts` |
| Màu thương hiệu | Khối **BRAND TOKENS** đầu file `src/app/globals.css` (có cả bản sáng và tối) |
| Email, mạng xã hội | `src/config/site.ts` |
| Quảng cáo trang chủ (ô cột trái, banner sau bài thứ 3) | Ảnh vào `public/ads/`, khai báo ở `ads` trong `src/config/site.ts` (ô cột trái: bản dọc 1:3 + bản ngang 6:5 `imageMobile` cho màn hình dưới 1280px) |
| Chữ trên giao diện (menu, nút…) | `src/i18n/dictionaries.ts` |
| Favicon | `src/app/icon.svg` |
| Ảnh chia sẻ mặc định | `src/app/[locale]/opengraph-image.tsx` |

Khi đổi màu `--accent`, hãy giữ độ tương phản: chữ trên nền accent dùng `--on-accent`, còn chữ màu accent trên nền giấy dùng `--accent-ink` (≥ 4.5:1).

## Thiết kế

- Font: **Be Vietnam Pro** cho toàn site (giống website Spinlab) – tiêu đề đậm 800 in hoa, đủ dấu tiếng Việt, tự host qua `next/font`.
- Màu: giấy `#F5F3EE` / mực `#111214`, accent cam tín hiệu `#FF4F1A`; chế độ tối dùng bộ màu riêng, đã kiểm tra tương phản WCAG AA.
- Chuyển động: chỉ dùng `transform`/`opacity`, tắt hoàn toàn khi người dùng bật "giảm chuyển động".
