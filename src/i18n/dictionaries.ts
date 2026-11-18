import type { Locale } from "./config";

const vi = {
  meta: {
    title: "TheRider – Tin tức và đánh giá về xe đạp",
    description:
      "Tin tức, bike check, đánh giá xe và phụ tùng, sự kiện, podcast, phỏng vấn và video hướng dẫn kỹ thuật The Rider Academy – từ TheRider.",
  },
  nav: {
    home: "Trang chủ",
    categories: "Chuyên mục",
    search: "Tìm kiếm",
    menu: "Mở menu",
    close: "Đóng menu",
    skip: "Bỏ qua, tới nội dung chính",
  },
  theme: { toggle: "Chuyển giao diện sáng/tối", light: "Sáng", dark: "Tối" },
  language: { switch: "Đổi ngôn ngữ" },
  home: {
    eyebrow: "Tin tức & đánh giá xe đạp",
    mostViewed: "Xem nhiều nhất",
    news: "Tin tức",
    today: "Hôm nay",
    yesterday: "Hôm qua",
    popularTags: "Thẻ phổ biến",
    ad: "Quảng cáo",
    adCta: "Đặt quảng cáo tại đây",
    adLead: "Tiếp cận cộng đồng đạp xe thể thao của TheRider.",
  },
  post: {
    by: "Bởi",
    minRead: "phút đọc",
    video: "Video",
    views: (n: string) => `${n} lượt xem`,
    published: "Đăng ngày",
    contents: "Nội dung",
    tags: "Thẻ",
    share: "Chia sẻ",
    copyLink: "Sao chép liên kết",
    copied: "Đã sao chép",
    related: "Đọc tiếp",
    progress: "Tiến độ đọc",
  },
  list: {
    empty: "Chưa có bài viết nào ở đây.",
    page: "Trang",
    prev: "Trang trước",
    next: "Trang sau",
    pagination: "Phân trang",
  },
  search: {
    title: "Tìm kiếm",
    label: "Từ khoá tìm kiếm",
    placeholder: "Ví dụ: Canyon, wheelie, gravel…",
    submit: "Tìm",
    results: (n: number, q: string) => `${n} kết quả cho “${q}”`,
    noResults: (q: string) => `Không tìm thấy bài viết nào cho “${q}”.`,
    noResultsHint: "Thử từ khoá ngắn hơn, hoặc duyệt theo chuyên mục bên dưới.",
    prompt: "Nhập từ khoá để tìm trong toàn bộ bài viết.",
    popular: "Gợi ý",
  },
  notFound: {
    title: "Lạc đường rồi",
    lead: "Trang bạn tìm không tồn tại hoặc đã được chuyển đi. Quay đầu xe nhé.",
    back: "Về trang chủ",
  },
  footer: {
    tagline: "Câu chuyện, trang bị và cung đường cho người mê xe đạp thể thao.",
    explore: "Khám phá",
    follow: "Theo dõi",
    contact: "Hợp tác & quảng cáo",
    rss: "RSS",
    rights: "Bảo lưu mọi quyền.",
    taxId: "MST",
  },
};

export type Dictionary = typeof vi;

const en: Dictionary = {
  meta: {
    title: "TheRider – Cycling news & reviews",
    description:
      "Cycling news, bike checks, bike and parts reviews, events, podcasts, interviews and The Rider Academy skills videos – from TheRider.",
  },
  nav: {
    home: "Home",
    categories: "Categories",
    search: "Search",
    menu: "Open menu",
    close: "Close menu",
    skip: "Skip to main content",
  },
  theme: { toggle: "Toggle light/dark theme", light: "Light", dark: "Dark" },
  language: { switch: "Change language" },
  home: {
    eyebrow: "Cycling news & reviews",
    mostViewed: "Most viewed",
    news: "News",
    today: "Today",
    yesterday: "Yesterday",
    popularTags: "Popular tags",
    ad: "Advertisement",
    adCta: "Advertise here",
    adLead: "Reach TheRider's performance cycling community.",
  },
  post: {
    by: "By",
    minRead: "min read",
    video: "Video",
    views: (n: string) => `${n} views`,
    published: "Published",
    contents: "Contents",
    tags: "Tags",
    share: "Share",
    copyLink: "Copy link",
    copied: "Copied",
    related: "Keep reading",
    progress: "Reading progress",
  },
  list: {
    empty: "No stories here yet.",
    page: "Page",
    prev: "Previous page",
    next: "Next page",
    pagination: "Pagination",
  },
  search: {
    title: "Search",
    label: "Search keywords",
    placeholder: "e.g. Canyon, wheelie, gravel…",
    submit: "Search",
    results: (n: number, q: string) => `${n} ${n === 1 ? "result" : "results"} for “${q}”`,
    noResults: (q: string) => `No stories found for “${q}”.`,
    noResultsHint: "Try a shorter keyword, or browse by category below.",
    prompt: "Type a keyword to search every story.",
    popular: "Try",
  },
  notFound: {
    title: "Wrong turn",
    lead: "The page you're looking for doesn't exist or has moved. Let's turn around.",
    back: "Back to home",
  },
  footer: {
    tagline: "Stories, gear and routes for people obsessed with fast bikes.",
    explore: "Explore",
    follow: "Follow",
    contact: "Partnerships & advertising",
    rss: "RSS",
    rights: "All rights reserved.",
    taxId: "Tax ID",
  },
};

const dictionaries: Record<Locale, Dictionary> = { vi, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
