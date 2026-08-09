import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminEssaysPage() {
  const supabase = await createClient();
  const { data: essays, error } = await supabase.from("essays").select("id, title, slug, status, updated_at, reading_time_minutes").order("updated_at", { ascending: false });

  return (
    <main className="admin-content">
      <header className="archive-intro">
        <p className="section-label">Content</p>
        <h1>Essays</h1>
        <p>Write, revise, and publish the long-form ideas in your archive.</p>
        <Link href="/admin/essays/new">New essay</Link>
      </header>
      {error ? <p role="alert">{error.message}</p> : null}
      <div className="admin-list">
        {essays?.map((essay) => (
          <article key={essay.id} className="admin-list-item">
            <div><p className="section-label">{essay.status}</p><h2>{essay.title}</h2><p>{essay.reading_time_minutes ?? 1} min read · {essay.slug}</p></div>
            <Link href={`/admin/essays/${essay.id}/edit`}>Edit</Link>
          </article>
        ))}
        {!essays?.length && !error ? <p>No essays yet. Create your first one.</p> : null}
      </div>
    </main>
  );
}
