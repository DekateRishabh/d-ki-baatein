"use client";

import { useMemo, useState } from "react";

import { BookCard } from "@/components/books/book-card";
import type { Book, BookStatus } from "@/lib/books";

type FilterValue = "all" | BookStatus;

type LibraryBrowserProps = {
  books: Book[];
};

const filters: {
  label: string;
  value: FilterValue;
}[] = [
  { label: "All books", value: "all" },
  { label: "Finished", value: "finished" },
  { label: "Reading", value: "reading" },
  { label: "Wishlist", value: "wishlist" },
];

export function LibraryBrowser({
  books,
}: LibraryBrowserProps) {
  const [activeFilter, setActiveFilter] =
    useState<FilterValue>("all");

  const [query, setQuery] = useState("");

  const filteredBooks = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();

    return books.filter((book) => {
      const matchesFilter =
        activeFilter === "all" ||
        book.status === activeFilter;

      const matchesQuery =
        normalizedQuery.length === 0 ||
        book.title.toLowerCase().includes(normalizedQuery) ||
        book.author.toLowerCase().includes(normalizedQuery) ||
        book.category.toLowerCase().includes(normalizedQuery);

      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, books, query]);

  return (
    <section className="library-browser">
      <div className="library-controls">
        <div className="library-filters" role="group">
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              className={
                activeFilter === filter.value
                  ? "library-filter is-active"
                  : "library-filter"
              }
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <label className="library-search">
          <span className="sr-only">Search books</span>

          <input
            type="search"
            placeholder="Search books or authors"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>

      <div className="library-results-meta">
        {filteredBooks.length}{" "}
        {filteredBooks.length === 1 ? "book" : "books"}
      </div>

      {filteredBooks.length > 0 ? (
        <div className="books-grid">
          {filteredBooks.map((book) => (
            <BookCard key={book.slug} book={book} />
          ))}
        </div>
      ) : (
        <div className="library-empty">
          <h2>No books found</h2>
          <p>Try a different title, author, or filter.</p>
        </div>
      )}
    </section>
  );
}