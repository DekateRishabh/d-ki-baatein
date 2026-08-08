import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { EditorialLink } from "@/components/editorial/editorial-link";
import { JournalGallery } from "@/components/journal/journal-gallery";
import { SectionLabel } from "@/components/editorial/section-label";
import { getTripBySlug, trips } from "@/lib/travel";
import { getTravelContent } from "@/lib/travel-content";
import { TravelExpenses } from "@/components/travel/travel-expenses";
import { TravelRecommendations } from "@/components/travel/travel-recommendations";

type TripPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return trips.map((trip) => ({
    slug: trip.slug,
  }));
}

export async function generateMetadata({
  params,
}: TripPageProps): Promise<Metadata> {
  const { slug } = await params;
  const trip = getTripBySlug(slug);

  if (!trip) {
    return {};
  }

  return {
    title: trip.title,
    description: trip.description,
  };
}

export default async function TripDetailPage({ params }: TripPageProps) {
  const { slug } = await params;

  const trip = getTripBySlug(slug);

  if (!trip) {
    notFound();
  }

  const travelContent = await getTravelContent(slug);
  const TravelContent = travelContent?.default;

  const currentTripIndex = trips.findIndex((item) => item.slug === trip.slug);

  const previousTrip =
    currentTripIndex > 0 ? trips[currentTripIndex - 1] : null;

  const nextTrip =
    currentTripIndex < trips.length - 1 ? trips[currentTripIndex + 1] : null;

  return (
    <main className="travel-detail-page">
      <header className="travel-detail-header">
        <Link href="/travel" className="travel-detail-back">
          ← Back to Travel
        </Link>

        <SectionLabel accent="यात्रा">{trip.location}</SectionLabel>

        <h1>{trip.title}</h1>

        <p>{trip.description}</p>

        <div className="travel-detail-meta">
          <span>{trip.country}</span>
          <span>{trip.dateRange}</span>
        </div>

        <div className="travel-detail-tags">
          {trip.tags.map((tag) => (
            <span className="travel-tag" key={tag}>
              #{tag}
            </span>
          ))}
        </div>
      </header>

      {trip.photos.length > 0 && (
        <section className="travel-detail-photos">
          <SectionLabel>Photographs</SectionLabel>

          <JournalGallery
            images={trip.photos.map((photo) => ({
              src: photo.src,
              alt: photo.alt,
              caption: photo.caption,
            }))}
          />
        </section>
      )}

      <section className="travel-detail-content">
        <SectionLabel>Highlights</SectionLabel>

        <ul className="travel-highlights">
          {trip.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      </section>

      <article className="trip-detail-introduction trip-content">
        {TravelContent ? (
          <TravelContent />
        ) : (
          <>
            <p>
              A place is rarely remembered as a complete record. It stays as
              fragments: a particular light, a road taken without a plan, a
              conversation, or the feeling of sitting somewhere unfamiliar and
              slowly becoming comfortable.
            </p>

            <p>
              These photographs and notes are small attempts to preserve what
              remained after the journey ended.
            </p>
          </>
        )}
      </article>

      <TravelRecommendations recommendations={trip.recommendations} />

      <TravelExpenses expenses={trip.expenses} />

      <nav className="travel-trip-navigation">
        {previousTrip ? (
          <Link
            href={`/travel/${previousTrip.slug}`}
            className="travel-navigation-link"
          >
            <span>← Previous journey</span>
            <strong>{previousTrip.title}</strong>
          </Link>
        ) : (
          <span />
        )}

        {nextTrip ? (
          <Link
            href={`/travel/${nextTrip.slug}`}
            className="travel-navigation-link travel-navigation-next"
          >
            <span>Next journey →</span>
            <strong>{nextTrip.title}</strong>
          </Link>
        ) : (
          <Link
            href="/travel"
            className="travel-navigation-link travel-navigation-next"
          >
            <span>Return to archive →</span>
            <strong>All journeys</strong>
          </Link>
        )}
      </nav>

      <div className="travel-back-link">
        <EditorialLink href="/travel">Back to travel</EditorialLink>
      </div>
    </main>
  );
}
