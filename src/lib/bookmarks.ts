export type BookmarkType =
  | "Article"
  | "Tool"
  | "Film"
  | "Design"
  | "Website"
  | "Book";

export type Bookmark = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: BookmarkType;
  url: string;
  source: string;
  domain: string;
  savedDate: string;
  tags: string[];
  notes: string;
};

export const bookmarks: Bookmark[] = [
  {
    id: "bookmark-001",
    slug: "the-art-of-noticing",
    title: "The art of noticing",
    description:
      "A thoughtful essay about attention, walking, and seeing familiar places differently.",
    category: "Article",
    url: "https://example.com",
    source: "Example Website",
    domain: "example.com",
    savedDate: "August 2026",
    tags: ["attention", "walking", "life"],
    notes:
      "Saved because it describes attention as something practiced through ordinary movement.",
  },

  {
    id: "bookmark-002",
    slug: "a-beautiful-tool-for-thinking",
    title: "A beautiful tool for thinking",
    description:
      "A simple tool for organising notes, references, and unfinished ideas.",
    category: "Tool",
    url: "https://example.com",
    source: "Example Tool",
    domain: "example.com",
    savedDate: "July 2026",
    tags: ["notes", "thinking", "tools"],
    notes:
      "A useful reference for thinking about how digital tools can remain calm and focused.",
  },

  {
    id: "bookmark-003",
    slug: "a-film-about-slow-living",
    title: "A film about slow living",
    description:
      "A quiet film about landscape, work, and the value of moving at a human pace.",
    category: "Film",
    url: "https://example.com",
    source: "Example Video",
    domain: "example.com",
    savedDate: "July 2026",
    tags: ["film", "slowness", "landscape"],
    notes:
      "The pacing and use of landscape stayed with me after watching it.",
  },

  {
    id: "bookmark-004",
    slug: "building-better-interfaces",
    title: "A reference for building better interfaces",
    description:
      "A collection of useful principles for designing calm and readable digital products.",
    category: "Design",
    url: "https://example.com",
    source: "Example Reference",
    domain: "example.com",
    savedDate: "June 2026",
    tags: ["design", "interfaces", "principles"],
    notes:
      "Useful when reviewing spacing, hierarchy, and the relationship between content and interface.",
  },
];

export function getBookmarkBySlug(slug: string) {
  return bookmarks.find((bookmark) => bookmark.slug === slug);
}