"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { deleteMedia } from "@/lib/admin/media-actions";
import styles from "./media-gallery.module.css";

type MediaItem = {
  id: string;
  filename: string;
  kind: string;
  mime_type: string | null;
  size_bytes: number | null;
  public_url: string | null;
  storage_path: string;
  caption: string | null;
  alt_text: string | null;
  is_public: boolean;
  created_at: string;
};

function formatSize(bytes: number | null) {
  if (!bytes) return "Unknown size";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function MediaGallery({ media }: { media: MediaItem[] }) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("all");

  const kinds = useMemo(
    () => ["all", ...Array.from(new Set(media.map((item) => item.kind)))],
    [media],
  );

  const filteredMedia = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return media.filter((item) => {
      const matchesKind = kind === "all" || item.kind === kind;
      const matchesQuery =
        !normalizedQuery ||
        item.filename.toLowerCase().includes(normalizedQuery) ||
        item.caption?.toLowerCase().includes(normalizedQuery) ||
        item.alt_text?.toLowerCase().includes(normalizedQuery);
      return matchesKind && matchesQuery;
    });
  }, [kind, media, query]);

  return (
    <>
      <div className={styles.controls}>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search media…"
          aria-label="Search media"
        />
        <select
          value={kind}
          onChange={(event) => setKind(event.target.value)}
          aria-label="Filter media by type"
        >
          {kinds.map((item) => (
            <option value={item} key={item}>
              {item === "all" ? "All types" : item}
            </option>
          ))}
        </select>
        <span>{filteredMedia.length} of {media.length} files</span>
      </div>

      {filteredMedia.length ? (
        <div className={styles.grid} data-count={filteredMedia.length}>
          {filteredMedia.map((item) => (
            <article className={styles.card} key={item.id}>
              <div className={styles.preview}>
                {item.kind === "image" && item.public_url ? (
                  <img
                    src={item.public_url}
                    alt={item.alt_text ?? item.filename}
                  />
                ) : (
                  <span>{item.kind}</span>
                )}
              </div>
              <div className={styles.cardBody}>
                <p className="section-label">
                  {item.kind} · {item.is_public ? "public" : "private"}
                </p>
                <p className={styles.altText}>{item.alt_text ?? "Not set"}</p>
                <p>{item.caption ?? item.mime_type ?? "No caption"}</p>
                <small>{formatSize(item.size_bytes)} · {formatDate(item.created_at)}</small>
                <div className={styles.actions}>
                  <Link href={`/admin/media/${item.id}/edit`}>Edit</Link>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete ${item.filename}? This cannot be undone.`)) {
                        void deleteMedia(item.id, item.storage_path);
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className={styles.empty}>No matching media found.</p>
      )}
    </>
  );
}
