import type { Metadata } from "next";

import { PhotographyBrowser } from "@/components/photography/photography-browser";
import {
  getPhotographyCollections,
  photographyCollections,
  photographs,
} from "@/lib/photography";

export const metadata: Metadata = {
  title: "Photography",
  description:
    "Photographs of ordinary light, places, people, and moments worth noticing.",
};

export default function PhotographyPage() {
  const collections = getPhotographyCollections();

  return (
    <main className="photography-page">
      <header className="photography-intro">
        <p className="section-label">Photography archive</p>
        <h1>Ordinary light, noticed slowly.</h1>
        <p>A collection of photographs from journeys, familiar rooms, quiet afternoons, and places that stayed in memory.</p>
      </header>
      <section className="photography-collections" aria-labelledby="collections-title">
        <div className="section-label-row"><span className="section-label-accent">Collections</span><span className="section-label-line" /><span className="section-label-text">Ways of noticing</span></div>
        <div className="photography-collection-list">{photographyCollections.map((collection) => <article key={collection.slug} className="photography-collection-card"><p className="section-label">{collection.title}</p><h2 id="collections-title">{collection.title}</h2><p>{collection.description}</p></article>)}</div>
      </section>
      <PhotographyBrowser photographs={photographs} collections={collections} />
    </main>
  );
}
