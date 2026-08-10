import { createClient } from "@/lib/supabase/server";
import {
  photographs as staticPhotographs,
  photographyCollections as staticCollections,
} from "@/lib/photography";

export type PublicPhotograph = {
  slug: string;
  title: string;
  description: string;
  src: string;
  alt: string;
  collection: string;
  location: string;
  date: string;
  caption: string;
  tags: string[];
};

export type PublicPhotographyCollection = {
  slug: string;
  title: string;
  description: string;
};

function normalizePublicUrl(value: string) {
  const trimmed = value.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed.replace(/^\/+(?=https?:\/\/)/i, "");
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function getPublicPhotographyData() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("photo_collections")
    .select(
      "slug, title, description, location, collection_date, photo_collection_items(sort_order, caption, media_assets(filename, public_url, alt_text, caption, location, taken_at, metadata))",
    )
    .eq("status", "published")
    .order("collection_date", { ascending: false });

  if (error) throw new Error(error.message);
  if (!data?.length) {
    return {
      collections: staticCollections as PublicPhotographyCollection[],
      photographs: staticPhotographs as PublicPhotograph[],
    };
  }

  const collections: PublicPhotographyCollection[] = data.map((collection) => ({
    slug: collection.slug,
    title: collection.title,
    description: collection.description ?? "",
  }));

  const photographs: PublicPhotograph[] = data.flatMap((collection) =>
    (collection.photo_collection_items ?? [])
      .slice()
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .flatMap((item) => {
        const media = Array.isArray(item.media_assets)
          ? item.media_assets[0]
          : item.media_assets;
        if (!media?.public_url) return [];

        const title = media.alt_text ?? media.filename;
        const slug = `${collection.slug}-${slugify(media.filename)}`;
        const date = media.taken_at ?? collection.collection_date;
        return [
          {
            slug,
            title,
            description: item.caption ?? media.caption ?? "",
            src: normalizePublicUrl(media.public_url),
            alt: media.alt_text ?? media.filename,
            collection: collection.title,
            location: media.location ?? collection.location ?? "",
            date: date ? new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(date)) : "",
            caption: item.caption ?? media.caption ?? title,
            tags: [collection.slug],
          },
        ];
      }),
  );

  return { collections, photographs };
}

export async function getPublicPhotographBySlug(slug: string) {
  const { photographs } = await getPublicPhotographyData();
  return photographs.find((photograph) => photograph.slug === slug);
}
