import { createClient } from "@/lib/supabase/server";

export type JournalEntry = {
  id?: string;
  slug: string;
  date: string;
  year: number;
  month: string;
  title: string;
  excerpt: string;
  mood?: string;
  location?: string;
  category: string;
  tags: string[];
  bodyMarkdown?: string;
};

type JournalRow = {
  id: string;
  slug: string;
  title: string | null;
  body_markdown: string | null;
  entry_date: string;
  status: string;
  published_at: string | null;
};

function mapJournalEntry(row: JournalRow): JournalEntry {
  const bodyMarkdown = row.body_markdown ?? "";
  const excerpt = bodyMarkdown.replace(/[#>*_`\[\]]/g, "").replace(/\s+/g, " ").trim().slice(0, 180);
  const dateValue = new Date(`${row.entry_date}T00:00:00`);
  const date = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "long", year: "numeric" }).format(dateValue);
  return { id: row.id, slug: row.slug, date, year: dateValue.getFullYear(), month: new Intl.DateTimeFormat("en-GB", { month: "long" }).format(dateValue), title: row.title ?? "Untitled journal entry", excerpt, category: "Journal", tags: [], bodyMarkdown };
}

export async function getPublishedJournalEntries() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("journal_entries").select("id, slug, title, body_markdown, entry_date, status, published_at").eq("status", "published").order("entry_date", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as JournalRow[]).map(mapJournalEntry);
}

export async function getPublishedJournalEntryBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("journal_entries").select("id, slug, title, body_markdown, entry_date, status, published_at").eq("slug", slug).eq("status", "published").maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapJournalEntry(data as JournalRow) : null;
}
