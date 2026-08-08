import Link from "next/link";
import type { JournalEntry } from "@/lib/journal";

type JournalNavigationProps = {
  previous?: JournalEntry;
  next?: JournalEntry;
};

export function JournalNavigation({
  previous,
  next,
}: JournalNavigationProps) {
  if (!previous && !next) {
    return null;
  }

  return (
    <nav
      className="journal-navigation"
      aria-label="Journal navigation"
    >
      {previous ? (
        <Link
          href={`/journal/${previous.slug}`}
          className="journal-navigation-link"
        >
          <span>← Older entry</span>
          <strong>{previous.title}</strong>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={`/journal/${next.slug}`}
          className="journal-navigation-link journal-navigation-next"
        >
          <span>Newer entry →</span>
          <strong>{next.title}</strong>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}