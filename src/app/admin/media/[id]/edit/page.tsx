import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function updateMedia(id: string, formData: FormData) {
  "use server";

  const filename = String(formData.get("filename") ?? "").trim();
  const kind = String(formData.get("kind") ?? "image").trim();
  const caption = String(formData.get("caption") ?? "").trim();
  const altText = String(formData.get("alt_text") ?? "").trim();
  const isPublic = formData.get("is_public") === "on";

  if (!filename) throw new Error("Filename is required.");

  const supabase = await createClient();
  const { error } = await supabase
    .from("media_assets")
    .update({
      filename,
      kind,
      caption: caption || null,
      alt_text: altText || null,
      is_public: isPublic,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/media");
  revalidatePath(`/admin/media/${id}/edit`);
  redirect("/admin/media");
}

export default async function EditMediaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: media, error } = await supabase
    .from("media_assets")
    .select(
      "id, filename, kind, mime_type, public_url, caption, alt_text, is_public",
    )
    .eq("id", id)
    .single();

  if (error || !media) notFound();

  const saveMedia = updateMedia.bind(null, media.id);

  return (
    <section className="admin-content">
      <header className="archive-intro">
        <p className="section-label">Media library</p>
        <h1>Edit media</h1>
        <p>Update the metadata used across your private archive and public site.</p>
      </header>

      <form action={saveMedia} className="admin-form">
        {media.public_url ? (
          <div className="media-edit-preview">
            <img src={media.public_url} alt={media.alt_text ?? media.filename} />
          </div>
        ) : null}

        <label>
          Filename
          <input name="filename" defaultValue={media.filename} required />
        </label>

        <label>
          Media type
          <select name="kind" defaultValue={media.kind}>
            <option value="image">Image</option>
            <option value="document">Document</option>
            <option value="audio">Audio</option>
            <option value="video">Video</option>
          </select>
        </label>

        <label>
          Caption
          <textarea name="caption" defaultValue={media.caption ?? ""} rows={4} />
        </label>

        <label>
          Alt text
          <input name="alt_text" defaultValue={media.alt_text ?? ""} />
        </label>

        <label className="admin-form-checkbox">
          <input
            type="checkbox"
            name="is_public"
            defaultChecked={media.is_public}
          />
          Publicly visible
        </label>

        <div className="admin-form-actions">
          <button type="submit">Save changes</button>
          <Link href="/admin/media">Cancel</Link>
        </div>
      </form>
    </section>
  );
}
