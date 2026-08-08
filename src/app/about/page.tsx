import type { Metadata } from "next";
import Link from "next/link";

import { SectionLabel } from "@/components/editorial/section-label";

export const metadata: Metadata = {
  title: "About",
  description:
    "About D Ki Baatein and the person behind this personal library.",
};

export default function AboutPage() {
  return (
    <main className="about-page">
      <header className="about-header">
        <SectionLabel accent="परिचय">About this place</SectionLabel>

        <h1>Hello, I’m D.</h1>

        <p className="about-lede">
          D Ki Baatein is a personal library of ideas, stories, books,
          photographs, projects, and memories collected over time.
        </p>
      </header>

      <div className="about-content">
        <section className="about-section">
          <SectionLabel>Why this exists</SectionLabel>

          <div className="about-prose">
            <p>This website is a place for the things I do not want to lose.</p>

            <p>
              A sentence underlined in a book. A photograph from an ordinary
              afternoon. A place that stayed with me. A project that taught me
              something. An idea that is not ready yet.
            </p>

            <p>
              I wanted a space that could hold these things quietly, without
              turning them into a stream of constant updates.
            </p>
          </div>
        </section>

        <section className="about-section">
          <SectionLabel>Interested in</SectionLabel>

          <ul className="about-interests">
            <li>Building thoughtful software</li>
            <li>Reading slowly</li>
            <li>Growing things</li>
            <li>Visiting unfamiliar places</li>
            <li>Photographing ordinary light</li>
            <li>Preserving small memories</li>
          </ul>
        </section>

        <section className="about-section">
          <SectionLabel>A small belief</SectionLabel>

          <blockquote className="about-quote">
            A personal archive is an act of attention.
          </blockquote>
        </section>

        <section className="about-section about-links-section">
          <SectionLabel>Explore</SectionLabel>

          <div className="about-links">
            <Link href="/essays">Read the essays →</Link>
            <Link href="/library">Browse the library →</Link>
            <Link href="/journal">Visit the journal →</Link>
            <Link href="/now">See what I’m doing now →</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
