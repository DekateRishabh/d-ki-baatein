import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { EditorialLink } from "@/components/editorial/editorial-link";
import { SectionLabel } from "@/components/editorial/section-label";
import { farmUpdates, getFarmUpdateBySlug } from "@/lib/farm";
import { getFarmContent } from "@/lib/farm-content";
import { FarmBeforeAfter } from "@/components/farm/farm-before-after";
import { FarmGallery } from "@/components/farm/farm-gallery";
import { FarmTimeline } from "@/components/farm/farm-timeline";

type FarmDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return farmUpdates.map((update) => ({
    slug: update.slug,
  }));
}

export async function generateMetadata({
  params,
}: FarmDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const update = getFarmUpdateBySlug(slug);

  if (!update) {
    return {};
  }

  return {
    title: update.title,
    description: update.excerpt,
  };
}

export default async function FarmDetailPage({ params }: FarmDetailPageProps) {
  const { slug } = await params;

  const update = getFarmUpdateBySlug(slug);

  if (!update) {
    notFound();
  }

  const farmContent = await getFarmContent(slug);
  const FarmContent = farmContent?.default;

  const currentIndex = farmUpdates.findIndex(
    (item) => item.slug === update.slug,
  );

  const previousUpdate =
    currentIndex > 0 ? farmUpdates[currentIndex - 1] : null;

  const nextUpdate =
    currentIndex < farmUpdates.length - 1
      ? farmUpdates[currentIndex + 1]
      : null;

  return (
    <main className="farm-detail-page">
      <header className="farm-detail-header">
        <Link href="/farm" className="farm-detail-back">
          ← Back to Farm
        </Link>

        <SectionLabel accent={update.season}>{update.type}</SectionLabel>

        <h1>{update.title}</h1>

        <p>{update.excerpt}</p>

        <div className="farm-detail-meta">
          <span>{update.date}</span>
          <span>{update.status}</span>
        </div>

        <div className="farm-detail-tags">
          {update.tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
      </header>

      <section className="farm-detail-intro">
        <p className="section-label">A progress note</p>

        <p>
          The Farm is a record of changes that happen slowly: growth, weather,
          construction, maintenance, and the gradual feeling of a place becoming
          more itself.
        </p>
      </section>

      <article className="farm-content">
        {FarmContent ? (
          <FarmContent />
        ) : (
          <>
            <p>{update.excerpt}</p>

            <p>
              This update is part of an ongoing record of the Farm and the
              things that continue to change there.
            </p>
          </>
        )}
      </article>

      <FarmGallery photos={update.photos} />

      <FarmBeforeAfter before={update.beforeImage} after={update.afterImage} />

      <FarmTimeline events={update.timeline} />

      <nav className="farm-detail-navigation">
        {previousUpdate ? (
          <Link
            href={`/farm/${previousUpdate.slug}`}
            className="farm-navigation-link"
          >
            <span>← Previous update</span>
            <strong>{previousUpdate.title}</strong>
          </Link>
        ) : (
          <span />
        )}

        {nextUpdate ? (
          <Link
            href={`/farm/${nextUpdate.slug}`}
            className="farm-navigation-link farm-navigation-next"
          >
            <span>Next update →</span>
            <strong>{nextUpdate.title}</strong>
          </Link>
        ) : (
          <Link
            href="/farm"
            className="farm-navigation-link farm-navigation-next"
          >
            <span>Return to archive →</span>
            <strong>All Farm updates</strong>
          </Link>
        )}
      </nav>

      <div className="farm-detail-footer">
        <EditorialLink href="/farm">Back to Farm archive</EditorialLink>
      </div>
    </main>
  );
}
