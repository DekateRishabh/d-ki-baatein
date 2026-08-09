import { notFound } from "next/navigation";
import EssayForm from "@/components/admin/essay-form";
import { createClient } from "@/lib/supabase/server";

export default async function EditEssayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: essay } = await supabase.from("essays").select("id, title, subtitle, excerpt, slug, body_markdown, status").eq("id", id).maybeSingle();
  if (!essay) notFound();
  return <main className="admin-content"><header className="archive-intro"><p className="section-label">Content / Essays</p><h1>Edit essay</h1></header><EssayForm mode="edit" essay={essay} /></main>;
}
