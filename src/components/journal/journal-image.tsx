import Image from "next/image";

type JournalImageProps = {
  src: string;
  alt: string;
  caption?: string;
  align?: "wide" | "inset";
};

export function JournalImage({
  src,
  alt,
  caption,
  align = "wide",
}: JournalImageProps) {
  return (
    <figure className={`journal-image journal-image-${align}`}>
      <div className="journal-image-frame">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={
            align === "wide"
              ? "(max-width: 760px) 100vw, 900px"
              : "(max-width: 760px) 100vw, 620px"
          }
        />
      </div>

      {caption && (
        <figcaption className="journal-image-caption">{caption}</figcaption>
      )}
    </figure>
  );
}
