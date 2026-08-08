export type BookStatus =
  | "finished"
  | "reading"
  | "wishlist";

export type Book = {
  slug: string;
  title: string;
  author: string;
  status: BookStatus;
  rating?: number;
  finishedDate?: string;
  category: string;
  description: string;
  cover?: string;
  coverColor: string;
  relatedEssays?: {
    title: string;
    href: string;
  }[];
};

export const books: Book[] = [
  {
    slug: "the-book-of-disquiet",
    title: "The Book of Disquiet",
    author: "Fernando Pessoa",
    status: "reading",
    rating: 5,
    category: "Literature",
    description:
      "A quiet, fragmented book about solitude, observation, and the inner life of ordinary days.",
    cover: "/images/books/the-book-of-disquiet.jpg",
    coverColor: "#8a6240",
    relatedEssays: [
      {
        title: "The Things That Stay",
        href: "/essays/the-things-that-stay",
      },
    ],
  },

  {
    slug: "braiding-sweetgrass",
    title: "Braiding Sweetgrass",
    author: "Robin Wall Kimmerer",
    status: "finished",
    rating: 4,
    finishedDate: "March 2026",
    category: "Nature",
    description:
      "A thoughtful meditation on plants, reciprocity, attention, and the relationship between people and the natural world.",
    cover: "/images/books/braiding-sweetgrass.jpg",
    coverColor: "#4f6b58",
    relatedEssays: [],
  },

  {
    slug: "a-field-guide-to-getting-lost",
    title: "A Field Guide to Getting Lost",
    author: "Rebecca Solnit",
    status: "finished",
    rating: 5,
    finishedDate: "November 2025",
    category: "Travel",
    description:
      "Essays about uncertainty, discovery, wandering, and the creative possibilities of not knowing where we are going.",
    cover: "/images/books/a-field-guide-to-getting-lost.jpg",
    coverColor: "#967b5e",
    relatedEssays: [],
  },

  {
    slug: "the-overstory",
    title: "The Overstory",
    author: "Richard Powers",
    status: "wishlist",
    category: "Fiction",
    description:
      "A novel about trees, time, human lives, and the larger systems that connect everything together.",
    cover: "/images/books/the-overstory.jpg",
    coverColor: "#66765d",
    relatedEssays: [],
  },
];

export function getBookBySlug(slug: string) {
  return books.find((book) => book.slug === slug);
}