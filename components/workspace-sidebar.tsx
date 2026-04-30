"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  categoryLinks,
  pageLinks,
  professionalHeadline,
  siteTagline
} from "@/lib/site-config";
import type { MediaAsset } from "@/lib/types";

function NavIcon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    home: "M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-9.5Z",
    blog: "M6 4h12a1 1 0 0 1 1 1v14l-3-2H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm3 5h6M9 13h4",
    github: "M12 2a10 10 0 0 0-3.2 19c.5.1.7-.2.7-.5v-1.8c-2.7.6-3.3-1.1-3.3-1.1-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 2.9.8.1-.6.4-1.1.7-1.4-2.2-.2-4.5-1.1-4.5-4.9 0-1.1.4-2 1-2.7-.1-.2-.4-1.3.1-2.6 0 0 .8-.3 2.8 1a9.7 9.7 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.3.2 2.4.1 2.6.6.7 1 1.6 1 2.7 0 3.8-2.3 4.6-4.5 4.9.4.3.8 1 .8 2v3c0 .3.2.6.8.5A10 10 0 0 0 12 2Z",
    contact: "M5 6h14v12H5V6Zm1.5 1.5L12 12l5.5-4.5"
  };

  return (
    <svg
      className="workspace-sidebar__icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d={paths[name]} />
    </svg>
  );
}

export function WorkspaceSidebar({ logo }: { logo?: MediaAsset }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [pushStatus, setPushStatus] = useState<
    "idle" | "pushing" | "success" | "error"
  >("idle");

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMenuOpen) {
      document.body.style.overflow = "";
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    function handleScroll() {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY;
      setIsHeaderHidden(isScrollingDown && currentScrollY > 80 && !isMenuOpen);
      lastScrollY = currentScrollY;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMenuOpen]);

  async function handlePushContent() {
    setPushStatus("pushing");

    try {
      const response = await fetch("/api/push-content", {
        method: "POST"
      });

      if (!response.ok) {
        throw new Error("Failed to refresh content");
      }

      router.refresh();
      setPushStatus("success");
      window.setTimeout(() => setPushStatus("idle"), 3200);
    } catch {
      setPushStatus("error");
    }
  }

  return (
    <aside
      className={`workspace-sidebar${isMenuOpen ? " is-open" : ""}${
        isHeaderHidden ? " is-hidden" : ""
      }`}
      aria-label="Workspace navigation"
    >
      <div className="workspace-sidebar__brand">
        <Link
          href="/"
          className="workspace-sidebar__avatar"
          aria-label="Max Hoang Journal home"
        >
          {logo ? (
            <Image
              src={logo.url}
              alt={logo.alt}
              width={88}
              height={88}
              priority
              unoptimized
            />
          ) : (
            <Image
              src="/max-hoang-portrait.jpg"
              alt=""
              width={88}
              height={88}
              priority
            />
          )}
        </Link>
        <div className="workspace-sidebar__brand-copy">
          <a
            href="https://www.linkedin.com/in/maxhoangau/"
            className="workspace-sidebar__name"
            target="_blank"
            rel="noreferrer"
          >
            Max Hoang Journal
          </a>
          <p className="workspace-sidebar__tag">{siteTagline}</p>
        </div>
        <button
          type="button"
          className="mobile-menu-toggle"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <nav className="workspace-sidebar__nav" aria-label="Pages">
        <p className="workspace-sidebar__label">Pages</p>
        {pageLinks.map((link) => {
          const isActive =
            link.href === "/"
              ? pathname === "/"
              : pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`workspace-sidebar__link${isActive ? " is-active" : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              <NavIcon name={link.icon} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="workspace-sidebar__bottom">
        <div className="workspace-sidebar__section workspace-sidebar__section--categories">
          <p className="workspace-sidebar__label">Categories</p>
          <div className="workspace-sidebar__chips">
            {categoryLinks.map((link) => (
              <Link key={link.href} href={link.href} className="workspace-chip">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="workspace-sidebar__section workspace-sidebar__section--actions">
          <p className="workspace-sidebar__label">Connect</p>
          <div className="workspace-sidebar__buttons">
            <button
              type="button"
              className="workspace-button workspace-button--primary"
              onClick={handlePushContent}
              disabled={pushStatus === "pushing"}
            >
              {pushStatus === "pushing" ? "Pushing..." : "Push content"}
            </button>
            <Link href="/contact" className="workspace-button">
              Contact
            </Link>
            <a
              href="https://www.linkedin.com/in/maxhoangau/"
              className="workspace-button"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </div>
          {pushStatus === "success" ? (
            <p className="workspace-sidebar__status">Content pushed.</p>
          ) : null}
          {pushStatus === "error" ? (
            <p className="workspace-sidebar__status workspace-sidebar__status--error">
              Could not push content.
            </p>
          ) : null}
        </div>

        <div className="workspace-sidebar__footer">
          <a
            href="https://www.linkedin.com/in/maxhoangau/"
            className="workspace-sidebar__footer-link"
            target="_blank"
            rel="noreferrer"
          >
            Max Hoang
          </a>
          <p>{professionalHeadline}</p>
        </div>
      </div>
    </aside>
  );
}
