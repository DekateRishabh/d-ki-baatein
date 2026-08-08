"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { FarmUpdate } from "@/lib/farm";

type FarmBrowserProps = {
  updates: FarmUpdate[];
};

type FilterValue = "All" | string;

export function FarmBrowser({ updates }: FarmBrowserProps) {
  const [season, setSeason] = useState<FilterValue>("All");
  const [type, setType] = useState<FilterValue>("All");
  const [status, setStatus] = useState<FilterValue>("All");

  const seasons = Array.from(new Set(updates.map((update) => update.season)));

  const types = Array.from(new Set(updates.map((update) => update.type)));

  const statuses = Array.from(new Set(updates.map((update) => update.status)));

  const filteredUpdates = useMemo(() => {
    return updates.filter((update) => {
      const matchesSeason = season === "All" || update.season === season;

      const matchesType = type === "All" || update.type === type;

      const matchesStatus = status === "All" || update.status === status;

      return matchesSeason && matchesType && matchesStatus;
    });
  }, [updates, season, type, status]);

  function resetFilters() {
    setSeason("All");
    setType("All");
    setStatus("All");
  }

  return (
    <section className="farm-browser">
      <div className="farm-controls">
        <div className="farm-filter-group">
          <span className="farm-filter-label">Season</span>

          <div className="farm-filter-list">
            <button
              type="button"
              className={
                season === "All" ? "farm-filter is-active" : "farm-filter"
              }
              onClick={() => setSeason("All")}
              aria-pressed={season === "All"}
            >
              All
            </button>

            {seasons.map((item) => (
              <button
                key={item}
                type="button"
                className={
                  season === item ? "farm-filter is-active" : "farm-filter"
                }
                onClick={() => setSeason(item)}
                aria-pressed={season === item}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="farm-filter-group">
          <span className="farm-filter-label">Type</span>

          <div className="farm-filter-list">
            <button
              type="button"
              className={
                type === "All" ? "farm-filter is-active" : "farm-filter"
              }
              onClick={() => setType("All")}
              aria-pressed={type === "All"}
            >
              All
            </button>

            {types.map((item) => (
              <button
                key={item}
                type="button"
                className={
                  type === item ? "farm-filter is-active" : "farm-filter"
                }
                onClick={() => setType(item)}
                aria-pressed={type === item}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="farm-filter-group">
          <span className="farm-filter-label">Status</span>

          <div className="farm-filter-list">
            <button
              type="button"
              className={
                status === "All" ? "farm-filter is-active" : "farm-filter"
              }
              onClick={() => setStatus("All")}
              aria-pressed={status === "All"}
            >
              All
            </button>

            {statuses.map((item) => (
              <button
                key={item}
                type="button"
                className={
                  status === item ? "farm-filter is-active" : "farm-filter"
                }
                onClick={() => setStatus(item)}
                aria-pressed={status === item}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="farm-filter-summary">
          <span>{String(filteredUpdates.length).padStart(2, "0")} updates</span>

          {(season !== "All" || type !== "All" || status !== "All") && (
            <button type="button" className="farm-reset" onClick={resetFilters}>
              Clear filters
            </button>
          )}
        </div>
      </div>

      {filteredUpdates.length > 0 ? (
        <div className="farm-update-list">
          {filteredUpdates.map((update, index) => (
            <article key={update.slug} className="farm-update-card">
              <div className="farm-update-number">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="farm-update-date">
                <span>{update.date}</span>
                <span>{update.season}</span>
              </div>

              <div className="farm-update-content">
                <p className="section-label">{update.type}</p>

                <h3>
                  <Link href={`/farm/${update.slug}`}>{update.title}</Link>
                </h3>

                <p>{update.excerpt}</p>

                <div className="farm-update-footer">
                  <span className="farm-status">{update.status}</span>

                  <div className="farm-tags">
                    {update.tags.map((tag) => (
                      <span key={tag}>#{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="farm-empty">
          <h2>No updates found.</h2>

          <p>There are no Farm notes matching these filters.</p>

          <button
            type="button"
            className="editorial-link"
            onClick={resetFilters}
          >
            Reset filters <span>→</span>
          </button>
        </div>
      )}
    </section>
  );
}
