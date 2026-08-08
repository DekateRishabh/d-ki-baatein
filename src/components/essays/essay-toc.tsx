"use client";

import { useEffect, useState } from "react";

type TocItem = {
  id: string;
  label: string;
};

type EssayTocProps = {
  items: TocItem[];
};

export function EssayToc({ items }: EssayTocProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((heading): heading is HTMLElement => Boolean(heading));

    if (!headings.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleHeading = entries.find((entry) => entry.isIntersecting);

        if (visibleHeading) {
          setActiveId(visibleHeading.target.id);
        }
      },
      {
        rootMargin: "-15% 0px -65% 0px",
        threshold: 0,
      },
    );

    headings.forEach((heading) => observer.observe(heading));

    return () => {
      observer.disconnect();
    };
  }, [items]);

  return (
    <aside className="essay-aside" aria-label="Table of contents">
      <span>On this page</span>

      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={activeId === item.id ? "is-active" : ""}
        >
          {item.label}
        </a>
      ))}
    </aside>
  );
}
