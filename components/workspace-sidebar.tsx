"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const pageLinks = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/tools", label: "Tools" },
  { href: "/contact", label: "Contact" }
];

const categoryLinks = [
  { href: "/blog", label: "Writing" },
  { href: "/projects", label: "Projects" },
  { href: "/tools", label: "Utilities" }
];

export function WorkspaceSidebar() {
  const pathname = usePathname();

  return (
    <aside className="workspace-sidebar" aria-label="Workspace navigation">
      <div className="workspace-sidebar__brand">
        <div className="workspace-sidebar__avatar" aria-hidden="true">
          MH
        </div>
        <div>
          <p className="workspace-sidebar__name">Max Hoang</p>
          <p className="workspace-sidebar__tag">Custom Notion based website</p>
        </div>
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
            >
              <span>{link.label}</span>
              <span className="workspace-sidebar__hint" aria-hidden="true">
                {isActive ? "Current" : ""}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="workspace-sidebar__section">
        <p className="workspace-sidebar__label">Categories</p>
        <div className="workspace-sidebar__chips">
          {categoryLinks.map((link) => (
            <Link key={link.href} href={link.href} className="workspace-chip">
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="workspace-sidebar__section">
        <p className="workspace-sidebar__label">Buttons</p>
        <div className="workspace-sidebar__buttons">
          <Link href="/contact" className="workspace-button workspace-button--primary">
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
      </div>

      <div className="workspace-sidebar__footer">
        <p>Custom Notion based website</p>
      </div>
    </aside>
  );
}
