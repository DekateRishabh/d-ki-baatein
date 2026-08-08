import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EditorialLink } from "@/components/editorial/editorial-link";
import { SectionLabel } from "@/components/editorial/section-label";
import { books, getBookBySlug } from "@/lib/books";
import { getBookContent } from "@/lib/book-content";

type BookPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function getStatusLabel(status: string) {
  if (status === "finished") return "Finished";
  if (status === "reading") return "Currently reading";
  return "Wishlist";
}

function Rating({ rating }: { rating?: number }) {
  if (!rating) {
    return null;
  }

  return (
    <span className="detail-rating" aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(rating)}
      <span className="rating-empty">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

export function generateStaticParams() {
  return books.map((book) => ({
    slug: book.slug,
  }));
}

export async function generateMetadata({
  params,
}: BookPageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = getBookBySlug(slug);

  if (!book) {
    return {};
  }

  return {
    title: book.title,
    description: `${book.title} by ${book.author} — part of the D Ki Baatein library.`,
  };
}

export default async function BookDetailPage({ params }: BookPageProps) {
  const { slug } = await params;
  const book = getBookBySlug(slug);

  if (!book) {
    notFound();
  }

  const contentModule = await getBookContent(slug);
  const BookContent = contentModule?.default;

  return (
    <main className="book-detail-page">
      <div className="book-detail-top">
        <div
          className="book-detail-cover"
          style={{ backgroundColor: book.coverColor }}
        >
          {book.cover ? (
            <img src={book.cover} alt={`${book.title} cover`} />
          ) : (
            <div className="book-cover-placeholder">
              <span>{book.title}</span>
              <small>{book.author}</small>
            </div>
          )}
        </div>

        <div className="book-detail-intro">
          <SectionLabel accent="पुस्तक">{book.category}</SectionLabel>

          <h1>{book.title}</h1>

          <p className="book-detail-author">{book.author}</p>

          <p className="book-detail-description">{book.description}</p>

          <div className="book-detail-meta">
            <span>{getStatusLabel(book.status)}</span>

            {book.finishedDate && <span>· {book.finishedDate}</span>}

            <Rating rating={book.rating} />
          </div>
        </div>
      </div>

      <div className="book-detail-content">
        {BookContent && (
          <section className="book-content">
            <BookContent />
          </section>
        )}

        {book.relatedEssays && book.relatedEssays.length > 0 && (
          <section className="book-detail-section">
            <SectionLabel>Related essays</SectionLabel>

            <div className="book-related-links">
              {book.relatedEssays.map((essay) => (
                <EditorialLink key={essay.href} href={essay.href}>
                  {essay.title}
                </EditorialLink>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="book-back-link">
        <EditorialLink href="/library">Return to the library</EditorialLink>
      </div>
    </main>
  );
}
