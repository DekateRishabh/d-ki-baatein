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
      <header className="photography-intro">
        <p className="section-label">Photography archive</p>
        <h1>Ordinary light, noticed slowly.</h1>
        <p className="photography-intro-copy">A collection of photographs from journeys, familiar rooms, quiet afternoons, and places that stayed in memory.</p>
      </header>

      <section className="photography-collection-index" aria-labelledby="collections-title">
        <div className="section-label-row">
          <span className="section-label-accent">Collections</span>
          <span className="section-label-line" />
          <span className="section-label-text">Ways of noticing</span>
        </div>

        <div className="photography-index-grid">
          {collections.map((collection) => (
            <Link
              key={collection.slug}
              href={`/photography/collections/${collection.slug}`}
              className="photography-index-card"
            >
              <div className="photography-index-card-image">
                {collection.cover ? (
                  <Image
                    src={collection.cover.src}
                    alt={collection.cover.alt}
                    fill
                    unoptimized
                    sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 42vw"
                  />
                ) : (
                  <span>No photographs yet</span>
                )}
              </div>

              <div className="photography-index-card-copy">
                <div>
                  <p className="section-label">{collection.location || collection.title}</p>
                  <h2>{collection.title}</h2>
                </div>
                <p>{collection.description}</p>
                <span>
                  {collection.items.length} {collection.items.length === 1 ? "photograph" : "photographs"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <style>{`
        .photography-index-page {
          position: relative;
          isolation: isolate;
        }

        .photography-intro {
          position: relative;
          z-index: 2;
          max-width: 68rem;
          margin-inline: auto;
          padding-block: clamp(3rem, 8vw, 6.5rem) clamp(2rem, 5vw, 4rem);
          text-align: left;
        }

        .photography-intro h1 {
          max-width: 11ch;
          margin: 0.75rem 0 1.1rem;
        }

        .photography-intro-copy {
          max-width: 40rem;
          margin: 0;
        }

        .photography-collection-index {
          max-width: 68rem;
          margin: 0 auto;
          padding-bottom: clamp(3rem, 6vw, 5rem);
        }

        .photography-index-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: clamp(1rem, 2vw, 1.5rem);
          margin-top: clamp(1.25rem, 2.5vw, 2rem);
        }

        .photography-index-card {
          display: grid;
          gap: 0.85rem;
          color: inherit;
          text-decoration: none;
          align-content: start;
        }

        .photography-index-card-image {
          position: relative;
          aspect-ratio: 16 / 10;
          overflow: hidden;
          border: 1px solid rgba(23, 23, 23, 0.12);
          background: rgba(23, 23, 23, 0.05);
          border-radius: 10px;
        }

        .photography-index-card-image img {
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .photography-index-card:hover .photography-index-card-image img {
          transform: scale(1.02);
        }

        .photography-index-card-copy {
          display: grid;
          gap: 0.4rem;
        }

        .photography-index-card-copy h2 {
          margin: 0.25rem 0 0;
          font-size: clamp(1.6rem, 3vw, 2.3rem);
        }

        .photography-index-card-copy p {
          margin: 0;
          max-width: 32rem;
        }

        .photography-index-card-copy span {
          font-family: var(--font-plex-mono), monospace;
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          opacity: 0.62;
          margin-top: 0.2rem;
        }

        @media (max-width: 900px) {
          .photography-index-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 760px) {
          .photography-intro {
            padding-block: 2.5rem 2rem;
          }

          .photography-intro h1 {
            max-width: 14ch;
          }

          .photography-collection-index {
            padding-bottom: 3rem;
          }
        }
      `}</style>
    </main>
  );
}
