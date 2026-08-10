import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function saveJournalMedia(journalEntryId: string, formData: FormData) {
  "use server";

  const selectedIds = formData.getAll("media_ids").map(String);
  const supabase = await createClient();

  const { error: deleteError } = await supabase
    .from("journal_entry_media")
    .delete()
    .eq("journal_entry_id", journalEntryId);

  if (deleteError) throw new Error(deleteError.message);

  if (selectedIds.length) {
    const rows = selectedIds.map((mediaId, index) => ({
      journal_entry_id: journalEntryId,
      media_id: mediaId,
      sort_order: Number(formData.get(`sort_${mediaId}`) ?? index),
      caption: String(formData.get(`caption_${mediaId}`) ?? "").trim() || null,
    }));

    const { error: insertError } = await supabase
      .from("journal_entry_media")
      .insert(rows);

    if (insertError) throw new Error(insertError.message);
  }

  revalidatePath(`/admin/journal/${journalEntryId}/media`);
  revalidatePath(`/journal/${journalEntryId}`);
  redirect(`/admin/journal/${journalEntryId}/media`);
}

export default async function JournalMediaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: entry, error: entryError }, { data: media, error: mediaError }, { data: attached, error: attachedError }] =
    await Promise.all([
      supabase.from("journal_entries").select("id, title, slug").eq("id", id).single(),
      supabase
        .from("media_assets")
        .select("id, filename, public_url, alt_text, caption, created_at")
        .eq("kind", "image")
        .order("created_at", { ascending: false }),
      supabase
        .from("journal_entry_media")
        .select("media_id, sort_order, caption")
        .eq("journal_entry_id", id)
        .order("sort_order", { ascending: true }),
    ]);

  if (entryError || !entry || mediaError || attachedError) notFound();

  const attachedById = new Map(
    (attached ?? []).map((item) => [item.media_id, item]),
  );
  const saveMedia = saveJournalMedia.bind(null, id);

  return (
    <section className="admin-content">
      <header className="archive-intro">
        <p className="section-label">Journal media</p>
        <h1>{entry.title ?? entry.slug}</h1>
        <p>Select the small photographs that belong to this Journal entry.</p>
        <Link href={`/admin/journal/${id}/edit`}>Back to Journal editor</Link>
      </header>

      <form action={saveMedia} className="journal-media-picker">
        <div className="journal-media-picker-grid">
          {(media ?? []).map((item) => {
            const current = attachedById.get(item.id);
            return (
              <label className="journal-media-picker-card" key={item.id}>
                <input
                  type="checkbox"
                  name="media_ids"
                  value={item.id}
                  defaultChecked={Boolean(current)}
                />
                <div className="journal-media-picker-preview">
                  {item.public_url ? (
                    <img src={item.public_url} alt={item.alt_text ?? item.filename} />
                  ) : (
                    <span>No preview</span>
                  )}
                </div>
                <strong>{item.alt_text ?? item.filename}</strong>
                <small>{item.filename}</small>
                <input
                  name={`sort_${item.id}`}
                  type="number"
                  min="0"
                  defaultValue={current?.sort_order ?? 0}
                  aria-label={`Order for ${item.filename}`}
                />
                <textarea
                  name={`caption_${item.id}`}
                  defaultValue={current?.caption ?? ""}
                  rows={2}
                  placeholder="Caption for this Journal image"
                  aria-label={`Caption for ${item.filename}`}
                />
              </label>
            );
          })}
        </div>

        <div className="admin-form-actions">
          <button type="submit">Save Journal photos</button>
          <Link href={`/admin/journal/${id}/edit`}>Cancel</Link>
        </div>
      </form>
    </section>
  );
}
