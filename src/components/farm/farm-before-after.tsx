import Image from "next/image";

import type { FarmPhoto } from "@/lib/farm";

type FarmBeforeAfterProps = {
  before?: FarmPhoto;
  after?: FarmPhoto;
};

function imagePath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

export function FarmBeforeAfter({
  before,
  after,
}: FarmBeforeAfterProps) {
  if (!before || !after) {
    return null;
  }

  return (
    <section className="farm-before-after">
      <div className="section-label-row">
        <span className="section-label-accent">Change</span>
        <span className="section-label-line" />
        <span className="section-label-text">
          Before and after
        </span>
      </div>

      <div className="farm-before-after-grid">
        <figure>
          <div className="farm-before-after-image">
            <Image
              src={imagePath(before.src)}
              alt={before.alt}
              fill
              sizes="(max-width: 760px) 100vw, 50vw"
            />
          </div>

          <figcaption>{before.caption}</figcaption>
        </figure>

        <figure>
          <div className="farm-before-after-image">
            <Image
              src={imagePath(after.src)}
              alt={after.alt}
              fill
              sizes="(max-width: 760px) 100vw, 50vw"
            />
          </div>

          <figcaption>{after.caption}</figcaption>
        </figure>
      </div>
    </section>
  );
}