import { defineArrayMember, defineType } from "sanity";

/** Trình soạn thảo thân bài: đoạn văn, tiêu đề H2/H3, trích dẫn, danh sách, liên kết và ảnh có chú thích. */
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
  ],
});
