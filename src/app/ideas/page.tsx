import type { Metadata } from "next";

import { ArchiveLayout } from "@/components/archive/archive-layout";
import { ArchiveList } from "@/components/archive/archive-list";
import { ContentCard } from "@/components/archive/content-card";
import { ideas } from "@/lib/ideas";

export const metadata: Metadata = {
  title: "Ideas",
  description:
    "Business ideas, observations, unfinished concepts, and questions without final answers.",
};

function getStatusLabel(status: string) {
  if (status === "seed") return "Seed";
  if (status === "exploring") return "Exploring";
  if (status === "paused") return "Paused";
  return "Built";
}

export default function IdeasPage() {
  return (
    <ArchiveLayout
      pageClassName="ideas-page"
      accent="विचार"
      label="Ideas"
      title="Thoughts still becoming themselves."
      description="Business ideas, observations, unfinished concepts, and questions without final answers."
    >
      <ArchiveList className="ideas-list">
        {ideas.map((idea, index) => (
          <ContentCard
            key={idea.slug}
            href={`/ideas/${idea.slug}`}
            number={String(index + 1).padStart(2, "0")}
            eyebrow={idea.category}
            title={idea.title}
            description={idea.description}
            meta={[getStatusLabel(idea.status), idea.createdDate]}
            tags={idea.tags}
          />
        ))}
      </ArchiveList>
    </ArchiveLayout>
  );
}
