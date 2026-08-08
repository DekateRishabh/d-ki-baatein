import { SectionLabel } from "@/components/editorial/section-label";

type ArchiveLayoutProps = {
  accent?: string;
  label: string;
  title: string;
  description: string;
  pageClassName?: string;
  children: React.ReactNode;
};

export function ArchiveLayout({
  accent,
  label,
  title,
  description,
  pageClassName = "archive-shell",
  children,
}: ArchiveLayoutProps) {
  return (
    <main className={pageClassName}>
      <header className="archive-intro">
        <SectionLabel accent={accent}>
          {label}
        </SectionLabel>

        <h1>{title}</h1>

        <p>{description}</p>
      </header>

      {children}
    </main>
  );
}