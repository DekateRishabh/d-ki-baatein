import { createClient } from "@/lib/supabase/server";
import {
  getPhotographyCollections,
  photographs as staticPhotographs,
  photographyCollections as staticCollections,
} from "@/lib/photography";

type StaticPhotograph = (typeof staticPhotographs)[number];
export type PublicPhotographyCollection = {
  slug: string;
  title: string;
  description: string;
};

export type PublicPhotographyContent = {
  photographs: StaticPhotograph[];
  collections: PublicPhotographyCollection[];
};

type SupabaseMedia = {
  id: string;
  public_url: string | null;
  filename: string;
  alt_text: string | null;
  caption: string | null;
  location: string | null;
  taken_at: string | null;
};

type SupabaseItem = {
  sort_order: number;
  caption: string | null;
  media: SupabaseMedia | SupabaseMedia[] | null;
};

type SupabaseCollection = {
  slug: string;
  title: string;
  description: string | null;
  location: string | null;
  collection_date: string | null;
  photo_collection_items: SupabaseItem[] | null;
};

function first<T>(value: T | T[] | null): T | null {
  return Array.isArray(value) ? value[0] ?? null : value;
}

function fallback(): PublicPhotographyContent {
  return {
    photographs: staticPhotographs,
    collections: staticCollections,
  };
}

export async function getPublicPhotographyContent(): Promise<PublicPhotographyContent> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("photo_collections")
      .select("slug,title,description,location,collection_date,photo_collection_items(sort_order,caption,media:media_assets(id,public_url,filename,alt_text,caption,location,taken_at))")
      .eq("status", "published")
      .order("collection_date", { ascending: false });

    if (error || !data?.length) return fallback();

    const collections = data as SupabaseCollection[];
    const photographs = collections.flatMap((collection) =>
      (collection.photo_collection_items ?? [])
        .slice()
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((item) => {
          const media = first(item.media);
          if (!media?.public_url) return null;
          const slug = `${collection.slug}-${media.id}`;
          const title = media.filename.replace(/\.[^.]+$/, "");
          const location = media.location ?? collection.location ?? "Photography archive";
          const caption = item.caption ?? media.caption ?? title;
          return { slug, title, description: caption, src: media.public_url, alt: media.alt_text ?? caption, caption, collection: collection.title, location, date: media.taken_at ?? collection.collection_date ?? "", tags: [collection.slug, location.toLowerCase()] } satisfies StaticPhotograph;
        })
        .filter((photograph): photograph is StaticPhotograph => photograph !== null),
    );

    if (!photographs.length) return fallback();
    return {
      photographs,
      collections: collections.map((collection) => ({
        slug: collection.slug,
        title: collection.title,
        description: collection.description ?? "",
      })),
    };
  } catch {
    return fallback();
  }
}

export { getPhotographyCollections };
