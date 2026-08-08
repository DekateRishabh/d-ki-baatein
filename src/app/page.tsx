import Image from "next/image";
import Link from "next/link";

import { books } from "@/lib/books";
import { essays } from "@/lib/essays";
import { journalEntries } from "@/lib/journal";
import { farmUpdates } from "@/lib/farm";
import { trips } from "@/lib/travel";

const latestEssay = essays[0];

const currentlyReading = books.find((book) => book.status === "reading");

const latestJournal = journalEntries[0];

const farmUpdate = farmUpdates[0];

const travelHighlight = trips[0];

const recentPhoto = travelHighlight?.photos?.[0];

const favoriteBooks = books
  .filter((book) => book.rating && book.rating >= 4)
  .slice(0, 3);

function imagePath(path?: string) {
  if (!path) return null;
  return path.startsWith("/") ? path : `/${path}`;
}

export default function HomePage() {
  return (
    <main className="homepage">
      {/* 1. Hero introduction */}
      <section className="home-hero">
        <div className="home-eyebrow">
          <span>परिचय</span>
          <span>Welcome, reader</span>
        </div>

        <h1>
          A quiet place to keep <em>what I’ve lived,</em> read, and made.
        </h1>

        <p>
          A personal library of ideas, stories, books, places, photographs,
          projects, and memories collected over time.
        </p>

        <Link href="/essays" className="editorial-link">
          Explore the archive <span>→</span>
        </Link>
      </section>

      {/* 2. Latest essay */}
      <section className="home-latest-essay">
        <div className="home-section-heading">
          <p className="section-label">Latest essay</p>

          <p className="home-section-meta">
            {latestEssay?.readingTime ?? "08 min read"}
          </p>
        </div>

        <div className="home-latest-essay-layout">
          <div>
            <h2>{latestEssay?.title ?? "The Things That Stay"}</h2>

            <p className="home-description">
              {latestEssay?.description ??
                "A reflection on memory, place, and the quiet objects that remain with us through changing seasons."}
            </p>

            <Link
              href={`/essays/${latestEssay?.slug ?? "the-things-that-stay"}`}
              className="editorial-link"
            >
              Read the essay <span>→</span>
            </Link>
          </div>

          <div className="home-essay-note">
            <span>01</span>
            <p>
              A reflection on memory, attention, and the small structures around
              which a life quietly gathers.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Featured quote */}
      <section className="home-quote">
        <p className="section-label">Featured quote</p>

        <blockquote>
          “Some things do not announce their importance when they arrive. They
          simply remain.”
        </blockquote>

        <Link href="/essays/the-things-that-stay" className="home-quote-source">
          From “The Things That Stay” <span>→</span>
        </Link>
      </section>

      {/* 4. Currently reading */}
      <section className="home-reading">
        <div>
          <p className="section-label">Currently reading</p>

          <h2>{currentlyReading?.title ?? "The Book of Disquiet"}</h2>

          <p className="home-book-author">
            {currentlyReading?.author ?? "Fernando Pessoa"}
          </p>

          <p className="home-description">
            A quiet, fragmented book about solitude, observation, and the inner
            life of ordinary days.
          </p>

          <Link href="/library/the-book-of-disquiet" className="editorial-link">
            View the book <span>→</span>
          </Link>
        </div>

        <div className="home-reading-mark">
          <span>Reading slowly</span>
          <strong>
            {currentlyReading?.rating ? `${currentlyReading.rating}/5` : "—"}
          </strong>
        </div>
      </section>

      {/* 5. Recent photography */}
      <section className="home-photography">
        <div className="home-section-heading">
          <p className="section-label">Recent photography</p>

          <Link href="/photography" className="editorial-link">
            View all <span>→</span>
          </Link>
        </div>

        <div className="home-photography-layout">
          <div className="home-photography-image">
            {recentPhoto?.src ? (
              <Image
                src={imagePath(recentPhoto.src) ?? ""}
                alt={recentPhoto.alt}
                fill
                sizes="(max-width: 760px) 100vw, 65vw"
                className="home-cover-image"
              />
            ) : (
              <span>Recent photograph</span>
            )}
          </div>

          <div className="home-photography-copy">
            <p className="home-photo-location">
              {travelHighlight?.location ?? "From the archive"}
            </p>

            <h2>{recentPhoto?.caption ?? "Photographs of ordinary light."}</h2>

            <p className="home-description">
              A photograph is often a way of saying that a particular moment
              deserved to be noticed.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Latest journal entry */}
      <section className="home-journal">
        <div className="home-section-heading">
          <p className="section-label">Latest journal</p>

          <Link href="/journal" className="editorial-link">
            Open journal <span>→</span>
          </Link>
        </div>

        <div className="home-journal-layout">
          <p className="home-journal-date">
            {latestJournal?.date ?? "06 August 2026"}
          </p>

          <div>
            <h2>{latestJournal?.title ?? "Rain, tea, and a long walk"}</h2>

            <p className="home-description">
              {latestJournal?.excerpt ??
                "The rain arrived before breakfast. The garden looked different for about twenty minutes."}
            </p>

            <Link
              href={`/journal/${
                latestJournal?.slug ?? "rain-tea-and-a-long-walk"
              }`}
              className="editorial-link"
            >
              Read the entry <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Travel highlight */}
      <section className="home-travel">
        <div className="home-section-heading">
          <p className="section-label">Travel highlight</p>

          <Link href="/travel" className="editorial-link">
            Explore travel <span>→</span>
          </Link>
        </div>

        <div className="home-travel-layout">
          <div>
            <p className="home-photo-location">
              {travelHighlight?.location ?? "A place remembered"}
            </p>

            <h2>{travelHighlight?.title ?? "Places that stayed with me."}</h2>

            <p className="home-description">
              {travelHighlight?.description ??
                "Trips, streets, conversations, and quiet moments from places that left a trace."}
            </p>

            <Link
              href={`/travel/${travelHighlight?.slug ?? ""}`}
              className="editorial-link"
            >
              Enter this journey <span>→</span>
            </Link>
          </div>

          <div className="home-travel-details">
            <span>{travelHighlight?.dateRange ?? "A recent journey"}</span>
            <span>{travelHighlight?.country ?? "Across familiar borders"}</span>
          </div>
        </div>
      </section>

      {/* 8. Farm update */}
      <section className="home-farm">
        <div className="home-section-heading">
          <p className="section-label">Farm update</p>

          <Link href="/farm" className="editorial-link">
            Visit the Farm <span>→</span>
          </Link>
        </div>

        <div className="home-farm-layout">
          <div className="home-farm-number">02</div>

          <div>
            <h2>{farmUpdate?.title ?? "A record of things growing."}</h2>

            <p className="home-description">
              {farmUpdate?.excerpt ??
                "Seasonal notes, trees, planting, landscape, and patient progress."}
            </p>

            <Link
              href={`/farm/${farmUpdate?.slug ?? "a-tree-does-not-hurry"}`}
              className="editorial-link"
            >
              Read the Farm update <span>→</span>
            </Link>
          </div>

          <p className="home-farm-note">
            Growth is often invisible until one day it becomes impossible to
            miss.
          </p>
        </div>
      </section>

      {/* 9. Favorite books */}
      <section className="home-books">
        <div className="home-section-heading">
          <p className="section-label">Favorite books</p>

          <Link href="/library" className="editorial-link">
            Browse library <span>→</span>
          </Link>
        </div>

        <div className="home-books-list">
          {favoriteBooks.map((book, index) => (
            <Link
              key={book.slug}
              href={`/library/${book.slug}`}
              className="home-book-row"
            >
              <span className="home-book-number">
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className="home-book-title">{book.title}</span>

              <span className="home-book-author">{book.author}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 10. Newsletter placeholder */}
      <section className="home-newsletter">
        <p className="section-label">Occasional letters</p>

        <h2>A quiet note from the library.</h2>

        <p>
          A future newsletter for essays, books, photographs, and things worth
          returning to.
        </p>

        <span className="home-newsletter-status">Newsletter coming later</span>
      </section>
    </main>
  );
}
