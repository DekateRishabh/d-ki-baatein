export type Photograph = {
  slug: string;
  title: string;
  description: string;
  src: string;
  alt: string;
  caption: string;
  location: string;
  date: string;
  collection: string;
  tags: string[];
};

export const photographs: Photograph[] = [
  {
    slug: "jaipur-after-rain",
    title: "After the rain",
    description:
      "The old city became quieter for a few minutes after the first rain.",
    src: "/images/travel/jaipur-monsoon.jpg",
    alt: "A quiet street in Jaipur after rain",
    caption: "The old city after the first rain.",
    location: "Jaipur, India",
    date: "August 2026",
    collection: "Travel",
    tags: ["rain", "city", "light"],
  },
  {
    slug: "warm-evening-street",
    title: "Warm evening street",
    description:
      "A familiar street held the last light of the day.",
    src: "/images/travel/jaipur-street.jpg",
    alt: "A warm evening street in Jaipur",
    caption: "Warm light along a familiar street.",
    location: "Jaipur, India",
    date: "August 2026",
    collection: "Travel",
    tags: ["street", "evening", "architecture"],
  },
  {
    slug: "tea-during-a-slow-afternoon",
    title: "Tea during a slow afternoon",
    description:
      "A pause between walking, conversation, and the next part of the day.",
    src: "/images/travel/jaipur-tea.jpg",
    alt: "Tea served during a slow afternoon",
    caption: "A pause for tea.",
    location: "Jaipur, India",
    date: "August 2026",
    collection: "Travel",
    tags: ["tea", "pause", "ordinary"],
  },
  {
    slug: "the-coast-without-noise",
    title: "The coast without noise",
    description:
      "The beach felt larger when there was no need to fill the afternoon.",
    src: "/images/travel/goa-offseason.jpg",
    alt: "An empty beach in Goa",
    caption: "The coast without the usual noise.",
    location: "Goa, India",
    date: "October 2025",
    collection: "Travel",
    tags: ["coast", "quiet", "sea"],
  },
  {
    slug: "a-long-afternoon-by-the-sea",
    title: "A long afternoon by the sea",
    description:
      "The waves continued while the rest of the day became unimportant.",
    src: "/images/travel/goa-coast.jpg",
    alt: "Waves along the Goan coast",
    caption: "A long afternoon by the sea.",
    location: "Goa, India",
    date: "October 2025",
    collection: "Travel",
    tags: ["waves", "afternoon", "coast"],
  },
  {
    slug: "kathmandu-before-the-crowds",
    title: "Before the crowds",
    description:
      "The city was awake, but had not yet become hurried.",
    src: "/images/travel/kathmandu-walks.jpg",
    alt: "An old lane in Kathmandu",
    caption: "The city before it became busy.",
    location: "Kathmandu, Nepal",
    date: "December 2024",
    collection: "Travel",
    tags: ["walking", "morning", "city"],
  },
];

export function getPhotographBySlug(slug: string) {
  return photographs.find(
    (photograph) => photograph.slug === slug
  );
}

export function getPhotographyCollections() {
  return Array.from(
    new Set(photographs.map((photograph) => photograph.collection))
  );
}

export type PhotographyCollection = {
  slug: string;
  title: string;
  description: string;
};

export const photographyCollections: PhotographyCollection[] = [
  {
    slug: "travel",
    title: "Travel",
    description:
      "Streets, coastlines, quiet rooms, and the light found while moving through unfamiliar places.",
  },
  {
    slug: "ordinary-life",
    title: "Ordinary life",
    description:
      "Small photographs of familiar objects, rooms, afternoons, and moments that would otherwise disappear.",
  },
  {
    slug: "landscape",
    title: "Landscape",
    description:
      "Trees, weather, open spaces, and the slower rhythms of the natural world.",
  },
];

export function getPhotographyCollection(slug: string) {
  return photographyCollections.find(
    (collection) => collection.slug === slug
  );
}