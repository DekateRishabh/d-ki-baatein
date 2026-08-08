import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EditorialLink } from "@/components/editorial/editorial-link";
import { SectionLabel } from "@/components/editorial/section-label";
import { getIdeaBySlug, ideas } from "@/lib/ideas";

type IdeaPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function getStatusLabel(status: string) {
  if (status === "seed") return "Seed";
  if (status === "exploring") return "Exploring";
  if (status === "paused") return "Paused";
  return "Built";
}

export function generateStaticParams() {
  return ideas.map((idea) => ({
    slug: idea.slug,
  }));
}

export async function generateMetadata({
  params,
}: IdeaPageProps): Promise<Metadata> {
  const { slug } = await params;
  const idea = getIdeaBySlug(slug);

  if (!idea) {
    return {};
  }

  return {
    title: idea.title,
    description: idea.description,
  };
}

export default async function IdeaDetailPage({
  params,
}: IdeaPageProps) {
  const { slug } = await params;
  const idea = getIdeaBySlug(slug);

  if (!idea) {
    notFound();
  }

  return (
    <main className="idea-detail-page">
      <header className="idea-detail-header">
        <SectionLabel accent="विचार">
          {idea.category}
        </SectionLabel>

        <h1>{idea.title}</h1>

        <p>{idea.description}</p>

        <div className="idea-detail-meta">
          <span>{getStatusLabel(idea.status)}</span>
          <span>{idea.createdDate}</span>
        </div>

        <div className="idea-detail-tags">
          {idea.tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
      </header>

      <article className="idea-detail-content">
        <SectionLabel>Notes</SectionLabel>

        {idea.notes.map((note) => (
          <p key={note}>{note}</p>
        ))}
      </article>

      <div className="idea-back-link">
        <EditorialLink href="/ideas">
          Back to ideas
        </EditorialLink>
      </div>
    </main>
  );
}