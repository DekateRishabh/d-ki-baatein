import Image from "next/image";

import type { FarmPhoto } from "@/lib/farm";

type FarmGalleryProps = {
  photos?: FarmPhoto[];
};

function imagePath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

export function FarmGallery({
  photos,
}: FarmGalleryProps) {
  if (!photos?.length) {
    return null;
  }

  return (
    <section className="farm-gallery">
      <div className="section-label-row">
        <span className="section-label-accent">Images</span>
        <span className="section-label-line" />
        <span className="section-label-text">
          From the Farm
        </span>
      </div>

      <div className="farm-gallery-grid">
        {photos.map((photo, index) => (
          <figure
            key={`${photo.src}-${index}`}
            className={
              index === 0
                ? "farm-gallery-item farm-gallery-item-large"
                : "farm-gallery-item"
            }
          >
            <div className="farm-gallery-image">
              <Image
                src={imagePath(photo.src)}
                alt={photo.alt}
                fill
                sizes={
                  index === 0
                    ? "(max-width: 760px) 100vw, 70vw"
                    : "(max-width: 760px) 100vw, 40vw"
                }
              />
            </div>

            <figcaption>{photo.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}