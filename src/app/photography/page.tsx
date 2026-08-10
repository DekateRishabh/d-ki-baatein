import type { Metadata } from "next";
import { PhotographyBrowser } from "@/components/photography/photography-browser";
import { getPublicPhotographyData } from "@/lib/photography-data";

export const metadata: Metadata = {
  title: "Photography",
  description: "Photographs of ordinary light, places, people, and moments worth noticing.",
};

type PhotographyPageProps = {
  searchParams?: Promise<{ collection?: string }>;
};

export default async function PhotographyPage({ searchParams }: PhotographyPageProps) {
  const { collections, photographs } = await getPublicPhotographyData();
  const activeSlug = (await searchParams)?.collection;
  const activeCollection = collections.find((collection) => collection.slug === activeSlug);
  const filteredPhotographs = activeCollection
    ? photographs.filter((photograph) => photograph.tags.includes(activeCollection.slug))
    : photographs;
  const browserCollections = collections.map((collection) => collection.title);

  return (
    <main className="photography-page">
      <header className="photography-intro">
        <p className="section-label">Photography archive</p>
        <h1>Ordinary light, noticed slowly.</h1>
        <p>A collection of photographs from journeys, familiar rooms, quiet afternoons, and places that stayed in memory.</p>
      </header>

      <section className="photography-collections" aria-labelledby="collections-title">
        <div className="section-label-row">
          <span className="section-label-accent">Collections</span>
          <span className="section-label-line" />
          <span className="section-label-text">Ways of noticing</span>
        </div>
        <div className="photography-collection-list">
          {collections.map((collection) => (
            <article key={collection.slug} className="photography-collection-card">
              <p className="section-label">{collection.title}</p>
              <h2 id="collections-title">{collection.title}</h2>
              <p>{collection.description}</p>
            </article>
          ))}
        </div>
      </section>

      {activeCollection && (
        <p className="photography-active-filter">
          Showing photographs from <strong>{activeCollection.title}</strong> · <a href="/photography">Clear filter</a>
        </p>
      )}

      <PhotographyBrowser photographs={filteredPhotographs} collections={browserCollections} />
    </main>
  );
}
