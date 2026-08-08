export type NowSection = {
  title: string;
  content: string;
  link?: {
    label: string;
    href: string;
  };
};

export const nowUpdated = "August 2026";

export const nowSections: NowSection[] = [
  {
    title: "Reading",
    content:
      "The Book of Disquiet by Fernando Pessoa. Reading slowly, a few pages at a time.",
    link: {
      label: "View the library",
      href: "/library/the-book-of-disquiet",
    },
  },

  {
    title: "Building",
    content:
      "D Ki Baatein — a quiet personal archive for essays, books, photographs, ideas, and memories.",
    link: {
      label: "Read the latest essay",
      href: "/essays/the-things-that-stay",
    },
  },

  {
    title: "Learning",
    content:
      "Better ways to structure long-lived digital products without making them feel complicated.",
  },

  {
    title: "Watching",
    content:
      "A slow documentary about rural life, landscape, and the relationship between work and place.",
  },

  {
    title: "Listening to",
    content:
      "Music that leaves enough room for thought while working in the evening.",
  },

  {
    title: "Thinking about",
    content:
      "How to preserve ordinary moments without turning every moment into content.",
  },
];