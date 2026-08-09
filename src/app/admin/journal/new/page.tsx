import Link from "next/link";
import { createJournalEntry } from "@/lib/admin/journal-actions";

export default function NewJournalPage() {
  return <section className="admin-content"><header className="archive-intro"><p className="section-label">Journal</p><h1>New entry</h1><p>Start a private draft. You can publish it when it is ready.</p></header><form action={createJournalEntry} className="admin-form"><label>Title<input name="title" required /></label><label>Slug<input name="slug" placeholder="optional-slug" /></label><label>Date<input name="entry_date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required /></label><label>Body<textarea name="body_markdown" rows={16} /></label><div><button type="submit">Save draft</button><Link href="/admin/journal">Cancel</Link></div></form></section>;
}
