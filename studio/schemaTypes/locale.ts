import { defineField, defineType } from "sanity";

/** Các trường song ngữ: tiếng Việt là bắt buộc, tiếng Anh là tuỳ chọn (thiếu sẽ hiển thị bản tiếng Việt). */
export const localeString = defineType({
  name: "localeString",
  title: "Chuỗi song ngữ",
  type: "object",
  fieldsets: [{ name: "translations", title: "Bản dịch", options: { collapsible: true, collapsed: false } }],
  fields: [
    defineField({ name: "vi", title: "Tiếng Việt", type: "string", validation: (r) => r.required() }),
    defineField({ name: "en", title: "English", type: "string", fieldset: "translations" }),
  ],
});

export const localeText = defineType({
  name: "localeText",
  title: "Đoạn văn song ngữ",
  type: "object",
  fields: [
    defineField({ name: "vi", title: "Tiếng Việt", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "en", title: "English", type: "text", rows: 3 }),
  ],
});

export const localeBlockContent = defineType({
  name: "localeBlockContent",
  title: "Nội dung song ngữ",
  type: "object",
  fields: [
    defineField({ name: "vi", title: "Tiếng Việt", type: "blockContent", validation: (r) => r.required() }),
    defineField({ name: "en", title: "English", type: "blockContent" }),
  ],
});
