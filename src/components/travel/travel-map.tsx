import Link from "next/link";

import type { Trip } from "@/lib/travel";

type TravelMapProps = {
  trips: Trip[];
};

export function TravelMap({ trips }: TravelMapProps) {
  return (
    <section className="travel-map-section">
      <div className="travel-map-copy">
        <p className="section-label">Places lived in memory</p>

        <h2>A quiet map of where the stories began.</h2>

        <p>
          Not every place needs a detailed record. Some places remain as a
          colour, a road, a conversation, or a particular kind of light.
        </p>
      </div>

      <div className="travel-map">
        <svg
          viewBox="0 0 1000 520"
          role="img"
          aria-label="Decorative world map showing visited places"
        >
          <path
            className="map-land"
            d="M107 130l42-31 72 8 39 34-18 36-58 8-36 35-45-28z"
          />

          <path
            className="map-land"
            d="M240 232l55-12 54 28-11 48-35 40-29 76-31-15 8-63-27-42z"
          />

          <path
            className="map-land"
            d="M453 119l46-20 70 7 28 29-22 23-62-7-27 28-39-18z"
          />

          <path
            className="map-land"
            d="M528 194l58-18 66 30 22 58-38 43-17 91-43 48-32-73 10-68-29-57z"
          />

          <path
            className="map-land"
            d="M690 132l61-16 89 27 51 39-11 42-79-10-46 27-54-34z"
          />

          <path
            className="map-land"
            d="M809 274l58-11 60 28-14 48-50 14-42-27z"
          />
        </svg>

        <div className="travel-map-markers">
          {trips.map((trip) => (
            <Link
              key={trip.slug}
              href={`/travel/${trip.slug}`}
              className="travel-map-marker"
              style={{
                left: `${trip.mapPosition.left}%`,
                top: `${trip.mapPosition.top}%`,
              }}
              aria-label={`Open trip: ${trip.title}`}
            >
              <span />
              <strong>{trip.location}</strong>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
