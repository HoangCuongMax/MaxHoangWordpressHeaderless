"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const siteTagline =
  "AI Visionary - mapping practical intelligence, better services, and data-powered ideas.";

const professionalHeadline =
  "Service Improvement Analyst | NEC Australia | AI & Data Analytics | Service Now Implementer | ITIL 4 Certified | Power BI Certified | Salesforce Certified | Multi-Award Winner (GovHack, RIMPA, CDU Code Fair x5, NT Digital Excellence)";

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
    <>
      <aside className="workspace-sidebar" aria-label="Workspace navigation">
        <div className="workspace-sidebar__brand">
          <Link href="/" className="workspace-sidebar__avatar" aria-label="Max Hoang Journal home">
            <Image
              src="/max-hoang-portrait.jpg"
              alt=""
              width={88}
              height={88}
              priority
            />
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
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

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
            <Link
              href="/contact"
              className="workspace-button workspace-button--primary"
            >
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
      </aside>

      <nav className="mobile-bottom-nav" aria-label="Mobile pages">
        {pageLinks.map((link) => {
          const isActive =
            link.href === "/"
              ? pathname === "/"
              : pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`mobile-bottom-nav__link${isActive ? " is-active" : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="mobile-bottom-nav__dot" aria-hidden="true" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
