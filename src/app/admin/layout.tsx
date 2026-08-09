import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
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
    <div className="admin-shell">
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
      </aside>
      <section className="admin-content">{children}</section>
    </div>
  );
}
