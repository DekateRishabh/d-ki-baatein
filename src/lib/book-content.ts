const bookContentLoaders = {
  "the-book-of-disquiet": () =>
    import("@/content/books/the-book-of-disquiet.mdx"),

  "braiding-sweetgrass": () =>
    import("@/content/books/braiding-sweetgrass.mdx"),

  "a-field-guide-to-getting-lost": () =>
    import("@/content/books/a-field-guide-to-getting-lost.mdx"),
};

export async function getBookContent(slug: string) {
  const loader =
    bookContentLoaders[
      slug as keyof typeof bookContentLoaders
    ];

  if (!loader) {
    return null;
  }

  return loader();
}