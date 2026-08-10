import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ArticleMeta } from "@/components/editorial/article-meta";
import { EditorialLink } from "@/components/editorial/editorial-link";
import { SectionLabel } from "@/components/editorial/section-label";
import MarkdownContent from "@/components/editorial/markdown-content";
import { getPublishedJournalEntries, getPublishedJournalEntryBySlug } from "@/lib/journal";
import { JournalNavigation } from "@/components/journal/journal-navigation";

type JournalPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: JournalPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getPublishedJournalEntryBySlug(slug);
  return entry ? { title: entry.title, description: entry.excerpt } : {};
}

export default async function JournalEntryPage({ params }: JournalPageProps) {
  const { slug } = await params;
  const [entry, entries] = await Promise.all([
    getPublishedJournalEntryBySlug(slug),
    getPublishedJournalEntries(),
  ]);
  if (!entry) notFound();

  const supabase = await createClient();
  const { data: journalRecord, error: journalRecordError } = await supabase
    .from("journal_entries")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (journalRecordError) throw new Error(journalRecordError.message);

  const { data: photoRows, error: photoError } = journalRecord
    ? await supabase
        .from("journal_entry_media")
        .select("sort_order, caption, media:media_assets(public_url, alt_text, filename)")
        .eq("journal_entry_id", journalRecord.id)
        .order("sort_order", { ascending: true })
    : { data: [], error: null };

  if (photoError) throw new Error(photoError.message);

  const photos = (photoRows ?? []).flatMap((row) => {
    const media = Array.isArray(row.media) ? row.media[0] : row.media;
    return media?.public_url
      ? [{
          url: media.public_url,
          alt: media.alt_text ?? media.filename,
          caption: row.caption,
        }]
      : [];
  });

  const currentIndex = entries.findIndex((journalEntry) => journalEntry.slug === slug);
  const previousEntry = currentIndex < entries.length - 1 ? entries[currentIndex + 1] : undefined;
  const nextEntry = currentIndex > 0 ? entries[currentIndex - 1] : undefined;
  const relatedEntries = entries
    .filter((journalEntry) => journalEntry.slug !== entry.slug && journalEntry.category === entry.category)
    .slice(0, 3);

  return (
    <main className="journal-detail-page">
      <header className="journal-detail-header">
        <SectionLabel accent="दैनंदिनी">Journal</SectionLabel>
        <h1>{entry.title}</h1>
        <p>{entry.excerpt}</p>
        <ArticleMeta type="Journal" readingTime="02 min read" date={entry.date} />
        <div className="journal-detail-tags">
          <span>{entry.category}</span>
          {entry.tags.map((tag) => (
            <Link href={`/journal?tag=${encodeURIComponent(tag)}`} key={tag}>
              #{tag}
            </Link>
          ))}
        </div>
      </header>

      {entry.bodyMarkdown && (
        <article className="journal-detail-body">
          <MarkdownContent content={entry.bodyMarkdown} />
        </article>
      )}

      {photos.length > 0 && (
        <section className="journal-media-gallery" aria-label="Journal photographs">
          <SectionLabel>Photographs</SectionLabel>
          <div className="journal-media-gallery-grid">
            {photos.map((photo, index) => (
              <figure key={`${photo.url}-${index}`} className="journal-media-gallery-item">
                <img src={photo.url} alt={photo.alt} />
                {photo.caption && <figcaption>{photo.caption}</figcaption>}
              </figure>
            ))}
          </div>
        </section>
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
