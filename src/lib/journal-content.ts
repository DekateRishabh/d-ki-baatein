const journalContentLoaders = {
  "rain-tea-and-a-long-walk": () =>
    import("@/content/journal/rain-tea-and-a-long-walk.mdx"),

  "reordering-old-photographs": () =>
    import("@/content/journal/reordering-old-photographs.mdx"),

  "the-patience-of-unfinished-work": () =>
    import("@/content/journal/the-patience-of-unfinished-work.mdx"),

  "a-tree-does-not-hurry": () =>
    import("@/content/journal/a-tree-does-not-hurry.mdx"),
};

export async function getJournalContent(slug: string) {
  const loader =
    journalContentLoaders[
      slug as keyof typeof journalContentLoaders
    ];

  if (!loader) {
    return null;
  }

  return loader();
}