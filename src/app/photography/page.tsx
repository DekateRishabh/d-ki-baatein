import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { photographs } from "@/lib/photography";
import { getPublicPhotographyContent } from "@/lib/photography-supabase";

export const metadata: Metadata = {
  title: "Photography",
  description: "Photographs of ordinary light, places, people, and moments worth noticing.",
};

export default async function PhotographyPage() {
  const content = await getPublicPhotographyContent();
  const collections = content.collections.map((collection) => {
    const items = content.photographs.filter((photo) => photo.collection === collection.title);
    return { ...collection, items, cover: items[0] ?? null };
  });

  return (
    <main className="photography-page photography-index-page">
      <header className="photography-intro"><p className="section-label">Photography archive</p><h1>Ordinary light, noticed slowly.</h1><p className="photography-intro-copy">A collection of photographs from journeys, familiar rooms, quiet afternoons, and places that stayed in memory.</p></header>
      <section className="photography-collection-index" aria-labelledby="collections-title"><div className="section-label-row"><span className="section-label-accent">Collections</span><span className="section-label-line" /><span className="section-label-text">Ways of noticing</span></div><div className="photography-index-grid">{collections.map((collection) => <Link key={collection.slug} href={`/photography/collections/${collection.slug}`} className="photography-index-card"><div className="photography-index-card-image">{collection.cover ? <Image src={collection.cover.src} alt={collection.cover.alt} fill unoptimized sizes="(max-width: 760px) 100vw, 50vw" /> : <span>No photographs yet</span>}</div><div className="photography-index-card-copy"><div><p className="section-label">{collection.location || collection.title}</p><h2>{collection.title}</h2></div><p>{collection.description}</p><span>{collection.items.length} {collection.items.length === 1 ? "photograph" : "photographs"}</span></div></Link>)}</div></section>
      <style>{`.photography-index-page{position:relative;isolation:isolate}.photography-intro{position:relative;z-index:2;margin-inline:auto;padding-block:clamp(3rem,8vw,7rem) clamp(3rem,6vw,5rem);text-align:left}.photography-intro h1{max-width:11ch;margin:.75rem 0 1.25rem}.photography-intro-copy{max-width:38rem;margin:0}.photography-collection-index{margin-top:clamp(2rem,5vw,4rem)}.photography-index-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,24rem),1fr));gap:clamp(1.25rem,3vw,2.5rem);margin-top:clamp(1.5rem,3vw,2.5rem)}.photography-index-card{display:grid;gap:1rem;color:inherit;text-decoration:none}.photography-index-card-image{position:relative;aspect-ratio:4/3;display:grid;place-items:center;overflow:hidden;border:1px solid rgba(23,23,23,.14);background:rgba(23,23,23,.05)}.photography-index-card-image img{transition:transform .45s ease}.photography-index-card:hover .photography-index-card-image img{transform:scale(1.03)}.photography-index-card-copy{display:grid;gap:.65rem}.photography-index-card-copy h2{margin:.35rem 0 0;font-size:clamp(1.8rem,4vw,3rem)}.photography-index-card-copy p{margin:0;max-width:34rem}.photography-index-card-copy span{font-family:var(--font-plex-mono),monospace;font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;opacity:.62}@media(max-width:760px){.photography-intro{padding-block:2.5rem 3rem}.photography-intro h1{max-width:14ch}.photography-index-grid{grid-template-columns:1fr}}`}</style>
    </main>
  );
}
