"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MoonStar, SunMedium } from "lucide-react";

const navigation = [
  { label: "Essays", href: "/essays" },
  { label: "Library", href: "/library" },
  { label: "Journal", href: "/journal" },
  { label: "Travel", href: "/travel" },
  { label: "Photography", href: "/photography" },
  { label: "Farm", href: "/farm" },
  { label: "Ideas", href: "/ideas" },
  { label: "Now", href: "/now" },
];

export function SiteHeader() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = window.localStorage.getItem("theme");
    const initialTheme =
      saved === "dark" || saved === "light"
        ? saved
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";

    setTheme(initialTheme);
    document.documentElement.dataset.theme = initialTheme;
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("theme", nextTheme);
  }
  return (
    <header className="site-header">
      <Link href="/" className="brand-group" aria-label="D Ki Baatein home">
        <Image
          src="/images/logo.png"
          alt="D Ki Baatein logo"
          width={120}
          height={72}
          priority
          className="brand-logo"
        />

        <span className="brand-copy">
          <span className="brand-name">D Ki Baatein</span>
          <span className="brand-description">A personal library</span>
        </span>
      </Link>

      <nav className="desktop-navigation" aria-label="Main navigation">
        {navigation.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>

      <button
        type="button"
        className="theme-button"
        aria-label="Toggle light and dark theme"
        onClick={toggleTheme}
      >
        {theme === "light" ? <MoonStar size={16} /> : <SunMedium size={16} />}
      </button>
    </header>
  );
}
