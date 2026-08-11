import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getPublicPhotographyContent } from "@/lib/photography-supabase";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const content = await getPublicPhotographyContent();
  const collection = content.collections.find((item) => item.slug === slug);
  return collection ? { title: `${collection.title} — Photography`, description: collection.description } : { title: "Photography" };
}

export default async function PhotographyCollectionPage({ params }: Props) {
  const { slug } = await params;
  const content = await getPublicPhotographyContent();
  const collection = content.collections.find((item) => item.slug === slug);
  if (!collection) notFound();
  const photos = content.photographs.filter((photo) => photo.collection === collection.title);

  return (
    <main className="photography-page photography-collection-page">
      <header className="photography-collection-header"><Link href="/photography" className="photography-back-link">← All collections</Link><p className="section-label">{collection.location || "Photography archive"}</p><h1>{collection.title}</h1>{collection.description ? <p>{collection.description}</p> : null}<span>{photos.length} {photos.length === 1 ? "photograph" : "photographs"}</span></header>
      <section className="photography-collection-photo-grid" aria-label={`${collection.title} photographs`}>{photos.map((photo) => <Link key={photo.slug} href={`/photography/${photo.slug}`} className="photography-collection-photo-card"><div className="photography-collection-photo-image"><Image src={photo.src} alt={photo.alt} fill unoptimized sizes="(max-width: 760px) 100vw, 33vw" /></div><div><p className="section-label">{photo.location}</p><h2>{photo.title}</h2><p>{photo.caption}</p></div></Link>)}</section>
      <style>{`.photography-collection-page{position:relative;isolation:isolate}.photography-collection-header{max-width:52rem;padding-block:clamp(2.5rem,7vw,6rem) clamp(2.5rem,5vw,4rem)}.photography-back-link{display:inline-block;margin-bottom:2rem;color:inherit;text-decoration:none}.photography-collection-header h1{max-width:12ch;margin:.75rem 0 1rem}.photography-collection-header>p:not(.section-label){max-width:38rem;margin:0 0 1rem;font-size:1.15rem}.photography-collection-header>span{font-family:var(--font-plex-mono),monospace;font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;opacity:.62}.photography-collection-photo-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr));gap:clamp(1.25rem,3vw,2.5rem)}.photography-collection-photo-card{display:grid;gap:1rem;color:inherit;text-decoration:none}.photography-collection-photo-image{position:relative;aspect-ratio:4/3;overflow:hidden;background:rgba(23,23,23,.05)}.photography-collection-photo-card h2{margin:.35rem 0 .45rem}.photography-collection-photo-card p:last-child{margin:0;opacity:.78}@media(max-width:760px){.photography-collection-header{padding-block:2.5rem 3rem}.photography-collection-photo-grid{grid-template-columns:1fr}}`}</style>
    </main>
  );
}
