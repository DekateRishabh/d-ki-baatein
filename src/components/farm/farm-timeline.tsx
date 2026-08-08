import type { FarmTimelineEvent } from "@/lib/farm";

type FarmTimelineProps = {
  events?: FarmTimelineEvent[];
};

export function FarmTimeline({
  events,
}: FarmTimelineProps) {
  if (!events?.length) {
    return null;
  }

  return (
    <section className="farm-detail-timeline">
      <div className="section-label-row">
        <span className="section-label-accent">Time</span>
        <span className="section-label-line" />
        <span className="section-label-text">
          Growth timeline
        </span>
      </div>

      <div className="farm-detail-timeline-list">
        {events.map((event) => (
          <article
            key={`${event.date}-${event.title}`}
            className="farm-detail-timeline-item"
          >
            <p>{event.date}</p>

            <div>
              <h3>{event.title}</h3>
              <span>{event.description}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}