import type { PortableTextBlock } from "@portabletext/react";
import type { Locale } from "@/i18n/config";

export type Localized<T> = Partial<Record<Locale, T>>;

/** Khối Portable Text (đoạn văn, tiêu đề, danh sách) hoặc khối ảnh trong thân bài. */
export type BodyNode =
  | PortableTextBlock
  | {
      _type: "figure";
      _key: string;
      url: string;
      alt?: string;
      caption?: string;
    };

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
}

export interface Post extends PostSummary {
  body: BodyNode[];
  /** Có bản dịch thật cho ngôn ngữ đang xem hay đang hiển thị bản dự phòng. */
  isFallbackLanguage: boolean;
}

/** Dạng thô trước khi chọn ngôn ngữ – dùng chung cho dữ liệu mẫu và Sanity. */
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
}
