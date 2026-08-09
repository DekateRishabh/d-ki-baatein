import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateJournalEntry } from "@/lib/admin/journal-actions";

type Props = { params: Promise<{ id: string }> };

export default async function EditJournalPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: entry, error } = await supabase.from("journal_entries").select("id, slug, title, body_markdown, entry_date, status").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  if (!entry) notFound();
  const update = updateJournalEntry.bind(null, id);
  return <section className="admin-content"><header className="archive-intro"><p className="section-label">Journal · {entry.status}</p><h1>Edit entry</h1><p>Update this entry, save a draft, or change its publication state.</p></header><form action={update} className="admin-form"><label>Title<input name="title" defaultValue={entry.title ?? ""} required /></label><label>Slug<input name="slug" defaultValue={entry.slug} required /></label><label>Date<input name="entry_date" type="date" defaultValue={entry.entry_date} required /></label><label>Body<textarea name="body_markdown" rows={18} defaultValue={entry.body_markdown ?? ""} /></label><input type="hidden" name="status" value={entry.status} /><div><button name="intent" value="save" type="submit">Save</button><button name="intent" value="publish" type="submit">Publish</button><button name="intent" value="unpublish" type="submit">Unpublish</button><button name="intent" value="archive" type="submit">Archive</button><Link href="/admin/journal">Back</Link></div></form></section>;
}
