"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type TripPhoto = {
  src: string;
  alt: string;
  caption: string;
};

type TripGalleryProps = {
  photos: TripPhoto[];
};

function imagePath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

export function TripGallery({ photos }: TripGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const activePhoto = activeIndex !== null ? photos[activeIndex] : null;

  function closeLightbox() {
    setActiveIndex(null);
  }

  function showPrevious() {
    if (activeIndex === null) return;

    setActiveIndex(activeIndex === 0 ? photos.length - 1 : activeIndex - 1);
  }

  function showNext() {
    if (activeIndex === null) return;

    setActiveIndex(activeIndex === photos.length - 1 ? 0 : activeIndex + 1);
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
  }, [activeIndex]);

  return (
    <>
      <div className="trip-gallery-grid">
        {photos.map((photo, index) => (
          <figure
            key={`${photo.src}-${index}`}
            className={
              index === 0
                ? "trip-gallery-item trip-gallery-item-large"
                : "trip-gallery-item"
            }
          >
            <button
              type="button"
              className="trip-gallery-button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Open photograph ${index + 1}`}
            >
              <span className="trip-gallery-image">
                <Image
                  src={imagePath(photo.src)}
                  alt={photo.alt}
                  fill
                  sizes={
                    index === 0
                      ? "(max-width: 760px) 100vw, 70vw"
                      : "(max-width: 760px) 100vw, 35vw"
                  }
                />
              </span>
            </button>

            <figcaption>{photo.caption}</figcaption>
          </figure>
        ))}
      </div>

      {activePhoto && activeIndex !== null && (
        <div
          className="trip-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Photograph viewer"
          onClick={closeLightbox}
        >
          <div
            className="trip-lightbox-inner"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="trip-lightbox-close"
              onClick={closeLightbox}
              aria-label="Close photograph viewer"
            >
              ×
            </button>

            <div className="trip-lightbox-image">
              <Image
                src={imagePath(activePhoto.src)}
                alt={activePhoto.alt}
                fill
                sizes="100vw"
              />
            </div>

            <div className="trip-lightbox-footer">
              <p>{activePhoto.caption}</p>

              <span>
                {activeIndex + 1} / {photos.length}
              </span>
            </div>

            <button
              type="button"
              className="trip-lightbox-previous"
              onClick={showPrevious}
              aria-label="Previous photograph"
            >
              ←
            </button>

            <button
              type="button"
              className="trip-lightbox-next"
              onClick={showNext}
              aria-label="Next photograph"
            >
              →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
