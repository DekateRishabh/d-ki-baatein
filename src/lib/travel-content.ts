const travelContentLoaders = {
  "jaipur-monsoon-days": () =>
    import("@/content/travel/jaipur-monsoon-days.mdx"),

  "goa-offseason": () =>
    import("@/content/travel/goa-offseason.mdx"),

  "kathmandu-city-walks": () =>
    import("@/content/travel/kathmandu-city-walks.mdx"),
};

export async function getTravelContent(slug: string) {
  const loader =
    travelContentLoaders[
      slug as keyof typeof travelContentLoaders
    ];

  if (!loader) {
    return null;
  }

  return loader();
}