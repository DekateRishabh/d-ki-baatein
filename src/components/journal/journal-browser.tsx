"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import type { JournalEntry } from "@/lib/journal";

type JournalBrowserProps = {
  entries: JournalEntry[];
  initialQuery?: string;
};

export function JournalBrowser({
  entries,
  initialQuery = "",
}: JournalBrowserProps) {
  const years = Array.from(new Set(entries.map((entry) => entry.year))).sort(
    (a, b) => b - a,
  );

  const moods = Array.from(
    new Set(
      entries
        .map((entry) => entry.mood)
        .filter((mood): mood is string => Boolean(mood)),
    ),
  ).sort();

  const categories = Array.from(
    new Set(entries.map((entry) => entry.category)),
  ).sort();

  const [query, setQuery] = useState(initialQuery);
  const [year, setYear] = useState("all");
  const [mood, setMood] = useState("all");
  const [category, setCategory] = useState("all");

  const filteredEntries = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();

    return entries.filter((entry) => {
      const matchesYear = year === "all" || entry.year === Number(year);

      const matchesMood = mood === "all" || entry.mood === mood;

      const matchesCategory = category === "all" || entry.category === category;

      const searchableText = [
        entry.title,
        entry.excerpt,
        entry.category,
        entry.mood,
        entry.location,
        ...entry.tags,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesQuery =
        normalizedQuery.length === 0 ||
        searchableText.includes(normalizedQuery);

      return matchesYear && matchesMood && matchesCategory && matchesQuery;
    });
  }, [category, entries, mood, query, year]);

  const groupedEntries = filteredEntries.reduce<Record<number, JournalEntry[]>>(
    (groups, entry) => {
      if (!groups[entry.year]) {
        groups[entry.year] = [];
      }

      groups[entry.year].push(entry);

      return groups;
    },
    {},
  );

  const groupedYears = Object.keys(groupedEntries)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <section className="journal-browser">
      <div className="journal-controls">
        <label className="journal-search">
          <span className="sr-only">Search journal</span>

          <input
            type="search"
            placeholder="Search journal"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <div className="journal-selects">
          <label>
            <span>Year</span>
            <select
              value={year}
              onChange={(event) => setYear(event.target.value)}
            >
              <option value="all">All years</option>

              {years.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Mood</span>
            <select
              value={mood}
              onChange={(event) => setMood(event.target.value)}
            >
              <option value="all">All moods</option>

              {moods.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Category</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="all">All categories</option>

              {categories.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="journal-results-meta">
        {filteredEntries.length}{" "}
        {filteredEntries.length === 1 ? "entry" : "entries"}
      </div>

      {groupedYears.length > 0 ? (
        <div className="journal-archive">
          {groupedYears.map((groupYear) => (
            <section className="journal-year" key={groupYear}>
              <div className="journal-year-label">{groupYear}</div>

              <div className="journal-entries">
                {groupedEntries[groupYear].map((entry) => (
                  <Link
                    href={`/journal/${entry.slug}`}
                    className="journal-entry"
                    key={entry.slug}
                  >
                    <div className="journal-entry-date">
                      <span>{entry.date}</span>
                      <span>{entry.mood}</span>
                    </div>

                    <div className="journal-entry-content">
                      <p className="journal-entry-category">{entry.category}</p>

                      <h2>{entry.title}</h2>

                      <p>{entry.excerpt}</p>

                      <div className="journal-entry-tags">
                        {entry.tags.map((tag) => (
                          <span key={tag}>#{tag}</span>
                        ))}
                      </div>
                    </div>

                    <span className="journal-entry-arrow">→</span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="journal-empty">
          <h2>No journal entries found.</h2>
          <p>Try changing the filters or search phrase.</p>
        </div>
      )}
    </section>
  );
}
