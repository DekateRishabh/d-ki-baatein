import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { ArticleMeta } from "@/components/editorial/article-meta";
import { EditorialLink } from "@/components/editorial/editorial-link";
import { SectionLabel } from "@/components/editorial/section-label";
import { getJournalEntryBySlug, journalEntries } from "@/lib/journal";
import { getJournalContent } from "@/lib/journal-content";
import { JournalNavigation } from "@/components/journal/journal-navigation";

type JournalPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return journalEntries.map((entry) => ({
    slug: entry.slug,
  }));
}

export async function generateMetadata({
  params,
}: JournalPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getJournalEntryBySlug(slug);

  if (!entry) {
    return {};
  }

  return {
    title: entry.title,
    description: entry.excerpt,
  };
}

export default async function JournalEntryPage({ params }: JournalPageProps) {
  const { slug } = await params;
  const entry = getJournalEntryBySlug(slug);

  if (!entry) {
    notFound();
  }

  const contentModule = await getJournalContent(slug);
  const JournalContent = contentModule?.default;

  const currentIndex = journalEntries.findIndex(
    (journalEntry) => journalEntry.slug === slug,
  );

  const previousEntry =
    currentIndex < journalEntries.length - 1
      ? journalEntries[currentIndex + 1]
      : undefined;

  const nextEntry =
    currentIndex > 0 ? journalEntries[currentIndex - 1] : undefined;

  const relatedEntries = journalEntries
    .filter((journalEntry) => {
      if (journalEntry.slug === entry.slug) {
        return false;
      }

      const sharesCategory = journalEntry.category === entry.category;

      const sharesTag = journalEntry.tags.some((tag) =>
        entry.tags.includes(tag),
      );

      return sharesCategory || sharesTag;
    })
    .slice(0, 3);

  return (
    <main className="journal-detail-page">
      <header className="journal-detail-header">
        <SectionLabel accent="दैनंदिनी">Journal</SectionLabel>

        <h1>{entry.title}</h1>

        <p>{entry.excerpt}</p>

        <ArticleMeta
          type="Journal"
          readingTime="02 min read"
          date={entry.date}
        />

        <div className="journal-detail-tags">
          <span>{entry.category}</span>

          {entry.tags.map((tag) => (
            <Link href={`/journal?tag=${encodeURIComponent(tag)}`} key={tag}>
              #{tag}
            </Link>
          ))}
        </div>
      </header>

      {JournalContent && (
        <article className="journal-detail-body">
          <JournalContent />
        </article>
      )}

      {relatedEntries.length > 0 && (
        <section className="related-journal">
          <SectionLabel>Related entries</SectionLabel>

          <div className="related-journal-list">
            {relatedEntries.map((relatedEntry) => (
              <Link
                href={`/journal/${relatedEntry.slug}`}
                key={relatedEntry.slug}
                className="related-journal-item"
              >
                <span>{relatedEntry.date}</span>
                <strong>{relatedEntry.title}</strong>
                <small>{relatedEntry.category}</small>
              </Link>
            ))}
          </div>
        </section>
      )}

      <JournalNavigation previous={previousEntry} next={nextEntry} />

      <footer className="journal-detail-footer">
        <div>
          {entry.location && <span>{entry.location}</span>}
          {entry.mood && <span>{entry.mood}</span>}
        </div>

        <EditorialLink href="/journal">Back to journal</EditorialLink>
      </footer>
    </main>
  );
}
