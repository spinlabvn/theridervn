/**
 * Cấu hình thương hiệu TheRider.
 * Đặt logo vào public/brand/ rồi khai báo đường dẫn ở `logo` (để null sẽ dùng logo chữ).
 * Màu thương hiệu nằm trong src/app/globals.css (khối "BRAND TOKENS").
 */
export const site = {
  name: "TheRider",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://therider.vn").replace(/\/$/, ""),
  /**
   * Logo lấy từ therider.vn: chữ trắng trên nền trong suốt (360×70).
   * Ở giao diện sáng, logo được tô đen bằng CSS (filter) nên chỉ cần một file.
   */
  logo: {
    src: "/brand/therider-logo.png" as string | null,
    width: 144,
    height: 28,
  },
  email: "info@therider.vn",
  social: {
    facebook: "https://www.facebook.com/therider.vn",
    instagram: "https://www.instagram.com/therider.vn/",
    youtube: "https://www.youtube.com/@theridertv",
    tiktok: "https://www.tiktok.com/@therider.vn",
  },
  /** Số bài mỗi trang của dòng tin (trang chủ, chuyên mục, thẻ) – như Pinkbike, cuối trang có nút sang trang. */
  postsPerPage: 8,
  /**
   * Quảng cáo trang chủ. Đặt file banner vào public/ads/ rồi điền `image: "/ads/ten-file.jpg"`,
   * `href`: trang của nhà tài trợ. Để `image` trống thì hiện ô "Đặt quảng cáo tại đây" dẫn tới email liên hệ.
   */
  ads: {
    /**
     * Ô cột trái – cao bằng khối "Xem nhiều nhất" (~250×850px trên màn hình rộng).
     * Banner dọc khoảng 1:3 (vd. 500×1500), nội dung chính đặt giữa vì mép trên/dưới có thể bị cắt.
     * `imageMobile` (tuỳ chọn): bản ngang 6:5 (vd. 1200×1000) hiện dưới 1280px, khi ô nằm ở cột phải hoặc trên điện thoại.
     */
    sidebar: {
      image: "/ads/vittoria-terreno-gravel-doc.jpg" as string,
      imageMobile: "/ads/vittoria-terreno-gravel-ngang.jpg" as string,
      href: "https://spinlab.vn/lop-xe#gravel" as string,
      alt: "Lốp gravel Vittoria Terreno – xem tại Spinlab" as string,
    },
    /** Banner ngang trong dòng tin, sau bài thứ 3 – tỉ lệ cố định 970:250 (vd. 1940×500). */
    feed: { image: "" as string, imageMobile: "" as string, href: "" as string, alt: "" as string },
  },
} as const;
