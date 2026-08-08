import Link from "next/link";

type EditorialLinkProps = {
  href: string;
  children: React.ReactNode;
  external?: boolean;
};

export function EditorialLink({
  href,
  children,
  external = false,
}: EditorialLinkProps) {
  if (external) {
    return (
      <a
        href={href}
        className="editorial-link"
        target="_blank"
        rel="noreferrer"
      >
        <span>{children}</span>
        <span aria-hidden="true">↗</span>
      </a>
    );
  }

  return (
    <Link href={href} className="editorial-link">
      <span>{children}</span>
      <span aria-hidden="true">→</span>
    </Link>
  );
}
