export default function AdminDashboardPage() {
  return (
    <main>
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
    </main>
  );
}
