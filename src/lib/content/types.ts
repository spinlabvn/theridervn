import type { PortableTextBlock } from "@portabletext/react";
import type { Locale } from "@/i18n/config";

export type Localized<T> = Partial<Record<Locale, T>>;

export type FigureNode = { _type: "figure"; _key: string; url: string; alt?: string; caption?: string };
export type YoutubeNode = { _type: "youtube"; _key: string; url: string };
export type SpecTableNode = {
  _type: "specTable";
  _key: string;
  hasHeader?: boolean;
  rows: { _key: string; cells: string[] }[];
};
export type GalleryNode = { _type: "gallery"; _key: string; images: { _key: string; url: string; alt?: string }[] };

/** Khối Portable Text (đoạn văn, tiêu đề, danh sách) hoặc khối nhúng: ảnh, video YouTube, bảng thông số, bộ ảnh. */
export type BodyNode = PortableTextBlock | FigureNode | YoutubeNode | SpecTableNode | GalleryNode;

export interface Category {
  slug: string;
  title: string;
  description: string;
  count: number;
}

export interface Author {
  name: string;
  role: string;
  avatarUrl?: string;
}

/** Bài viết đã được "dịch" sang một ngôn ngữ cụ thể – đây là dạng mà giao diện sử dụng. */
export interface PostSummary {
  slug: string;
  title: string;
  excerpt: string;
  coverUrl: string;
  coverAlt: string;
  /** CSS object-position lấy từ điểm hotspot của ảnh trên Sanity. */
  coverPosition?: string;
  category: { slug: string; title: string };
  tags: string[];
  author: Author;
  publishedAt: string;
  featured: boolean;
  readingMinutes: number;
  /** Bài có video YouTube và gần như không có chữ (ví dụ The Rider Academy) */
  isVideo: boolean;
}

export interface Post extends PostSummary {
  body: BodyNode[];
  /** Có bản dịch thật cho ngôn ngữ đang xem hay đang hiển thị bản dự phòng. */
  isFallbackLanguage: boolean;
}

/** Dạng thô trước khi chọn ngôn ngữ – dùng chung cho nội dung nội bộ (content/*.json) và Sanity. */
export interface RawCategory {
  slug: string;
  title: Localized<string>;
  description: Localized<string>;
  order?: number;
}

export interface RawPost {
  slug: string;
  title: Localized<string>;
  excerpt: Localized<string>;
  body: Localized<BodyNode[]>;
  coverUrl: string;
  coverPosition?: string;
  coverAlt: Localized<string>;
  category: RawCategory;
  tags: string[];
  author: { name: string; role: Localized<string>; avatarUrl?: string };
  publishedAt: string;
  featured: boolean;
  /** Bài có nhúng video YouTube */
  hasVideo?: boolean;
}
