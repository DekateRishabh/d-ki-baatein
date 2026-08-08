import type { Metadata } from "next";
import Link from "next/link";

import { SectionLabel } from "@/components/editorial/section-label";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with D through D Ki Baatein.",
};

export default function ContactPage() {
  return (
    <main className="contact-page">
      <header className="contact-header">
        <SectionLabel accent="बात करें">Say hello</SectionLabel>

        <h1>Let’s have a thoughtful conversation.</h1>

        <p>
          For ideas, collaborations, questions, or simply a good conversation
          about books and places.
        </p>
      </header>

      <div className="contact-layout">
        <section className="contact-main">
          <SectionLabel>Write to me</SectionLabel>

          <a href="mailto:hello@dkibaatein.com" className="contact-email">
            hello@dkibaatein.com
          </a>

          <p className="contact-note">
            Replace this email address with your real email address before
            publishing the website.
          </p>
        </section>

        <aside className="contact-aside">
          <SectionLabel>Elsewhere</SectionLabel>

          <div className="contact-links">
            <a href="https://github.com" target="_blank" rel="noreferrer">
              GitHub ↗
            </a>

            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
              LinkedIn ↗
            </a>

            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noreferrer"
            >
              Instagram ↗
            </a>
          </div>
        </aside>
      </div>

      <div className="contact-footer">
        <Link href="/">Return home →</Link>
      </div>
    </main>
  );
}
