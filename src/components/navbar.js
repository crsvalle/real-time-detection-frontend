"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      <style>{CSS}</style>
      <nav className="cv-nav">
        <div className="cv-nav-inner">
          <Link href="/" className="cv-brand">
            <div className="cv-brand-icon">
              <Car size={16} />
            </div>
            <div>
              <span className="cv-brand-name">CarVision</span>
              <span className="cv-brand-sub">YOLOv8 detection</span>
            </div>
          </Link>

          <div className="cv-links">
            <Link
              href="/"
              className={`cv-link ${pathname === "/" ? "cv-link--active" : ""}`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`cv-link ${pathname === "/about" ? "cv-link--active" : ""}`}
            >
              About
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Geist+Mono:wght@400;500&display=swap');

  :root {
    --ci-bg: #0c0c0e;
    --ci-surface: #111114;
    --ci-border: rgba(255,255,255,0.07);
    --ci-border-hover: rgba(255,255,255,0.14);
    --ci-text: #e8e8ec;
    --ci-muted: rgba(232,232,236,0.38);
    --ci-primary: #e8ff47;
    --ci-primary-dim: rgba(232,255,71,0.12);
  }

  .cv-nav {
    position: sticky;
    top: 0;
    z-index: 50;
    border-bottom: 1px solid var(--ci-border);
    background: rgba(12,12,14,0.85);
    backdrop-filter: blur(14px);
    font-family: 'Syne', sans-serif;
  }

  .cv-nav-inner {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0.85rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .cv-brand {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    text-decoration: none;
  }

  .cv-brand-icon {
    width: 34px;
    height: 34px;
    display: grid;
    place-items: center;
    border-radius: 9px;
    background: var(--ci-primary-dim);
    color: var(--ci-primary);
    border: 1px solid rgba(232,255,71,0.2);
    flex-shrink: 0;
  }

  .cv-brand-name {
    display: block;
    font-size: 0.95rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--ci-text);
    line-height: 1;
  }

  .cv-brand-sub {
    display: block;
    font-family: 'Geist Mono', monospace;
    font-size: 0.6rem;
    color: var(--ci-muted);
    letter-spacing: 0.05em;
    margin-top: 2px;
  }

  .cv-links {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .cv-link {
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: var(--ci-muted);
    text-decoration: none;
    padding: 0.35rem 0.75rem;
    border-radius: 7px;
    border: 1px solid transparent;
    transition: color 0.15s, background 0.15s, border-color 0.15s;
  }

  .cv-link:hover {
    color: var(--ci-text);
    background: rgba(255,255,255,0.04);
    border-color: var(--ci-border);
  }

  .cv-link--active {
    color: var(--ci-primary);
    background: var(--ci-primary-dim);
    border-color: rgba(232,255,71,0.2);
  }

  .cv-link--active:hover {
    color: var(--ci-primary);
    background: var(--ci-primary-dim);
  }
`;