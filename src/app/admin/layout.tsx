export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="admin-route">
      {children}
      <style dangerouslySetInnerHTML={{ __html: `
        body:has(.admin-route) > header,
        body:has(.admin-route) > footer,
        body:has(.admin-route) .site-header,
        body:has(.admin-route) .site-footer {
          display: none !important;
        }

        .admin-route {
          min-height: 100vh;
          background: var(--color-background, #f4f0e9);
          color: var(--color-foreground, #171717);
          font-family: var(--font-inter), Arial, sans-serif;
        }

        .admin-route .admin-shell {
          display: grid;
          grid-template-columns: 250px minmax(0, 1fr);
          min-height: 100vh;
        }

        .admin-route .admin-sidebar {
          position: sticky;
          top: 0;
          align-self: start;
          min-height: 100vh;
          padding: 34px 26px;
          border-right: 1px solid rgba(23, 23, 23, 0.14);
          background: rgba(255, 252, 247, 0.55);
        }

        .admin-route .admin-sidebar h2 {
          margin: 10px 0 38px;
          font-family: var(--font-cormorant), Georgia, serif;
          font-size: 42px;
          font-weight: 500;
          letter-spacing: -0.04em;
        }

        .admin-route .admin-sidebar nav {
          display: grid;
          gap: 5px;
        }

        .admin-route .admin-sidebar nav a {
          display: block;
          padding: 11px 12px;
          border-radius: 6px;
          color: inherit;
          text-decoration: none;
          font-size: 13px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition: background 160ms ease, transform 160ms ease;
        }

        .admin-route .admin-sidebar nav a:hover,
        .admin-route .admin-sidebar nav a:focus-visible {
          background: rgba(23, 23, 23, 0.07);
          transform: translateX(3px);
        }

        .admin-route .admin-content {
          width: min(100%, 1180px);
          padding: 70px clamp(24px, 6vw, 96px) 100px;
        }

        .admin-route .archive-intro {
          max-width: 780px;
          margin-bottom: 54px;
        }

        .admin-route .archive-intro h1 {
          margin: 14px 0 18px;
          font-family: var(--font-cormorant), Georgia, serif;
          font-size: clamp(58px, 8vw, 112px);
          font-weight: 500;
          line-height: 0.88;
          letter-spacing: -0.055em;
        }

        .admin-route .archive-intro p:not(.section-label) {
          max-width: 620px;
          color: rgba(23, 23, 23, 0.68);
          font-size: 17px;
          line-height: 1.65;
        }

        .admin-route .section-label {
          margin: 0;
          color: rgba(23, 23, 23, 0.55);
          font-family: var(--font-plex-mono), monospace;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .admin-route .admin-form {
          display: grid;
          gap: 24px;
          width: min(100%, 780px);
          padding: 32px;
          border: 1px solid rgba(23, 23, 23, 0.14);
          border-radius: 10px;
          background: rgba(255, 252, 247, 0.6);
          box-shadow: 0 16px 50px rgba(23, 23, 23, 0.04);
        }

        .admin-route .admin-form label,
        .admin-route .admin-login-form label {
          display: grid;
          gap: 9px;
          color: rgba(23, 23, 23, 0.72);
          font-family: var(--font-plex-mono), monospace;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .admin-route input,
        .admin-route textarea,
        .admin-route select {
          width: 100%;
          border: 1px solid rgba(23, 23, 23, 0.2);
          border-radius: 5px;
          background: rgba(255, 255, 255, 0.48);
          color: inherit;
          font-family: var(--font-inter), Arial, sans-serif;
          font-size: 16px;
          letter-spacing: normal;
          text-transform: none;
          outline: none;
          transition: border-color 160ms ease, box-shadow 160ms ease, background 160ms ease;
        }

        .admin-route input,
        .admin-route select {
          min-height: 48px;
          padding: 0 14px;
        }

        .admin-route textarea {
          min-height: 120px;
          padding: 14px;
          resize: vertical;
          line-height: 1.65;
        }

        .admin-route input:focus,
        .admin-route textarea:focus,
        .admin-route select:focus {
          border-color: rgba(23, 23, 23, 0.65);
          background: #fff;
          box-shadow: 0 0 0 3px rgba(23, 23, 23, 0.08);
        }

        .admin-route button,
        .admin-route .archive-intro > a {
          display: inline-flex;
          width: fit-content;
          align-items: center;
          justify-content: center;
          min-height: 46px;
          padding: 0 20px;
          border: 1px solid #171717;
          border-radius: 4px;
          background: #171717;
          color: #fff;
          cursor: pointer;
          font-family: var(--font-plex-mono), monospace;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-decoration: none;
          text-transform: uppercase;
          transition: background 160ms ease, color 160ms ease, transform 160ms ease;
        }

        .admin-route button:hover:not(:disabled),
        .admin-route .archive-intro > a:hover {
          background: transparent;
          color: #171717;
          transform: translateY(-2px);
        }

        .admin-route button:disabled {
          cursor: wait;
          opacity: 0.55;
        }

        .admin-route .admin-login-form {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 22px;
          max-width: 780px;
          padding: 32px;
          border: 1px solid rgba(23, 23, 23, 0.14);
          border-radius: 10px;
          background: rgba(255, 252, 247, 0.6);
        }

        .admin-route .admin-login-form button,
        .admin-route .admin-login-form p[role="alert"] {
          grid-column: 1 / -1;
        }

        .admin-route .admin-list {
          display: grid;
          gap: 12px;
        }

        .admin-route .admin-list-item,
        .admin-route .admin-dashboard-grid a {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 24px;
          border: 1px solid rgba(23, 23, 23, 0.14);
          border-radius: 8px;
          color: inherit;
          text-decoration: none;
          background: rgba(255, 252, 247, 0.45);
          transition: border-color 160ms ease, transform 160ms ease, background 160ms ease;
        }

        .admin-route .admin-list-item:hover,
        .admin-route .admin-dashboard-grid a:hover {
          border-color: rgba(23, 23, 23, 0.45);
          background: rgba(255, 252, 247, 0.85);
          transform: translateY(-2px);
        }

        .admin-route .admin-list-item h2 {
          margin: 7px 0;
          font-family: var(--font-cormorant), Georgia, serif;
          font-size: 32px;
          font-weight: 500;
        }

        .admin-route .admin-list-item p:not(.section-label) {
          margin: 0;
          color: rgba(23, 23, 23, 0.58);
          font-size: 13px;
        }

        .admin-route .admin-list-item > a {
          color: inherit;
          font-family: var(--font-plex-mono), monospace;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .admin-route .admin-dashboard-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .admin-route .admin-dashboard-grid a {
          min-height: 130px;
          align-items: flex-end;
          font-family: var(--font-cormorant), Georgia, serif;
          font-size: 28px;
        }

        .admin-route [role="alert"] {
          color: #9d2d21;
          font-size: 14px;
          line-height: 1.5;
        }

        @media (max-width: 800px) {
          .admin-route .admin-shell { grid-template-columns: 1fr; }
          .admin-route .admin-sidebar { position: static; min-height: auto; padding: 22px 20px; border-right: 0; border-bottom: 1px solid rgba(23, 23, 23, 0.14); }
          .admin-route .admin-sidebar h2 { margin-bottom: 18px; font-size: 34px; }
          .admin-route .admin-sidebar nav { display: flex; flex-wrap: wrap; gap: 4px; }
          .admin-route .admin-sidebar nav a { padding: 8px 9px; font-size: 10px; }
          .admin-route .admin-content { padding: 48px 20px 70px; }
          .admin-route .archive-intro h1 { font-size: clamp(54px, 16vw, 88px); }
          .admin-route .admin-form, .admin-route .admin-login-form { padding: 20px; }
          .admin-route .admin-login-form, .admin-route .admin-dashboard-grid { grid-template-columns: 1fr; }
          .admin-route .admin-login-form button, .admin-route .admin-login-form p[role="alert"] { grid-column: auto; }
        }
      ` }} />
    </div>
  );
}
