import { defineArrayMember, defineType } from "sanity";

/** Trình soạn thảo thân bài: đoạn văn, tiêu đề, trích dẫn, danh sách, liên kết, ảnh, video YouTube và bảng thông số. */
export const blockContent = defineType({
  name: "blockContent",
  title: "Nội dung",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Đoạn văn", value: "normal" },
        { title: "Tiêu đề lớn (H2)", value: "h2" },
        { title: "Tiêu đề nhỏ (H3)", value: "h3" },
        { title: "Trích dẫn nổi bật", value: "blockquote" },
      ],
      lists: [
        { title: "Gạch đầu dòng", value: "bullet" },
        { title: "Đánh số", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "In đậm", value: "strong" },
          { title: "In nghiêng", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Liên kết",
            fields: [
              {
                name: "href",
                type: "url",
                title: "URL",
                validation: (r) => r.uri({ allowRelative: true, scheme: ["http", "https", "mailto"] }),
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: "image",
      title: "Ảnh",
      options: { hotspot: true },
      fields: [
        { name: "alt", type: "string", title: "Mô tả ảnh (cho người khiếm thị & SEO)", validation: (r) => r.required() },
        { name: "caption", type: "string", title: "Chú thích" },
      ],
    }),
    defineArrayMember({
      name: "youtube",
      type: "object",
      title: "Video YouTube",
      fields: [
        {
          name: "url",
          type: "url",
          title: "Đường dẫn YouTube",
          description: "Ví dụ: https://www.youtube.com/watch?v=8Pk26JZoTsA",
          validation: (r) => r.required().uri({ scheme: ["https"] }),
        },
      ],
      preview: { select: { title: "url" }, prepare: ({ title }) => ({ title: "▶ Video YouTube", subtitle: title }) },
    }),
    defineArrayMember({
      name: "specTable",
      type: "object",
      title: "Bảng thông số (Bike Check)",
      fields: [
        { name: "hasHeader", type: "boolean", title: "Dòng đầu là tiêu đề cột", initialValue: true },
        {
          name: "rows",
          type: "array",
          title: "Các dòng",
          description: "Mỗi dòng gồm các ô: Bộ phận | Hãng | Model | Ghi chú",
          of: [
            {
              type: "object",
              name: "row",
              fields: [{ name: "cells", type: "array", title: "Ô", of: [{ type: "string" }] }],
              preview: {
                select: { cells: "cells" },
                prepare: ({ cells }) => ({ title: (cells ?? []).filter(Boolean).join(" · ") || "(dòng trống)" }),
              },
            },
          ],
        },
      ],
      preview: { select: { rows: "rows" }, prepare: ({ rows }) => ({ title: "Bảng thông số", subtitle: `${rows?.length ?? 0} dòng` }) },
    }),
  ],
});
