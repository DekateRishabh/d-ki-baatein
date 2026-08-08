const farmContentLoaders = {
  "a-tree-does-not-hurry": () =>
    import("@/content/farm/a-tree-does-not-hurry.mdx"),

  "the-first-monsoon-garden": () =>
    import("@/content/farm/the-first-monsoon-garden.mdx"),

  "making-room-for-light": () =>
    import("@/content/farm/making-room-for-light.mdx"),

  "the-first-working-corner": () =>
    import("@/content/farm/the-first-working-corner.mdx"),
};

export async function getFarmContent(slug: string) {
  const loader =
    farmContentLoaders[
      slug as keyof typeof farmContentLoaders
    ];

  if (!loader) {
    return null;
  }

  return loader();
}