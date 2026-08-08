import Link from "next/link";

type ContentCardProps = {
  href?: string;
  title: string;
  description?: string;
  eyebrow?: string;
  number?: string;
  meta?: string[];
  tags?: string[];
  className?: string;
  external?: boolean;
};

export function ContentCard({
  href,
  title,
  description,
  eyebrow,
  number,
  meta = [],
  tags = [],
  className = "",
  external = false,
}: ContentCardProps) {
  const content = (
    <>
      {number && <span className="content-card-number">{number}</span>}

      <div className="content-card-main">
        {eyebrow && <p className="content-card-eyebrow">{eyebrow}</p>}

        <h2>{title}</h2>

        {description && (
          <p className="content-card-description">{description}</p>
        )}

        {tags.length > 0 && (
          <div className="content-card-tags">
            {tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        )}
      </div>

      <div className="content-card-side">
        {meta.map((item) => (
          <span key={item}>{item}</span>
        ))}

        {href && (
          <span className="content-card-arrow" aria-hidden="true">
            {external ? "↗" : "→"}
          </span>
        )}
      </div>
    </>
  );

  if (!href) {
    return <div className={`content-card ${className}`}>{content}</div>;
  }

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={`content-card ${className}`}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={`content-card ${className}`}>
      {content}
    </Link>
  );
}
