import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function signOut() {
  "use server";
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || !["admin", "editor"].includes(profile.role)) {
    redirect("/admin/login?error=not-authorized");
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <p className="section-label">D Ki Baatein</p>
        <h2>Admin</h2>
        <nav aria-label="Admin navigation">
          <a href="/admin">Dashboard</a>
          <a href="/admin/essays">Essays</a>
          <a href="/admin/journal">Journal</a>
          <a href="/admin/media">Media</a>
          <a href="/admin/settings">Settings</a>
        </nav>
        <form action={signOut} className="logout-form">
          <button type="submit">Log out</button>
        </form>
      </aside>

      <section className="admin-content">
        <header className="archive-intro">
          <p className="section-label">Private archive</p>
          <h1>Welcome back.</h1>
          <p>Your publishing dashboard is ready for the first real content workflow.</p>
        </header>

        <div className="admin-dashboard-grid">
          <a href="/admin/essays">Manage essays</a>
          <a href="/admin/journal">Manage journal</a>
          <a href="/admin/media">Open media library</a>
        </div>
      </section>
    </main>
  );
}
