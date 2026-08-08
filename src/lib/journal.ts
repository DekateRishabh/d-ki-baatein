export type JournalEntry = {
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
};

export const journalEntries: JournalEntry[] = [
  {
    slug: "rain-tea-and-a-long-walk",
    date: "06 August 2026",
    year: 2026,
    month: "August",
    title: "Rain, tea, and a long walk",
    excerpt:
      "The rain arrived before breakfast. The garden looked different for about twenty minutes.",
    mood: "Quiet",
    location: "Home",
    category: "Daily life",
    tags: ["rain", "garden", "attention"],
  },

  {
    slug: "reordering-old-photographs",
    date: "03 August 2026",
    year: 2026,
    month: "August",
    title: "Reordering old photographs",
    excerpt:
      "Some memories become clearer when placed beside one another.",
    mood: "Reflective",
    location: "Home",
    category: "Memory",
    tags: ["photography", "memory", "archive"],
  },

  {
    slug: "the-patience-of-unfinished-work",
    date: "29 July 2026",
    year: 2026,
    month: "July",
    title: "The patience of unfinished work",
    excerpt:
      "A note on patience, unfinished work, and beginning again.",
    mood: "Thoughtful",
    location: "Work desk",
    category: "Work",
    tags: ["work", "patience", "projects"],
  },

  {
    slug: "a-tree-does-not-hurry",
    date: "18 July 2026",
    year: 2026,
    month: "July",
    title: "A tree does not hurry",
    excerpt:
      "Growth is often invisible until one day it becomes impossible to miss.",
    mood: "Hopeful",
    location: "Farm",
    category: "Farm",
    tags: ["trees", "growth", "farm"],
  },
];

export function getJournalEntryBySlug(slug: string) {
  return journalEntries.find((entry) => entry.slug === slug);
}