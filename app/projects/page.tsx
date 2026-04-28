import Link from "next/link";
import { getProjects } from "@/lib/content";

export const metadata = {
  title: "Projects"
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="notion-page">
      <header className="notion-page__header">
        <p className="notion-page__eyebrow">Projects</p>
        <h1>Selected work and experiments.</h1>
        <p className="notion-page__lede">
          A simple list of projects with clear status labels and short summaries,
          so it reads like a workspace instead of a gallery.
        </p>
      </header>

      <section className="notion-section">
        <div className="notion-list">
          {projects.length > 0 ? (
            projects.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="notion-row notion-row--article"
              >
                <div className="notion-row__stack">
                  <span className="notion-row__title">{project.title}</span>
                  <span className="notion-row__summary">{project.summary}</span>
                </div>
                <div className="notion-row__meta">
                  <span>{project.status}</span>
                  <span>{project.tags.slice(0, 2).join(", ")}</span>
                </div>
              </Link>
            ))
          ) : (
            <div className="notion-row notion-row--static">
              <span className="notion-row__title">No projects published yet</span>
              <span className="notion-row__summary">
                Add a project in WordPress and it will appear here.
              </span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
