import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleMeta } from "@/components/editorial/article-meta";
import { Divider } from "@/components/editorial/divider";
import { EditorialLink } from "@/components/editorial/editorial-link";
import { SectionLabel } from "@/components/editorial/section-label";
import { getEssayBySlug, essays } from "@/lib/essays";
import Image from "next/image";

import { EssayToc } from "@/components/essays/essay-toc";
import { ReadingProgress } from "@/components/essays/reading-progress";

import EssayContent from "@/content/essays/the-things-that-stay.mdx";

type EssayPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return essays.map((essay) => ({
    slug: essay.slug,
  }));
}

export async function generateMetadata({
  params,
}: EssayPageProps): Promise<Metadata> {
  const { slug } = await params;
  const essay = getEssayBySlug(slug);

  if (!essay) {
    return {};
  }

  return {
    title: essay.title,
    description: essay.description,
  };
}

export default async function EssayPage({ params }: EssayPageProps) {
  const { slug } = await params;
  const essay = getEssayBySlug(slug);

  if (!essay) {
    notFound();
  }

  return (
    <>
      <ReadingProgress />
      <article className="essay-page">
        <header className="essay-header">
          <SectionLabel accent="लेख">{essay.category}</SectionLabel>

          <h1>{essay.title}</h1>

          <p className="essay-description">{essay.description}</p>

          <ArticleMeta
            type={essay.type}
            readingTime={essay.readingTime}
            date={essay.date}
            updated={essay.updated}
          />
        </header>

        <div className="essay-layout">
          <EssayToc
            items={[
              {
                id: "the-room-remembers-before-we-do",
                label: "The room remembers",
              },
              {
                id: "the-objects-we-carry",
                label: "The objects we carry",
              },
              {
                id: "a-quiet-form-of-belonging",
                label: "A quiet form of belonging",
              },
              {
                id: "what-remains",
                label: "What remains",
              },
            ]}
          />

          <div className="essay-content">
            <figure className="essay-cover-image">
              <Image
                src="/images/essays/the-things-that-stay.jpg"
                alt="A quiet room in afternoon light"
                fill
                priority
                sizes="(max-width: 760px) 100vw, 720px"
              />

              <figcaption>A room in the afternoon</figcaption>
            </figure>

            <div className="essay-body">
              {slug === "the-things-that-stay" && <EssayContent />}
            </div>

            <Divider label="End of essay" />

            <section className="related-essays">
              <SectionLabel>Continue reading</SectionLabel>

              <h2>More from the library</h2>

              <p>
                More essays about memory, attention, places, and the ordinary
                details that shape a life.
              </p>

              <EditorialLink href="/essays">Browse all essays</EditorialLink>
            </section>
          </div>
        </div>
      </article>
    </>
  );
}
