import Image from "next/image";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Media = {
  id: string;
  filename: string;
  public_url: string | null;
  alt_text: string | null;
  caption: string | null;
};

type Item = {
  media_id: string;
  sort_order: number;
  caption: string | null;
  media_assets: Media | Media[] | null;
};

type Collection = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  location: string | null;
  collection_date: string | null;
  status: string;
  photo_collection_items: Item[];
};

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in to manage Photography.");
  return supabase;
}

async function createCollection(formData: FormData) {
  "use server";
  const supabase = await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) throw new Error("A collection title is required.");
  const { error } = await supabase.from("photo_collections").insert({
    title,
    slug: String(formData.get("slug") ?? "").trim() || slugify(title),
    description: String(formData.get("description") ?? "").trim() || null,
    location: String(formData.get("location") ?? "").trim() || null,
    collection_date: String(formData.get("collection_date") ?? "") || null,
    status: String(formData.get("status") ?? "draft"),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/photography");
  revalidatePath("/photography");
}

async function saveCollection(formData: FormData) {
  "use server";
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  if (!id || !title) throw new Error("Collection id and title are required.");
  const status = String(formData.get("status") ?? "draft");
  const { error: updateError } = await supabase.from("photo_collections").update({
    title,
    slug: String(formData.get("slug") ?? "").trim() || slugify(title),
    description: String(formData.get("description") ?? "").trim() || null,
    location: String(formData.get("location") ?? "").trim() || null,
    collection_date: String(formData.get("collection_date") ?? "") || null,
    status,
    published_at: status === "published" ? new Date().toISOString() : null,
  }).eq("id", id);
  if (updateError) throw new Error(updateError.message);
  const mediaIds = formData.getAll("media_id").map(String);
  const { error: deleteError } = await supabase.from("photo_collection_items").delete().eq("collection_id", id);
  if (deleteError) throw new Error(deleteError.message);
  if (mediaIds.length) {
    const rows = mediaIds.map((mediaId, index) => ({
      collection_id: id,
      media_id: mediaId,
      sort_order: Number(formData.get(`sort_order_${mediaId}`) ?? index),
      caption: String(formData.get(`caption_${mediaId}`) ?? "").trim() || null,
    }));
    const { error: insertError } = await supabase.from("photo_collection_items").insert(rows);
    if (insertError) throw new Error(insertError.message);
  }
  revalidatePath("/admin/photography");
  revalidatePath("/photography");
}

async function archiveCollection(formData: FormData) {
  "use server";
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "archived") === "archived" ? "draft" : "archived";
  const { error } = await supabase.from("photo_collections").update({ status, published_at: null }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/photography");
  revalidatePath("/photography");
}

export default async function PhotographyAdminPage() {
  const supabase = await requireAdmin();
  const [{ data: collections }, { data: media }] = await Promise.all([
    supabase.from("photo_collections").select("id, slug, title, description, location, collection_date, status, photo_collection_items(media_id, sort_order, caption, media_assets(id, filename, public_url, alt_text, caption))").order("created_at", { ascending: false }),
    supabase.from("media_assets").select("id, filename, public_url, alt_text, caption").eq("kind", "image").order("created_at", { ascending: false }),
  ]);
  const typedCollections = (collections ?? []) as Collection[];
  const typedMedia = (media ?? []) as Media[];

  return (
    <main className="admin-page">
      <nav className="admin-page-nav" aria-label="Admin navigation">
        <Link href="/admin">Dashboard</Link>
        <Link href="/admin/photography" aria-current="page">Photography</Link>
        <Link href="/admin/media">Media library</Link>
        <Link href="/admin/media/upload">Upload media</Link>
      </nav>
      <header className="admin-page-header">
        <div>
          <p className="section-label">Admin / Photography</p>
          <h1>Photography collections</h1>
          <p>Build and publish the collections shown on the public Photography archive.</p>
        </div>
        <div className="admin-header-actions">
          <Link href="/photography" className="admin-button">View public archive</Link>
          <Link href="/admin/media/upload" className="admin-button">Upload photographs</Link>
        </div>
      </header>

      <section className="admin-form-card">
        <div className="admin-section-heading"><h2>New collection</h2><span>Draft by default</span></div>
        <form action={createCollection} className="admin-form-grid">
          <label>Title<input name="title" required placeholder="Monsoon light" /></label>
          <label>Slug<input name="slug" placeholder="monsoon-light" /></label>
          <label>Location<input name="location" placeholder="Jaipur" /></label>
          <label>Date<input name="collection_date" type="date" /></label>
          <label>Status<select name="status" defaultValue="draft"><option value="draft">Draft</option><option value="published">Published</option><option value="private">Private</option><option value="archived">Archived</option></select></label>
          <label className="admin-form-wide">Description<textarea name="description" rows={3} placeholder="A short description of this collection." /></label>
          <div className="admin-form-actions"><button type="submit" className="admin-button">Create collection</button></div>
        </form>
      </section>

      <section className="admin-stack">
        {typedCollections.length === 0 ? <div className="admin-empty"><h2>No collections yet.</h2><p>Create your first collection above, then attach images from the media library.</p></div> : typedCollections.map((collection) => {
          const attached = new Map(collection.photo_collection_items.map((item) => [item.media_id, item]));
          const isArchived = collection.status === "archived";
          return (
            <form key={collection.id} action={saveCollection} className="admin-form-card">
              <input type="hidden" name="id" value={collection.id} />
              <div className="admin-section-heading"><h2>{collection.title}</h2><span>{collection.status}</span></div>
              <div className="admin-collection-actions">
                <Link href={`/photography?collection=${collection.slug}`} className="admin-text-link">Preview collection →</Link>
                <button formAction={archiveCollection} name="status" value={collection.status} className="admin-text-button">{isArchived ? "Restore collection" : "Archive collection"}</button>
              </div>
              <div className="admin-form-grid">
                <label>Title<input name="title" defaultValue={collection.title} required /></label>
                <label>Slug<input name="slug" defaultValue={collection.slug} required /></label>
                <label>Location<input name="location" defaultValue={collection.location ?? ""} /></label>
                <label>Date<input name="collection_date" type="date" defaultValue={collection.collection_date ?? ""} /></label>
                <label>Status<select name="status" defaultValue={collection.status}><option value="draft">Draft</option><option value="published">Published</option><option value="private">Private</option><option value="archived">Archived</option></select></label>
                <label className="admin-form-wide">Description<textarea name="description" rows={3} defaultValue={collection.description ?? ""} /></label>
              </div>
              <div className="admin-media-picker"><div className="admin-section-heading"><h3>Photographs</h3><span>Select, order, caption</span></div>{typedMedia.map((asset) => { const item = attached.get(asset.id); return <label key={asset.id} className="admin-media-option">{asset.public_url ? <Image src={asset.public_url} alt={asset.alt_text ?? asset.filename} width={72} height={54} className="admin-media-thumbnail" /> : <span className="admin-media-thumbnail-placeholder">No preview</span>}<input type="checkbox" name="media_id" value={asset.id} defaultChecked={Boolean(item)} /><span>{asset.filename}</span><input name={`sort_order_${asset.id}`} type="number" defaultValue={item?.sort_order ?? 0} aria-label={`Order for ${asset.filename}`} /><input name={`caption_${asset.id}`} defaultValue={item?.caption ?? asset.caption ?? ""} placeholder="Caption" aria-label={`Caption for ${asset.filename}`} /></label>; })}</div>
              <div className="admin-form-actions"><button type="submit" className="admin-button">Save collection</button></div>
            </form>
          );
        })}
      </section>
    </main>
  );
}
