import type { BodyNode } from "./types";

/** Bỏ dấu tiếng Việt + hạ chữ thường để tìm kiếm không phân biệt dấu. */
export function normalizeText(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

export function slugify(input: string): string {
  return normalizeText(input)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type Span = { _type?: string; text?: string };

export function blockText(node: BodyNode): string {
  if (node._type !== "block") return "";
  const children = (node as { children?: Span[] }).children ?? [];
  return children.map((c) => c.text ?? "").join("");
}

export function bodyToPlainText(body: BodyNode[]): string {
  return body.map(blockText).filter(Boolean).join("\n\n");
}

export function readingMinutes(body: BodyNode[]): number {
  const words = bodyToPlainText(body).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/** Mục lục từ các tiêu đề h2/h3 – id được dùng làm anchor trong bài. */
export function headingsOf(body: BodyNode[]) {
  const seen = new Map<string, number>();
  return body
    .filter((n) => n._type === "block" && ["h2", "h3"].includes((n as { style?: string }).style ?? ""))
    .map((n) => {
      const text = blockText(n);
      const base = slugify(text) || "muc";
      const count = seen.get(base) ?? 0;
      seen.set(base, count + 1);
      return {
        key: n._key,
        id: count ? `${base}-${count}` : base,
        text,
        level: (n as { style?: string }).style === "h3" ? 3 : 2,
      };
    });
}

let keySeed = 0;
const key = () => `k${(keySeed++).toString(36)}`;

function spans(text: string) {
  // Hỗ trợ **in đậm** đơn giản trong nội dung mẫu
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part) =>
      part.startsWith("**")
        ? { _type: "span", _key: key(), text: part.slice(2, -2), marks: ["strong"] }
        : { _type: "span", _key: key(), text: part, marks: [] },
    );
}

/**
 * Chuyển văn bản dạng markdown tối giản (## h2, ### h3, > trích dẫn, - danh sách, 1. danh sách số)
 * thành Portable Text – chỉ dùng cho bài viết mẫu khi chưa kết nối Sanity.
 */
export function md(source: string): BodyNode[] {
  const out: BodyNode[] = [];
  for (const chunk of source.trim().split(/\n\s*\n/)) {
    const lines = chunk.trim().split("\n").map((l) => l.trim());
    if (lines.every((l) => /^[-*] /.test(l)) || lines.every((l) => /^\d+\. /.test(l))) {
      const listItem = /^\d+\. /.test(lines[0]) ? "number" : "bullet";
      for (const l of lines) {
        out.push({
          _type: "block",
          _key: key(),
          style: "normal",
          listItem,
          level: 1,
          markDefs: [],
          children: spans(l.replace(/^([-*]|\d+\.) /, "")),
        } as BodyNode);
      }
      continue;
    }
    const text = lines.join(" ");
    let style = "normal";
    let content = text;
    if (text.startsWith("### ")) [style, content] = ["h3", text.slice(4)];
    else if (text.startsWith("## ")) [style, content] = ["h2", text.slice(3)];
    else if (text.startsWith("> ")) [style, content] = ["blockquote", text.slice(2)];
    out.push({ _type: "block", _key: key(), style, markDefs: [], children: spans(content) } as BodyNode);
  }
  return out;
}
