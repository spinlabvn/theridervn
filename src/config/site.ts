/**
 * Cấu hình thương hiệu TheRider.
 * Đặt logo vào public/brand/ rồi khai báo đường dẫn ở `logo` (để null sẽ dùng logo chữ).
 * Màu thương hiệu nằm trong src/app/globals.css (khối "BRAND TOKENS").
 */
export type AdBanner = { image: string; imageMobile: string; href: string; alt: string };

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
     * Cột trái – banner xoay vòng, mỗi banner hiện `adRotateSeconds` giây. Thêm banner = thêm một dòng.
     * Ô cao bằng khối "Xem nhiều nhất" (~250×850px trên màn hình rộng): banner dọc khoảng 1:3 (vd. 500×1500),
     * nội dung chính đặt giữa vì mép trên/dưới có thể bị cắt.
     * `imageMobile`: bản ngang 6:5 (vd. 1200×1000) hiện dưới 1280px, khi ô nằm ở cột phải hoặc trên điện thoại.
     */
    sidebar: [
      {
        image: "/ads/vittoria-terreno-gravel-doc.jpg",
        imageMobile: "/ads/vittoria-terreno-gravel-ngang.jpg",
        href: "https://spinlab.vn/lop-xe#gravel",
        alt: "Lốp gravel Vittoria Terreno – xem tại Spinlab",
      },
      {
        image: "/ads/polygon-xe-dap-doc.jpg",
        imageMobile: "/ads/polygon-xe-dap-ngang.jpg",
        href: "https://spinlab.vn/thuong-hieu-polygon",
        alt: "Xe đạp Polygon chính hãng – 48 mẫu road, địa hình, gravel, thành phố tại Spinlab",
      },
    ] as AdBanner[],
    /**
     * Banner ngang trong dòng tin, sau bài thứ 3 – cũng xoay vòng như cột trái.
     * Từ 768px: tỉ lệ 970:250 (vd. 1940×500). `imageMobile`: bản 2:1 (vd. 1200×600) cho điện thoại.
     */
    feed: [
      {
        image: "/ads/story-bike-ngang-rong.jpg",
        imageMobile: "/ads/story-bike-mobile.jpg",
        href: "https://spinlab.vn/thuong-hieu-story-bike",
        alt: "Xe dirt jump và street trial Story chính hãng – xem tại Spinlab",
      },
      // Ô mời đặt quảng cáo (image trống) – thay bằng banner thật hoặc xoá dòng này
      { image: "", imageMobile: "", href: "", alt: "" },
    ] as AdBanner[],
  },
  /** Thời gian hiện mỗi banner quảng cáo trước khi chuyển sang banner kế (giây). */
  adRotateSeconds: 5,
} as const;
