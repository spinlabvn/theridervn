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
  /** Thông tin pháp lý hiện ở cuối trang (giữ nguyên tiếng Việt ở cả hai ngôn ngữ). */
  company: {
    name: "CÔNG TY TNHH TRUYỀN THÔNG THE RIDER",
    taxId: "0318317841",
    address: "N1 Điện Biên Phủ, Phường Thạnh Mỹ Tây, TP Hồ Chí Minh, Việt Nam",
  },
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
        image: "/ads/vittoria-terreno-gravel-doc-v2.jpg",
        imageMobile: "/ads/vittoria-terreno-gravel-ngang-v2.jpg",
        href: "https://spinlab.vn/lop-xe#gravel",
        alt: "Lốp gravel Vittoria Terreno – xem tại Spinlab",
      },
      {
        image: "/ads/polygon-tambora-gravel-doc-v2.jpg",
        imageMobile: "/ads/polygon-tambora-gravel-ngang-v2.jpg",
        href: "https://spinlab.vn/xe-gravel",
        alt: "Polygon Tambora – dòng xe gravel khung carbon mới, 4 phiên bản, giá từ 45.000.000₫",
      },
    ] as AdBanner[],
    /**
     * Banner ngang trong dòng tin, sau bài thứ 3 – cũng xoay vòng như cột trái.
     * Từ 768px: tỉ lệ 970:250 (vd. 1940×500). `imageMobile`: bản 2:1 (vd. 1200×600) cho điện thoại.
     */
    feed: [
      {
        image: "/ads/story-bike-ngang-rong-v2.jpg",
        imageMobile: "/ads/story-bike-mobile-v2.jpg",
        href: "https://spinlab.vn/thuong-hieu-story-bike",
        alt: "Xe dirt jump và street trial Story chính hãng – xem tại Spinlab",
      },
      // Ô mời đặt quảng cáo (image trống) – thay bằng banner thật hoặc xoá dòng này
      { image: "", imageMobile: "", href: "", alt: "" },
    ] as AdBanner[],
  },
  /**
   * Nền theo mùa lễ: "christmas" = nền Giáng sinh (bông tuyết, cây thông, xe đạp chở quà – public/season/).
   * Đặt `null` để về nền trơn sau mùa lễ.
   */
  season: "christmas" as "christmas" | null,
  /** Thời gian hiện mỗi banner quảng cáo trước khi chuyển sang banner kế (giây). */
  adRotateSeconds: 5,
} as const;
