import EssayForm from "@/components/admin/essay-form";

export default function NewEssayPage() {
  return <main className="admin-content"><header className="archive-intro"><p className="section-label">Content / Essays</p><h1>New essay</h1><p>Write in Markdown and save a draft whenever you like.</p></header><EssayForm mode="create" /></main>;
}
