import type { Metadata } from "next";

import { PhotographyBrowser } from "@/components/photography/photography-browser";
import { getPhotographyCollections, photographyCollections, photographs } from "@/lib/photography";
import { getPublicPhotographyContent } from "@/lib/photography-supabase";

export const metadata: Metadata = {
  title: "Photography",
  description: "Photographs of ordinary light, places, people, and moments worth noticing.",
};

export default async function PhotographyPage() {
  const fallbackFilters = getPhotographyCollections();
  const content = await getPublicPhotographyContent();
  const hasPublishedContent = content.photographs !== photographs;
  const cards = hasPublishedContent ? content.collections : photographyCollections;
  const filters = hasPublishedContent ? content.collections.map((collection) => collection.title) : fallbackFilters;
  const visiblePhotographs = hasPublishedContent ? content.photographs : photographs;

  return (
    <main className="photography-page">
      <header className="photography-intro"><p className="section-label">Photography archive</p><h1>Ordinary light, noticed slowly.</h1><p className="photography-intro-copy">A collection of photographs from journeys, familiar rooms, quiet afternoons, and places that stayed in memory.</p></header>
      <section className="photography-collections" aria-labelledby="collections-title"><div className="section-label-row"><span className="section-label-accent">Collections</span><span className="section-label-line" /><span className="section-label-text">Ways of noticing</span></div><div className="photography-collection-list">{cards.map((collection) => <article key={collection.slug} className="photography-collection-card"><p className="section-label">{collection.title}</p><h2 id="collections-title">{collection.title}</h2><p>{collection.description}</p></article>)}</div></section>
      <section className="photography-browser-section" aria-label="Photographs"><PhotographyBrowser photographs={visiblePhotographs} collections={filters} /></section>
      <style>{`.photography-page{position:relative;isolation:isolate}.photography-intro,.photography-collections{position:relative;z-index:2}.photography-intro{margin-inline:auto;padding-block:clamp(3rem,8vw,7rem) clamp(2.5rem,5vw,5rem);text-align:left}.photography-intro h1{max-width:11ch;margin-block:.75rem 1.25rem}.photography-intro-copy{max-width:38rem;margin:0}.photography-collections{margin-block:0 clamp(4rem,9vw,8rem)}.photography-collection-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,16rem),1fr));gap:clamp(1.25rem,3vw,2.5rem)}.photography-collection-card{min-height:10rem;padding:clamp(1.25rem,3vw,2rem);border:1px solid rgba(23,23,23,.14);background:rgba(255,252,247,.6)}.photography-collection-card h2{margin:.5rem 0 .75rem}.photography-browser-section{position:relative;z-index:1;clear:both;min-height:1px;margin-top:clamp(3rem,7vw,6rem)}.photography-browser-section .photography-card-image{position:relative}.photography-browser-section .photography-image{position:relative}.photography-browser-section .related-photography-image{position:relative}@media (max-width:760px){.photography-intro{padding-block:2.5rem 3rem}.photography-intro h1{max-width:14ch}.photography-collections{margin-bottom:4rem}.photography-collection-list{grid-template-columns:1fr}.photography-browser-section{margin-top:3rem}}`}</style>
    </main>
  );
}
