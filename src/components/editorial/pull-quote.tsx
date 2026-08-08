type PullQuoteProps = {
  children: React.ReactNode;
  author?: string;
};

export function PullQuote({ children, author }: PullQuoteProps) {
  return (
    <figure className="pull-quote">
      <blockquote>“{children}”</blockquote>

      {author && <figcaption>— {author}</figcaption>}
    </figure>
  );
}
