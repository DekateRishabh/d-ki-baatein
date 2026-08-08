import { ArchiveLayout } from "@/components/archive/archive-layout";
import { LibraryBrowser } from "@/components/books/library-browser";
import { SectionLabel } from "@/components/editorial/section-label";
import { books } from "@/lib/books";

function getYear(date?: string) {
  if (!date) {
    return null;
  }

  return date.slice(-4);
}

export default function LibraryPage() {
  const finishedBooks = books.filter((book) => book.status === "finished");

  const timeline = finishedBooks.reduce<Record<string, typeof finishedBooks>>(
    (groups, book) => {
      const year = book.finishedDate?.slice(-4);

      if (!year) {
        return groups;
      }

      if (!groups[year]) {
        groups[year] = [];
      }

      groups[year].push(book);

      return groups;
    },
    {},
  );

  const timelineYears = Object.keys(timeline).sort(
    (a, b) => Number(b) - Number(a),
  );

  return (
    <ArchiveLayout
      pageClassName="library-page"
      accent="पुस्तकें"
      label="Personal library"
      title="Books read, remembered, and carried forward."
      description="A record of books that have changed the way I see, think, notice, and live."
    >
      <LibraryBrowser books={books} />

      <section className="reading-timeline">
        <SectionLabel>Reading timeline</SectionLabel>

        <h2>A record of finished books</h2>

        <div className="timeline-list">
          {timelineYears.map((year) => (
            <div className="timeline-year" key={year}>
              <div className="timeline-year-label">{year}</div>

              <div className="timeline-books">
                {timeline[year].map((book) => (
                  <div className="timeline-book" key={book.slug}>
                    <span>{book.finishedDate}</span>
                    <strong>{book.title}</strong>
                    <small>{book.author}</small>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </ArchiveLayout>
  );
}
