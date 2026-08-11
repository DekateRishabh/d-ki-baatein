import type { Metadata } from "next";
import Link from "next/link";

import { PhotographyLightbox } from "@/components/photography/photography-lightbox";
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
  if (!collection) return null;
  const photos = content.photographs.filter((photo) => photo.collection === collection.title);

  return (
    <main className="photography-page photography-collection-page">
      <header className="photography-collection-header"><Link href="/photography" className="photography-back-link">← All collections</Link><p className="section-label">{collection.location || "Photography archive"}</p><h1>{collection.title}</h1>{collection.description ? <p>{collection.description}</p> : null}<span>{photos.length} {photos.length === 1 ? "photograph" : "photographs"}</span></header>
      <section aria-label={`${collection.title} photographs`}><PhotographyLightbox photographs={photos} /></section>
      <style>{`.photography-collection-page{position:relative;isolation:isolate}.photography-collection-header{max-width:52rem;padding-block:clamp(2.5rem,7vw,6rem) clamp(2.5rem,5vw,4rem)}.photography-back-link{display:inline-block;margin-bottom:2rem;color:inherit;text-decoration:none}.photography-collection-header h1{max-width:12ch;margin:.75rem 0 1rem}.photography-collection-header>p:not(.section-label){max-width:38rem;margin:0 0 1rem;font-size:1.15rem}.photography-collection-header>span{font-family:var(--font-plex-mono),monospace;font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;opacity:.62}@media(max-width:760px){.photography-collection-header{padding-block:2.5rem 3rem}}`}</style>
    </main>
  );
}
