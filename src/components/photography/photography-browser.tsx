"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import type { Photograph } from "@/lib/photography";

type PhotographyBrowserProps = {
  photographs: Photograph[];
  collections: string[];
};

function imagePath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

export function PhotographyBrowser({
  photographs,
  collections,
}: PhotographyBrowserProps) {
  const [activeCollection, setActiveCollection] = useState("All");

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const filteredPhotographs = useMemo(() => {
    if (activeCollection === "All") {
      return photographs;
    }

    return photographs.filter(
      (photograph) => photograph.collection === activeCollection,
    );
  }, [activeCollection, photographs]);

  const activePhotograph =
    activeIndex !== null ? filteredPhotographs[activeIndex] : null;

  function closeLightbox() {
    setActiveIndex(null);
  }

  function showPrevious() {
    if (activeIndex === null) return;

    setActiveIndex(
      activeIndex === 0 ? filteredPhotographs.length - 1 : activeIndex - 1,
    );
  }

  function showNext() {
    if (activeIndex === null) return;

    setActiveIndex(
      activeIndex === filteredPhotographs.length - 1 ? 0 : activeIndex + 1,
    );
  }

  useEffect(() => {
    if (activeIndex === null) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeIndex, filteredPhotographs.length]);

  return (
    <section className="photography-browser">
      <div className="photography-controls">
        <div
          className="photography-filters"
          aria-label="Photography collections"
        >
          <button
            type="button"
            className={
              activeCollection === "All"
                ? "photography-filter is-active"
                : "photography-filter"
            }
            onClick={() => {
              setActiveCollection("All");
              closeLightbox();
            }}
            aria-pressed={activeCollection === "All"}
          >
            All
          </button>

          {collections.map((collection) => (
            <button
              key={collection}
              type="button"
              className={
                activeCollection === collection
                  ? "photography-filter is-active"
                  : "photography-filter"
              }
              onClick={() => {
                setActiveCollection(collection);
                closeLightbox();
              }}
              aria-pressed={activeCollection === collection}
            >
              {collection}
            </button>
          ))}
        </div>

        <p className="photography-result-count">
          {String(filteredPhotographs.length).padStart(2, "0")} photographs
        </p>
      </div>

      {filteredPhotographs.length > 0 ? (
        <div className="photography-gallery">
          {filteredPhotographs.map((photograph, index) => (
            <article
              key={photograph.slug}
              className={
                index === 0
                  ? "photography-card photography-card-featured"
                  : "photography-card"
              }
            >
              <button
                type="button"
                className="photography-image-button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Open ${photograph.title}`}
              >
                <span className="photography-image">
                  <Image
                    src={imagePath(photograph.src)}
                    alt={photograph.alt}
                    fill
                    sizes={
                      index === 0
                        ? "(max-width: 760px) 100vw, 70vw"
                        : "(max-width: 760px) 100vw, 40vw"
                    }
                  />
                </span>
              </button>

              <div className="photography-card-content">
                <div className="photography-card-meta">
                  <span>{photograph.location}</span>
                  <span>{photograph.date}</span>
                </div>

                <h2>
                  <Link href={`/photography/${photograph.slug}`}>
                    {photograph.title}
                  </Link>
                </h2>

                <p>{photograph.caption}</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="photography-empty">
          <h2>No photographs yet.</h2>
          <p>This collection is still waiting for something worth noticing.</p>
        </div>
      )}

      {activePhotograph && activeIndex !== null && (
        <div
          className="photography-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Photography viewer"
          onClick={closeLightbox}
        >
          <div
            className="photography-lightbox-inner"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="photography-lightbox-close"
              onClick={closeLightbox}
              aria-label="Close photography viewer"
            >
              ×
            </button>

            <div className="photography-lightbox-image">
              <Image
                src={imagePath(activePhotograph.src)}
                alt={activePhotograph.alt}
                fill
                sizes="100vw"
              />
            </div>

            <div className="photography-lightbox-footer">
              <p>{activePhotograph.caption}</p>

              <span>
                {activeIndex + 1} / {filteredPhotographs.length}
              </span>
            </div>

            <button
              type="button"
              className="photography-lightbox-previous"
              onClick={showPrevious}
              aria-label="Previous photograph"
            >
              ←
            </button>

            <button
              type="button"
              className="photography-lightbox-next"
              onClick={showNext}
              aria-label="Next photograph"
            >
              →
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
