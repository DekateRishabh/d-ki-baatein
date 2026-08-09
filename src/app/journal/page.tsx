import { ArchiveLayout } from "@/components/archive/archive-layout";
import { JournalBrowser } from "@/components/journal/journal-browser";
import { getPublishedJournalEntries } from "@/lib/journal";

type JournalPageProps = {
  searchParams: Promise<{ tag?: string }>;
};

export default async function JournalPage({ searchParams }: JournalPageProps) {
  const { tag } = await searchParams;
  const entries = await getPublishedJournalEntries();

  return (
    <ArchiveLayout pageClassName="journal-page" accent="दैनंदिनी" label="Short observations" title="Notes from ordinary days." description="Small thoughts, daily observations, and moments that felt worth keeping.">
      <JournalBrowser entries={entries} initialQuery={tag ?? ""} />
    </ArchiveLayout>
  );
}
