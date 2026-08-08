"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export type JournalGalleryImage = {
  src: string;
  alt: string;
  caption: string;
};

type JournalGalleryProps = {
  images: JournalGalleryImage[];
};

export function JournalGallery({
  images,
}: JournalGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(
    null
  );

  const activeImage =
    activeIndex !== null ? images[activeIndex] : null;

  function closeGallery() {
    setActiveIndex(null);
  }

  function showPrevious() {
    if (activeIndex === null) {
      return;
    }

    setActiveIndex(
      activeIndex === 0 ? images.length - 1 : activeIndex - 1
    );
  }

  function showNext() {
    if (activeIndex === null) {
      return;
    }

    setActiveIndex(
      activeIndex === images.length - 1 ? 0 : activeIndex + 1
    );
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (activeIndex === null) {
        return;
      }

      if (event.key === "Escape") {
        closeGallery();
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex]);

  return (
    <>
      <div className="journal-gallery">
        {images.map((image, index) => (
          <button
            type="button"
            className="journal-gallery-item"
            key={image.src}
            onClick={() => setActiveIndex(index)}
            aria-label={`Open photograph ${index + 1}`}
          >
            <span className="journal-gallery-image">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 760px) 50vw, 300px"
              />
            </span>

            <span className="journal-gallery-caption">
              {image.caption}
            </span>
          </button>
        ))}
      </div>

      {activeImage && activeIndex !== null && (
        <div
          className="journal-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Photograph viewer"
          onClick={closeGallery}
        >
          <button
            type="button"
            className="journal-lightbox-close"
            onClick={closeGallery}
            aria-label="Close photograph viewer"
          >
            ×
          </button>

          <button
            type="button"
            className="journal-lightbox-previous"
            onClick={(event) => {
              event.stopPropagation();
              showPrevious();
            }}
            aria-label="Previous photograph"
          >
            ←
          </button>

          <div
            className="journal-lightbox-content"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="journal-lightbox-image">
              <Image
                src={activeImage.src}
                alt={activeImage.alt}
                fill
                sizes="100vw"
              />
            </div>

            <p>{activeImage.caption}</p>

            <span>
              {activeIndex + 1} / {images.length}
            </span>
          </div>

          <button
            type="button"
            className="journal-lightbox-next"
            onClick={(event) => {
              event.stopPropagation();
              showNext();
            }}
            aria-label="Next photograph"
          >
            →
          </button>
        </div>
      )}
    </>
  );
}