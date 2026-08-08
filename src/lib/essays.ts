export type Essay = {
  slug: string;
  title: string;
  description: string;
  type: string;
  readingTime: string;
  date: string;
  updated?: string;
  category: string;
  tags: string[];
};

export const essays: Essay[] = [
  {
    slug: "the-things-that-stay",
    title: "The Things That Stay",
    description:
      "A reflection on memory, place, and the quiet objects that remain with us through changing seasons.",
    type: "Essay",
    readingTime: "08 min read",
    date: "06 August 2026",
    updated: "06 August 2026",
    category: "Memory",
    tags: ["memory", "place", "objects", "life"],
  },
];

export function getEssayBySlug(slug: string) {
  return essays.find((essay) => essay.slug === slug);
}