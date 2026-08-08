import type { Metadata } from "next";

import { ArchiveLayout } from "@/components/archive/archive-layout";
import { ArchiveList } from "@/components/archive/archive-list";
import { ContentCard } from "@/components/archive/content-card";
import { bookmarks } from "@/lib/bookmarks";

export const metadata: Metadata = {
  title: "Bookmarks",
  description:
    "Articles, tools, videos, websites, and resources worth returning to.",
};

export default function BookmarksPage() {
  return (
    <ArchiveLayout
      pageClassName="bookmarks-page"
      accent="लिंक"
      label="Bookmarks"
      title="Things worth returning to."
      description="Articles, tools, videos, websites, and resources I want to remember."
    >
      <ArchiveList className="bookmarks-list">
        {bookmarks.map((bookmark, index) => (
          <ContentCard
            key={bookmark.id}
            href={`/bookmarks/${bookmark.slug}`}
            number={String(index + 1).padStart(2, "0")}
            eyebrow={bookmark.category}
            title={bookmark.title}
            description={bookmark.description}
            meta={[bookmark.source, bookmark.savedDate]}
            tags={bookmark.tags}
          />
        ))}
      </ArchiveList>
    </ArchiveLayout>
  );
}
