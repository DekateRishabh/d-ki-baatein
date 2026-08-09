import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminJournalPage() {
  const supabase = await createClient();
  const { data: entries, error } = await supabase.from("journal_entries").select("id, slug, title, entry_date, status, updated_at").order("entry_date", { ascending: false });
  if (error) throw new Error(error.message);
  return <section className="admin-content"><header className="archive-intro"><p className="section-label">Private archive</p><h1>Journal</h1><p>Draft, edit, publish, and archive notes from ordinary days.</p><Link href="/admin/journal/new">New journal entry</Link></header><div className="admin-list">{entries?.map((entry) => <article className="admin-list-item" key={entry.id}><div><p className="section-label">{entry.status} · {entry.entry_date}</p><h2>{entry.title}</h2><p>/{entry.slug}</p></div><Link href={`/admin/journal/${entry.id}/edit`}>Edit</Link></article>)}</div></section>;
}
