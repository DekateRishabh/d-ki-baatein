export type FarmUpdateType =
  | "Season"
  | "Planting"
  | "Trees"
  | "Landscape"
  | "Construction"
  | "Lighting";

export type FarmUpdate = {
  slug: string;
  title: string;
  date: string;
  year: number;
  season: string;
  type: FarmUpdateType;
  excerpt: string;
  status: "Growing" | "In progress" | "Completed" | "Observing";
  tags: string[];
  photos?: FarmPhoto[];
  beforeImage?: FarmPhoto;
  afterImage?: FarmPhoto;
  timeline?: FarmTimelineEvent[];
};

export type FarmPhoto = {
  src: string;
  alt: string;
  caption: string;
};

export type FarmTimelineEvent = {
  date: string;
  title: string;
  description: string;
};

export const farmUpdates: FarmUpdate[] = [
  {
    slug: "a-tree-does-not-hurry",
    title: "A tree does not hurry",
    date: "18 July 2026",
    year: 2026,
    season: "Monsoon",
    type: "Trees",
    excerpt:
      "Growth is often invisible until one day it becomes impossible to miss.",
    status: "Observing",
    tags: ["trees", "growth", "patience"],
    photos: [
  {
    src: "/images/farm/tree-before.jpg",
    alt: "A young tree at the Farm",
    caption: "The tree before the monsoon growth.",
  },
  {
    src: "/images/farm/tree-monsoon.jpg",
    alt: "The same tree during the monsoon",
    caption: "New growth after the first sustained rain.",
  },
],

beforeImage: {
  src: "/images/farm/tree-before.jpg",
  alt: "The tree before seasonal growth",
  caption: "Before",
},

afterImage: {
  src: "/images/farm/tree-monsoon.jpg",
  alt: "The tree after seasonal growth",
  caption: "After",
},

timeline: [
  {
    date: "January 2026",
    title: "The first planting",
    description:
      "The tree was planted near the southern edge of the garden.",
  },
  {
    date: "April 2026",
    title: "The first leaves",
    description:
      "The first visible growth appeared after several quiet weeks.",
  },
  {
    date: "July 2026",
    title: "The monsoon growth",
    description:
      "The tree began to change more quickly after the rain arrived.",
  },
],
  },
  {
    slug: "the-first-monsoon-garden",
    title: "The first monsoon garden",
    date: "12 July 2026",
    year: 2026,
    season: "Monsoon",
    type: "Season",
    excerpt:
      "The garden changed colour after the first sustained rain.",
    status: "Growing",
    tags: ["rain", "garden", "monsoon"],
  },
  {
    slug: "making-room-for-light",
    title: "Making room for light",
    date: "28 June 2026",
    year: 2026,
    season: "Summer",
    type: "Landscape",
    excerpt:
      "A small change to the landscape opened a longer view toward the trees.",
    status: "In progress",
    tags: ["landscape", "light", "space"],
  },
  {
    slug: "the-first-working-corner",
    title: "The first working corner",
    date: "16 June 2026",
    year: 2026,
    season: "Summer",
    type: "Construction",
    excerpt:
      "A simple corner began to take shape: useful, quiet, and close to the garden.",
    status: "Completed",
    tags: ["construction", "work", "place"],
  },
];

export function getFarmUpdateBySlug(slug: string) {
  return farmUpdates.find((update) => update.slug === slug);
}