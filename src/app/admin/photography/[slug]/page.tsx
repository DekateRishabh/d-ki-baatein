import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import CollectionEditor from "./collection-editor";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };
type Media = { id: string; filename: string; public_url: string | null; alt_text: string | null; caption: string | null };
type Item = { media_id: string; sort_order: number; caption: string | null; media_assets: Media | Media[] | null };

async function requireAdmin() { const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect("/admin/login"); return supabase; }

async function saveEditor(formData: FormData) {
  "use server";
  const supabase = await requireAdmin();
  const payload = JSON.parse(String(formData.get("payload") ?? "{}"));
  const id = String(payload.id ?? "");
  const title = String(payload.title ?? "").trim();
  if (!id || !title) throw new Error("Collection id and title are required.");
  const status = String(payload.status ?? "draft");
  const { error: updateError } = await supabase.from("photo_collections").update({ title, slug: String(payload.slug ?? "").trim(), description: String(payload.description ?? "").trim() || null, location: String(payload.location ?? "").trim() || null, collection_date: String(payload.collection_date ?? "") || null, status, cover_media_id: payload.cover_media_id || null, published_at: status === "published" ? new Date().toISOString() : null }).eq("id", id);
  if (updateError) throw new Error(updateError.message);
  const { error: deleteError } = await supabase.from("photo_collection_items").delete().eq("collection_id", id);
  if (deleteError) throw new Error(deleteError.message);
  const mediaIds = Array.isArray(payload.media_ids) ? payload.media_ids.map(String) : [];
  if (mediaIds.length) { const rows = mediaIds.map((mediaId: string, index: number) => ({ collection_id: id, media_id: mediaId, sort_order: index, caption: String(payload.captions?.[mediaId] ?? "").trim() || null })); const { error } = await supabase.from("photo_collection_items").insert(rows); if (error) throw new Error(error.message); }
  revalidatePath("/admin/photography"); revalidatePath(`/admin/photography/${String(payload.slug)}`); revalidatePath(`/photography/collections/${String(payload.slug)}`); revalidatePath("/photography");
  redirect(`/admin/photography/${String(payload.slug)}?saved=1`);
}

export default async function PhotographyCollectionEditorPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await requireAdmin();
  const [{ data: collection }, { data: media }] = await Promise.all([
    supabase.from("photo_collections").select("id, slug, title, description, location, collection_date, status, cover_media_id, photo_collection_items(media_id, sort_order, caption, media_assets(id, filename, public_url, alt_text, caption))").eq("slug", slug).maybeSingle(),
    supabase.from("media_assets").select("id, filename, public_url, alt_text, caption").eq("kind", "image").order("created_at", { ascending: false }),
  ]);
  if (!collection) notFound();
  const items = (collection.photo_collection_items ?? []) as Item[];
  const allMedia = (media ?? []) as Media[];
  const selected = items.slice().sort((a, b) => a.sort_order - b.sort_order).map((item) => { const asset = Array.isArray(item.media_assets) ? item.media_assets[0] : item.media_assets; return { media_id: item.media_id, caption: item.caption ?? "", asset: asset ?? allMedia.find((candidate) => candidate.id === item.media_id) ?? null }; }).filter((item) => item.asset);
  return <CollectionEditor collection={{ id: collection.id, slug: collection.slug, title: collection.title, description: collection.description ?? "", location: collection.location ?? "", collection_date: collection.collection_date ?? "", status: collection.status, cover_media_id: collection.cover_media_id }} selected={selected} media={allMedia} saveAction={saveEditor} />;
}

export const metadata: Metadata = { title: "Edit Photography collection" };
