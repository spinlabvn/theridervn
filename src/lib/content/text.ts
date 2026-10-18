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
