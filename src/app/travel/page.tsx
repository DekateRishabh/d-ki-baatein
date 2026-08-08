import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { TravelMap } from "@/components/travel/travel-map";
import { TravelTimeline } from "@/components/travel/travel-timeline";
import { trips } from "@/lib/travel";

export const metadata: Metadata = {
  title: "Travel",
  description:
    "Places, journeys, photographs, and stories that have stayed with me.",
};

function imagePath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

export default function TravelPage() {
  return (
    <main className="travel-page">
      <header className="travel-intro">
        <p className="section-label">Travel archive</p>

        <h1>Places that stayed with me.</h1>

        <p>
          A collection of journeys, streets, coastlines, conversations, and
          quiet moments from places that left a trace.
        </p>
      </header>

      <TravelMap trips={trips} />

      <section className="travel-archive">
        <div className="travel-section-heading">
          <div>
            <p className="section-label">Selected journeys</p>
            <h2>A few places, remembered slowly.</h2>
          </div>

          <span className="travel-count">
            {String(trips.length).padStart(2, "0")} journeys
          </span>
        </div>

        <div className="travel-list">
          {trips.map((trip, index) => (
            <article key={trip.slug} className="travel-card">
              <Link href={`/travel/${trip.slug}`} className="travel-card-image">
                <Image
                  src={imagePath(trip.coverImage)}
                  alt={trip.title}
                  fill
                  sizes="(max-width: 760px) 100vw, 42vw"
                />
              </Link>

              <div className="travel-card-content">
                <div className="travel-card-meta">
                  <span>{String(index + 1).padStart(2, "0")}</span>

                  <span>{trip.dateRange}</span>
                </div>

                <p className="section-label">
                  {trip.location}, {trip.country}
                </p>

                <h3>
                  <Link href={`/travel/${trip.slug}`}>{trip.title}</Link>
                </h3>

                <p className="travel-card-description">{trip.description}</p>

                <div className="travel-card-tags">
                  {trip.tags.map((tag) => (
                    <span key={tag}>#{tag}</span>
                  ))}
                </div>

                <Link href={`/travel/${trip.slug}`} className="editorial-link">
                  Read the journey <span>→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
        <TravelTimeline trips={trips} />
      </section>
    </main>
  );
}
