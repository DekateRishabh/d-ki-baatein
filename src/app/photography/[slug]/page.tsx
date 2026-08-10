import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPhotographBySlug, photographs } from "@/lib/photography";

type PhotographyDetailPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return photographs.map((photograph) => ({ slug: photograph.slug })); }

export async function generateMetadata({ params }: PhotographyDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const photograph = getPhotographBySlug(slug);
  if (!photograph) return { title: "Photography" };
  return { title: photograph.title, description: photograph.description, openGraph: { title: `${photograph.title} — D Ki Baatein`, description: photograph.description, type: "article", images: [{ url: photograph.src, alt: photograph.alt }] } };
}

export default async function PhotographyDetailPage({ params }: PhotographyDetailPageProps) {
  const { slug } = await params;
  const photograph = getPhotographBySlug(slug);
  if (!photograph) notFound();
  const currentIndex = photographs.findIndex((item) => item.slug === photograph.slug);
  const previousPhotograph = currentIndex > 0 ? photographs[currentIndex - 1] : null;
  const nextPhotograph = currentIndex < photographs.length - 1 ? photographs[currentIndex + 1] : null;
  const relatedPhotographs = photographs.filter((item) => item.slug !== photograph.slug).filter((item) => item.tags.some((tag) => photograph.tags.includes(tag))).slice(0, 2);
  return (
    <main className="photography-detail-page">
      <header className="photography-detail-header"><Link href="/photography" className="photography-back-link">← Back to photography</Link><p className="section-label">{photograph.collection}</p><h1>{photograph.title}</h1><div className="photography-detail-meta"><span>{photograph.collection}</span><span>{photograph.location}</span><span>{photograph.date}</span></div></header>
      <figure className="photography-detail-image"><Image src={photograph.src} alt={photograph.alt} fill priority sizes="100vw" /><figcaption>{photograph.caption}</figcaption></figure>
      <section className="photography-detail-story"><div className="photography-detail-label"><p className="section-label">A photograph</p></div><div className="photography-detail-copy"><p className="photography-detail-caption">{photograph.caption}</p><p>{photograph.description}</p><div className="photography-detail-tags">{photograph.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div></div></section>
      {relatedPhotographs.length > 0 && <section className="related-photography" aria-labelledby="related-photography-title"><div className="section-label-row"><span className="section-label-accent">More</span><span className="section-label-line" /><span className="section-label-text">Related photographs</span></div><div className="related-photography-grid">{relatedPhotographs.map((related) => <Link key={related.slug} href={`/photography/${related.slug}`} className="related-photography-card"><div className="related-photography-image"><Image src={related.src} alt={related.alt} fill sizes="(max-width: 760px) 100vw, 40vw" /></div><p className="section-label">{related.location}</p><h2>{related.title}</h2></Link>)}</div></section>}
      <nav className="photography-detail-navigation">{previousPhotograph ? <Link href={`/photography/${previousPhotograph.slug}`} className="photography-navigation-link"><span>← Previous photograph</span><strong>{previousPhotograph.title}</strong></Link> : <span />}{nextPhotograph ? <Link href={`/photography/${nextPhotograph.slug}`} className="photography-navigation-link photography-navigation-next"><span>Next photograph →</span><strong>{nextPhotograph.title}</strong></Link> : <Link href="/photography" className="photography-navigation-link photography-navigation-next"><span>Return to archive →</span><strong>All photographs</strong></Link>}</nav>
    </main>
  );
}
