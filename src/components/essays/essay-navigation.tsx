import Link from "next/link";

type EssayNavigationProps = {
  previous?: {
    title: string;
    href: string;
  };
  next?: {
    title: string;
    href: string;
  };
};

export function EssayNavigation({ previous, next }: EssayNavigationProps) {
  if (!previous && !next) {
    return null;
  }

  return (
    <nav className="essay-navigation" aria-label="Essay navigation">
      {previous ? (
        <Link href={previous.href}>
          <span>← Previous essay</span>
          <strong>{previous.title}</strong>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link href={next.href}>
          <span>Next essay →</span>
          <strong>{next.title}</strong>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
