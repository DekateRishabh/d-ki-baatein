type ArticleMetaProps = {
  type: string;
  readingTime: string;
  date: string;
  updated?: string;
};

export function ArticleMeta({
  type,
  readingTime,
  date,
  updated,
}: ArticleMetaProps) {
  return (
    <div className="article-meta">
      <span>{type}</span>
      <span>/</span>
      <span>{readingTime}</span>
      <span>/</span>
      <span>{date}</span>

      {updated && (
        <>
          <span>/</span>
          <span>Updated {updated}</span>
        </>
      )}
    </div>
  );
}
