import Link from "next/link";
import type { Book } from "@/lib/books";
import Image from "next/image";

type BookCardProps = {
  book: Book;
};

function getStatusLabel(status: Book["status"]) {
  if (status === "finished") return "Finished";
  if (status === "reading") return "Currently reading";
  return "Wishlist";
}

function Rating({ rating }: { rating?: number }) {
  if (!rating) {
    return null;
  }

  return (
    <span className="book-rating" aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(rating)}
      <span className="rating-empty">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

export function BookCard({ book }: BookCardProps) {
  return (
    <Link href={`/library/${book.slug}`} className="book-card">
      <div className="book-cover" style={{ backgroundColor: book.coverColor }}>
        {book.cover ? (
          <Image
            src={book.cover}
            alt={`${book.title} cover`}
            fill
            sizes="(max-width: 700px) 45vw, 220px"
          />
        ) : (
          <div className="book-cover-placeholder">
            <span>{book.title}</span>
            <small>{book.author}</small>
          </div>
        )}
      </div>

      <div className="book-card-content">
        <p className="section-label">{book.category}</p>

        <h2>{book.title}</h2>

        <p className="book-author">{book.author}</p>

        <div className="book-card-meta">
          <span>{getStatusLabel(book.status)}</span>
          <Rating rating={book.rating} />
        </div>
      </div>
    </Link>
  );
}
