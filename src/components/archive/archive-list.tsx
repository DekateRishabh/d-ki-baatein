type ArchiveListProps = {
  children: React.ReactNode;
  className?: string;
};

export function ArchiveList({ children, className = "" }: ArchiveListProps) {
  return <div className={`archive-list ${className}`}>{children}</div>;
}
