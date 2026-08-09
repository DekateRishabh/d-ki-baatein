import { createClient } from "@/lib/supabase/server";

export type Essay = {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: string;
  readingTime: string;
  date: string;
  updated?: string;
  category: string;
  tags: string[];
  bodyMarkdown: string;
  coverUrl?: string;
  coverCaption?: string;
  coverAlt?: string;
};

type EssayRow = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string | null;
  body_markdown: string | null;
  reading_time_minutes: number | null;
  published_at: string | null;
  updated_at: string;
  cover_media: { public_url: string | null; caption: string | null; alt_text: string | null }[] | null;
};

function mapEssay(row: EssayRow): Essay {
  const date = row.published_at ?? row.updated_at;
  const formatDate = (value: string) => new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(value));
  const cover = row.cover_media?.[0];

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.excerpt ?? row.subtitle ?? "",
    type: "Essay",
    readingTime: `${row.reading_time_minutes ?? 1} min read`,
    date: formatDate(date),
    updated: formatDate(row.updated_at),
    category: "Essay",
    tags: [],
    bodyMarkdown: row.body_markdown ?? "",
    coverUrl: cover?.public_url ?? undefined,
    coverCaption: cover?.caption ?? undefined,
    coverAlt: cover?.alt_text ?? undefined,
  };
}

const essaySelect = "id, slug, title, subtitle, excerpt, body_markdown, reading_time_minutes, published_at, updated_at, cover_media:media_assets!essays_cover_media_id_fkey(public_url, caption, alt_text)";

export async function getPublishedEssays() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("essays").select(essaySelect).eq("status", "published").order("published_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as EssayRow[]).map(mapEssay);
}

export async function getPublishedEssayBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("essays").select(essaySelect).eq("slug", slug).eq("status", "published").maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapEssay(data as EssayRow) : null;
}

export async function getPublishedEssaySlugs() {
  return (await getPublishedEssays()).map(({ slug }) => ({ slug }));
}
