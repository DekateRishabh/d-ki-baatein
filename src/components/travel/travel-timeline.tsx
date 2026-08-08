import Link from "next/link";

import type { Trip } from "@/lib/travel";

type TravelTimelineProps = {
  trips: Trip[];
};

export function TravelTimeline({
  trips,
}: TravelTimelineProps) {
  const sortedTrips = [...trips].sort(
    (a, b) => b.year - a.year
  );

  return (
    <section className="travel-timeline">
      <div className="section-label-row">
        <span className="section-label-accent">यात्रा</span>
        <span className="section-label-line" />
        <span className="section-label-text">
          Travel timeline
        </span>
      </div>

      <h2>Journeys across time.</h2>

      <div className="travel-timeline-list">
        {sortedTrips.map((trip) => (
          <Link
            key={trip.slug}
            href={`/travel/${trip.slug}`}
            className="travel-timeline-item"
          >
            <span className="travel-timeline-year">
              {trip.year}
            </span>

            <span className="travel-timeline-title">
              {trip.title}
            </span>

            <span className="travel-timeline-location">
              {trip.location}, {trip.country}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}