type SectionLabelProps = {
  children: React.ReactNode;
  accent?: string;
};

export function SectionLabel({
  children,
  accent,
}: SectionLabelProps) {
  return (
    <div className="section-label-row">
      {accent && <span className="section-label-accent">{accent}</span>}
      <span className="section-label-text">{children}</span>
      <span className="section-label-line" />
    </div>
  );
}