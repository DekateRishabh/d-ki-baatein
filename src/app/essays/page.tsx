import { ArchiveLayout } from "@/components/archive/archive-layout";
import { ArchiveList } from "@/components/archive/archive-list";
import { ContentCard } from "@/components/archive/content-card";
import { essays } from "@/lib/essays";

export default function EssaysPage() {
  return (
    <ArchiveLayout
      pageClassName="archive-page"
      accent="लेख"
      label="Writing"
      title="Essays"
      description="Long-form notes on memory, attention, technology, places, and the small details that shape a life."
    >
      <ArchiveList className="essay-list">
        {essays.map((essay, index) => (
          <ContentCard
            key={essay.slug}
            href={`/essays/${essay.slug}`}
            number={String(index + 1).padStart(2, "0")}
            eyebrow={essay.category}
            title={essay.title}
            description={essay.description}
            meta={[essay.date, essay.readingTime]}
          />
        ))}
      </ArchiveList>
    </ArchiveLayout>
  );
}
