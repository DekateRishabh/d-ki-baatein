import Image from "next/image";
import { trips } from "@/lib/travel";

export function TravelOverview() {
  return (
    <section className="travel-overview">
      <div className="travel-overview-text">
        <p className="section-label">Map of visits</p>

        <h2>Where these stories live.</h2>

        <p>
          A quiet map of cities and coastlines that have stayed with me —
          not a complete record, just the places that left a trace.
        </p>
      </div>

      <div className="travel-overview-grid">
        {trips.map((trip) => (
          <figure
            className="travel-photo-card"
            key={trip.slug}
          >
            <div className="travel-photo-image">
              <Image
                src={trip.coverImage}
                alt={`${trip.location} — ${trip.title}`}
                fill
                sizes="(max-width: 760px) 100vw, 260px"
              />
            </div>

            <figcaption>
              <span>{trip.location}</span>
              <strong>{trip.title}</strong>
              <small>{trip.dateRange}</small>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}