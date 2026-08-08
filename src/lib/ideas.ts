export type IdeaStatus =
  | "seed"
  | "exploring"
  | "paused"
  | "built";

export type Idea = {
  slug: string;
  title: string;
  description: string;
  category: string;
  status: IdeaStatus;
  createdDate: string;
  tags: string[];
  notes: string[];
};

export const ideas: Idea[] = [
  {
    slug: "a-slower-kind-of-digital-garden",
    title: "A slower kind of digital garden",
    description:
      "A personal space for collecting ideas without turning every thought into content.",
    category: "Product idea",
    status: "exploring",
    createdDate: "August 2026",
    tags: ["digital garden", "writing", "attention"],
    notes: [
  "The internet is good at helping us publish, but not always at helping us remember.",
  "A personal archive should make it easier to return to an idea without forcing it to become finished.",
],
  },

  {
    slug: "a-library-for-ordinary-memories",
    title: "A library for ordinary memories",
    description:
      "A way to preserve small daily moments before they disappear into the speed of life.",
    category: "Personal system",
    status: "seed",
    createdDate: "July 2026",
    tags: ["memory", "archive", "journal"],
    notes: [
  "Daily moments are fleeting, but they can be preserved for reflection.",
  "A library of ordinary memories can provide a sense of continuity and identity.",
],
  },

  {
    slug: "tools-for-thinking-slowly",
    title: "Tools for thinking slowly",
    description:
      "A collection of digital tools designed around reflection rather than constant activity.",
    category: "Technology",
    status: "paused",
    createdDate: "June 2026",
    tags: ["technology", "tools", "slow thinking"],
    notes: [
  "Slow thinking tools can help us avoid the noise of constant digital stimulation.",
  "Reflection is a valuable skill that can be cultivated with the right tools.",
],
  },

  {
    slug: "a-better-way-to-read-books",
    title: "A better way to read books",
    description:
      "An experiment in connecting books, notes, quotations, and the ideas they create.",
    category: "Reading",
    status: "built",
    createdDate: "May 2026",
    tags: ["books", "reading", "knowledge"],
    notes: [
  "Reading is a deeply personal experience that can be enhanced with thoughtful annotation.",
  "Connecting ideas across different texts can lead to new insights and understanding.",
],
  },
];

export function getIdeaBySlug(slug: string) {
  return ideas.find((idea) => idea.slug === slug);
}