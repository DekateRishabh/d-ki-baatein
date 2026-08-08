import type { TravelRecommendation } from "@/lib/travel";

type TravelRecommendationsProps = {
  recommendations?: TravelRecommendation[];
};

export function TravelRecommendations({
  recommendations,
}: TravelRecommendationsProps) {
  if (!recommendations?.length) {
    return null;
  }

  return (
    <section className="travel-recommendations">
      <div className="section-label-row">
        <span className="section-label-accent">सुझाव</span>
        <span className="section-label-line" />
        <span className="section-label-text">Recommendations</span>
      </div>

      <div className="travel-recommendation-list">
        {recommendations.map((recommendation) => (
          <article
            key={`${recommendation.category}-${recommendation.title}`}
            className="travel-recommendation"
          >
            <p className="section-label">{recommendation.category}</p>

            <h3>{recommendation.title}</h3>

            <p>{recommendation.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
