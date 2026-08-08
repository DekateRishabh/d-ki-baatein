import type { Metadata } from "next";
import Link from "next/link";

import { SectionLabel } from "@/components/editorial/section-label";
import { nowSections, nowUpdated } from "@/lib/now";

export const metadata: Metadata = {
  title: "Now",
  description:
    "What I am currently reading, building, learning, watching, listening to, and thinking about.",
};

export default function NowPage() {
  return (
    <main className="now-page">
      <header className="now-header">
        <SectionLabel accent="इस समय">Current attention</SectionLabel>

        <h1>Now</h1>

        <p>A small record of what currently has my attention.</p>

        <span className="now-updated">Updated {nowUpdated}</span>
      </header>

      <section className="now-list">
        {nowSections.map((section, index) => (
          <article className="now-item" key={section.title}>
            <div className="now-item-number">
              {String(index + 1).padStart(2, "0")}
            </div>

            <div className="now-item-content">
              <h2>{section.title}</h2>

              <p>{section.content}</p>

              {section.link && (
                <Link href={section.link.href} className="editorial-link">
                  {section.link.label} <span>→</span>
                </Link>
              )}
            </div>
          </article>
        ))}
      </section>

      <footer className="now-footer">
        <p>
          This page changes slowly. It is updated when my attention changes, not
          because the calendar says it should.
        </p>
      </footer>
    </main>
  );
}
