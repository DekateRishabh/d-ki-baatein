import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleMeta } from "@/components/editorial/article-meta";
import { EditorialLink } from "@/components/editorial/editorial-link";
import { SectionLabel } from "@/components/editorial/section-label";
import { bookmarks, getBookmarkBySlug } from "@/lib/bookmarks";

type BookmarkPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return bookmarks.map((bookmark) => ({
    slug: bookmark.slug,
  }));
}

export async function generateMetadata({
  params,
}: BookmarkPageProps): Promise<Metadata> {
  const { slug } = await params;
  const bookmark = getBookmarkBySlug(slug);

  if (!bookmark) {
    return {};
  }

  return {
    title: bookmark.title,
    description: bookmark.description,
  };
}

export default async function BookmarkDetailPage({
  params,
}: BookmarkPageProps) {
  const { slug } = await params;
  const bookmark = getBookmarkBySlug(slug);

  if (!bookmark) {
    notFound();
  }

  return (
    <main className="bookmark-detail-page">
      <header className="bookmark-detail-header">
        <SectionLabel accent="链接">{bookmark.category}</SectionLabel>

        <h1>{bookmark.title}</h1>

        <p>{bookmark.description}</p>

        <ArticleMeta
          type="Bookmark"
          readingTime="Saved reference"
          date={bookmark.savedDate}
        />

        <div className="bookmark-detail-tags">
          {bookmark.tags.map((tag) => (
            <Link href={`/bookmarks?tag=${encodeURIComponent(tag)}`} key={tag}>
              #{tag}
            </Link>
          ))}
        </div>
      </header>

      <div className="bookmark-detail-content">
        <section className="bookmark-source-preview">
          <div className="bookmark-source-icon">↗</div>

          <div>
            <span>Source preview</span>
            <strong>{bookmark.source}</strong>
            <small>{bookmark.domain}</small>
          </div>
        </section>

        <section className="bookmark-detail-section">
          <SectionLabel>Why I saved this</SectionLabel>

          <p className="bookmark-notes">{bookmark.notes}</p>
        </section>

        <section className="bookmark-detail-section">
          <SectionLabel>Original source</SectionLabel>

          <EditorialLink href={bookmark.url} external>
            Visit {bookmark.domain}
          </EditorialLink>
        </section>
      </div>

      <div className="bookmark-back-link">
        <EditorialLink href="/bookmarks">Back to bookmarks</EditorialLink>
      </div>
    </main>
  );
}
