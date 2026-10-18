import "server-only";
import { createClient, type QueryParams } from "@sanity/client";
import { categoriesQuery, postBySlugQuery, postSummariesQuery } from "./queries";
import type { BodyNode, Localized, RawCategory, RawPost } from "./types";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_READ_TOKEN || undefined;

export const sanityEnabled = Boolean(projectId);

const client = sanityEnabled
  ? createClient({
      projectId,
      dataset,
      apiVersion: "2025-02-19",
      useCdn: !token,
      token,
      perspective: "published",
    })
  : null;

/** Mọi truy vấn được cache 60 giây và được làm mới ngay qua webhook /api/revalidate. */
async function query<T>(groq: string, params: QueryParams = {}): Promise<T> {
  if (!client) throw new Error("Sanity chưa được cấu hình");
  return client.fetch<T>(groq, params, { next: { revalidate: 60, tags: ["sanity"] } });
}

type SanityImage = {
  url?: string;
  hotspot?: { x: number; y: number };
};

type SanityPostSummary = Omit<RawPost, "body" | "coverUrl"> & {
  cover?: SanityImage;
  plain: Localized<string>;
};

type SanityPost = SanityPostSummary & { body: Localized<BodyNode[]> };

export type SanitySummary = Omit<RawPost, "body"> & { coverPosition?: string; plain: Localized<string> };

function normalizeSummary(p: SanityPostSummary): SanitySummary {
  const { cover, ...rest } = p;
  return {
    ...rest,
    title: p.title ?? {},
    excerpt: p.excerpt ?? {},
    coverAlt: p.coverAlt ?? {},
    author: p.author ?? { name: "TheRider", role: {} },
    coverUrl: cover?.url ? `${cover.url}?auto=format&w=2000&q=80` : "",
    coverPosition: cover?.hotspot ? `${cover.hotspot.x * 100}% ${cover.hotspot.y * 100}%` : undefined,
  };
}

export async function sanityCategories(): Promise<RawCategory[]> {
  return query<RawCategory[]>(categoriesQuery);
}

export async function sanityPostSummaries(): Promise<SanitySummary[]> {
  const rows = await query<SanityPostSummary[]>(postSummariesQuery);
  return rows.map(normalizeSummary);
}

export async function sanityPost(slug: string): Promise<(SanitySummary & { body: Localized<BodyNode[]> }) | null> {
  const row = await query<SanityPost | null>(postBySlugQuery, { slug });
  if (!row) return null;
  return { ...normalizeSummary(row), body: row.body ?? {} };
}
