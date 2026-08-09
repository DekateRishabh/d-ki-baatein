import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArticleMeta } from "@/components/editorial/article-meta";
import { Divider } from "@/components/editorial/divider";
import { EditorialLink } from "@/components/editorial/editorial-link";
import { SectionLabel } from "@/components/editorial/section-label";
import MarkdownContent from "@/components/editorial/markdown-content";
import { EssayToc } from "@/components/essays/essay-toc";
import { ReadingProgress } from "@/components/essays/reading-progress";
import { getPublishedEssayBySlug, getPublishedEssaySlugs } from "@/lib/essays";

type EssayPageProps = { params: Promise<{ slug: string }> };
export async function generateStaticParams() { return getPublishedEssaySlugs(); }
export async function generateMetadata({ params }: EssayPageProps): Promise<Metadata> { const { slug } = await params; const essay = await getPublishedEssayBySlug(slug); return essay ? { title: essay.title, description: essay.description } : {}; }

export default async function EssayPage({ params }: EssayPageProps) {
  const { slug } = await params;
  const essay = await getPublishedEssayBySlug(slug);
  if (!essay) notFound();
  return <><ReadingProgress /><article className="essay-page"><header className="essay-header"><SectionLabel accent="लेख">{essay.category}</SectionLabel><h1>{essay.title}</h1><p className="essay-description">{essay.description}</p><ArticleMeta type={essay.type} readingTime={essay.readingTime} date={essay.date} updated={essay.updated} /></header><div className="essay-layout"><EssayToc items={[]} /><div className="essay-content"><figure className="essay-cover-image"><Image src={essay.coverUrl ?? "/images/essays/the-things-that-stay.jpg"} alt={essay.coverAlt ?? essay.title} fill priority sizes="(max-width: 760px) 100vw, 720px" /><figcaption>{essay.coverCaption ?? ""}</figcaption></figure><div className="essay-body"><MarkdownContent content={essay.bodyMarkdown} /></div><Divider label="End of essay" /><section className="related-essays"><SectionLabel>Continue reading</SectionLabel><h2>More from the library</h2><p>More essays about memory, attention, places, and the ordinary details that shape a life.</p><EditorialLink href="/essays">Browse all essays</EditorialLink></section></div></div></article></>;
}
