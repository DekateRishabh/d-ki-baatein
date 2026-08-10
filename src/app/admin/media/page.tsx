import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import MediaGallery from "@/components/admin/media-gallery";

export default async function AdminMediaPage() {
  const supabase = await createClient();
  const { data: media, error } = await supabase
    .from("media_assets")
    .select(
      "id, filename, kind, mime_type, size_bytes, public_url, storage_path, caption, alt_text, is_public, created_at",
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (
    <section className="admin-content">
      <header className="archive-intro">
        <p className="section-label">Private archive</p>
        <h1>Media library</h1>
        <p>Upload and manage images, documents, audio, and video for the site.</p>
        <Link href="/admin/media/upload">Upload media</Link>
      </header>
      <MediaGallery media={(media ?? []) as Parameters<typeof MediaGallery>[0]["media"]} />
    </section>
  );
}
