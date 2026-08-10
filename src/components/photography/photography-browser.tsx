"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type Photograph = {
  slug: string;
  title: string;
  description: string;
  src: string;
  alt: string;
  collection: string;
  location: string;
  date: string;
  caption: string;
  tags: string[];
};

type PhotographyBrowserProps = {
  photographs: Photograph[];
  collections: string[];
};

export function PhotographyBrowser({ photographs, collections }: PhotographyBrowserProps) {
  const [query, setQuery] = useState("");
  const [collection, setCollection] = useState("all");
  const normalizedQuery = query.toLowerCase().trim();
  const filteredPhotographs = useMemo(() => photographs.filter((photograph) => {
    const matchesCollection = collection === "all" || photograph.collection === collection;
    const searchableText = [photograph.title, photograph.description, photograph.caption, photograph.location, photograph.collection, ...photograph.tags].join(" ").toLowerCase();
    return matchesCollection && (!normalizedQuery || searchableText.includes(normalizedQuery));
  }), [collection, normalizedQuery, photographs]);

  return (
    <section className="photography-browser" aria-label="Photography browser">
      <div className="photography-controls">
        <label>
          Search photographs
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by place, light, or memory" />
        </label>
        <label>
          Collection
          <select value={collection} onChange={(event) => setCollection(event.target.value)}>
            <option value="all">All collections</option>
            {collections.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </div>
      <p className="photography-results-meta">{filteredPhotographs.length} {filteredPhotographs.length === 1 ? "photograph" : "photographs"}</p>
      {filteredPhotographs.length > 0 ? (
        <div className="photography-grid">
          {filteredPhotographs.map((photograph) => (
            <Link key={photograph.slug} href={`/photography/${photograph.slug}`} className="photography-card">
              <div className="photography-card-image">
                <Image src={photograph.src} alt={photograph.alt} fill unoptimized sizes="(max-width: 760px) 100vw, 33vw" />
              </div>
              <div className="photography-card-copy">
                <p className="section-label">{photograph.collection}</p>
                <h2>{photograph.title}</h2>
                <p>{photograph.caption}</p>
                <span>{photograph.location} · {photograph.date}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="photography-empty"><h2>No photographs found.</h2><p>Try changing the search or collection filter.</p></div>
      )}
    </section>
  );
}
