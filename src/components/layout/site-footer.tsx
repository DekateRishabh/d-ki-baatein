import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <p className="footer-title">D Ki Baatein</p>
        <p>A place where ideas, memories, and experiences are preserved.</p>
      </div>

      <div className="footer-links">
        <Link href="/about">About</Link>
        <Link href="/now">Now</Link>
        <Link href="/bookmarks">Bookmark</Link>
        <Link href="/contact">Contact</Link>
      </div>

      <p className="footer-copy">© 2026 D Ki Baatein</p>
    </footer>
  );
}
