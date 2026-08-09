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

const legacyJournalEntries: JournalEntry[] = [
  { slug: "rain-tea-and-a-long-walk", date: "06 August 2026", year: 2026, month: "August", title: "Rain, tea, and a long walk", excerpt: "The rain arrived before breakfast. The garden looked different for about twenty minutes.", mood: "Quiet", location: "Home", category: "Daily life", tags: ["rain", "garden", "attention"] },
  { slug: "reordering-old-photographs", date: "03 August 2026", year: 2026, month: "August", title: "Reordering old photographs", excerpt: "Some memories become clearer when placed beside one another.", mood: "Reflective", location: "Home", category: "Memory", tags: ["photography", "memory", "archive"] },
  { slug: "the-patience-of-unfinished-work", date: "29 July 2026", year: 2026, month: "July", title: "The patience of unfinished work", excerpt: "A note on patience, unfinished work, and beginning again.", mood: "Thoughtful", location: "Work desk", category: "Work", tags: ["work", "patience", "projects"] },
  { slug: "a-tree-does-not-hurry", date: "18 July 2026", year: 2026, month: "July", title: "A tree does not hurry", excerpt: "Growth is often invisible until one day it becomes impossible to miss.", mood: "Hopeful", location: "Farm", category: "Farm", tags: ["trees", "growth", "farm"] },
];

export const journalEntries = legacyJournalEntries;

function mapJournalEntry(row: JournalRow): JournalEntry {
  const bodyMarkdown = row.body_markdown ?? "";
  const excerpt = bodyMarkdown.replace(/[#>*_`\[\]]/g, "").replace(/\s+/g, " ").trim().slice(0, 180);
  const dateValue = new Date(`${row.entry_date}T00:00:00`);
  const date = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "long", year: "numeric" }).format(dateValue);

  return {
    id: row.id,
    slug: row.slug,
    date,
    year: dateValue.getFullYear(),
    month: new Intl.DateTimeFormat("en-GB", { month: "long" }).format(dateValue),
    title: row.title ?? "Untitled journal entry",
    excerpt,
    category: "Journal",
    tags: [],
    bodyMarkdown,
  };
}

export async function getPublishedJournalEntries() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("journal_entries")
    .select("id, slug, title, body_markdown, entry_date, status, published_at")
    .eq("status", "published")
    .order("entry_date", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as JournalRow[]).map(mapJournalEntry);
}

export async function getPublishedJournalEntryBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("journal_entries")
    .select("id, slug, title, body_markdown, entry_date, status, published_at")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapJournalEntry(data as JournalRow) : null;
}

export function getJournalEntryBySlug(slug: string) {
  return journalEntries.find((entry) => entry.slug === slug);
}
