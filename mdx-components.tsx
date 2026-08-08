import type { MDXComponents } from "mdx/types";
import Image from "next/image";

import { PullQuote } from "@/components/editorial/pull-quote";
import { JournalImage } from "@/components/journal/journal-image";
import { JournalGallery } from "@/components/journal/journal-gallery";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,

    JournalImage,
    JournalGallery,

    h2: ({ children, ...props }) => (
      <h2 {...props} className="essay-heading">
        {children}
      </h2>
    ),

    h3: ({ children, ...props }) => (
      <h3 {...props} className="essay-subheading">
        {children}
      </h3>
    ),

    blockquote: ({ children }) => <PullQuote>{children}</PullQuote>,

    img: ({ src, alt }) => {
      if (!src || typeof src !== "string") {
        return null;
      }

      return (
        <figure className="essay-image">
          <Image
            src={src}
            alt={alt ?? ""}
            width={1200}
            height={800}
            sizes="(max-width: 760px) 100vw, 720px"
          />

          {alt && <figcaption>{alt}</figcaption>}
        </figure>
      );
    },
  };
}
