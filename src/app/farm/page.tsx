import type { Metadata } from "next";
import Link from "next/link";

import { farmUpdates } from "@/lib/farm";
import { FarmBrowser } from "@/components/farm/farm-browser";

export const metadata: Metadata = {
  title: "Farm",
  description:
    "Seasonal notes, planting, trees, landscape, and patient progress.",
};

export default function FarmPage() {
  return (
    <main className="farm-page">
      <header className="farm-intro">
        <p className="section-label">Farm archive</p>

        <h1>A record of things growing.</h1>

        <p>
          Notes on trees, planting, landscape, construction, light, and the slow
          work of making a place feel lived in.
        </p>
      </header>

      <section className="farm-principle">
        <p className="section-label">A patient record</p>

        <blockquote>
          “Growth is often invisible until one day it becomes impossible to
          miss.”
        </blockquote>

        <p>
          The Farm is not a project measured only by finished results. It is a
          record of attention: what was planted, what changed, what failed, and
          what continued quietly.
        </p>
      </section>

      <section className="farm-archive" aria-labelledby="farm-updates-title">
        <div className="farm-section-heading">
          <div>
            <p className="section-label">Progress logs</p>
            <h2 id="farm-updates-title">Small changes over time.</h2>
          </div>

          <span className="farm-count">
            {String(farmUpdates.length).padStart(2, "0")} updates
          </span>
        </div>

        <FarmBrowser updates={farmUpdates} />
      </section>
    </main>
  );
}
