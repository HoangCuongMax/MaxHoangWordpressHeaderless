import Link from "next/link";
import { getFeaturedPosts, getFeaturedProjects } from "@/lib/content";

export default async function HomePage() {
  const [posts, projects] = await Promise.all([
    getFeaturedPosts(),
    getFeaturedProjects()
  ]);

  return (
    <div className="notion-page">
      <header className="notion-page__header">
        <p className="notion-page__eyebrow">Workspace</p>
        <h1>Max Hoang</h1>
        <p className="notion-page__lede">
          A simple writing and project workspace built like a clean Notion page,
          with WordPress managing the content in the background.
        </p>
        <div className="notion-page__actions">
          <Link href="/blog" className="workspace-button workspace-button--primary">
            Open blog
          </Link>
          <Link href="/projects" className="workspace-button">
            Open projects
          </Link>
        </div>
      </header>

      <section className="notion-section">
        <div className="notion-section__head">
          <h2>Pages</h2>
          <p>Clear entry points to the main parts of the site.</p>
        </div>
        <div className="notion-list">
          {[
            ["Blog", "/blog", "Simple posts, notes, and published writing."],
            ["Projects", "/projects", "Selected work and case studies."],
            ["Services", "/services", "What I build and how I help."],
            ["Tools", "/tools", "Small utilities and practical products."],
            ["Contact", "/contact", "A direct way to start a conversation."]
          ].map(([title, href, summary]) => (
            <Link key={href} href={href} className="notion-row">
              <span className="notion-row__title">{title}</span>
              <span className="notion-row__summary">{summary}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="notion-section">
        <div className="notion-section__head">
          <h2>Recent writing</h2>
          <Link href="/blog" className="notion-section__link">
            View all
          </Link>
        </div>
        <div className="notion-list">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="notion-row">
                <span className="notion-row__title">{post.title}</span>
                <span className="notion-row__summary">
                  {post.publishedAt} · {post.readingTime}
                </span>
              </Link>
            ))
          ) : (
            <div className="notion-row notion-row--static">
              <span className="notion-row__title">No posts yet</span>
              <span className="notion-row__summary">
                Publish your first post in WordPress and it will appear here.
              </span>
            </div>
          )}
        </div>
      </section>

      <section className="notion-section">
        <div className="notion-section__head">
          <h2>Selected projects</h2>
          <Link href="/projects" className="notion-section__link">
            View all
          </Link>
        </div>
        <div className="notion-list">
          {projects.length > 0 ? (
            projects.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="notion-row"
              >
                <span className="notion-row__title">{project.title}</span>
                <span className="notion-row__summary">
                  {project.status}
                  {project.tags.length > 0 ? ` · ${project.tags.slice(0, 2).join(", ")}` : ""}
                </span>
              </Link>
            ))
          ) : (
            <div className="notion-row notion-row--static">
              <span className="notion-row__title">No projects yet</span>
              <span className="notion-row__summary">
                Add a published project in WordPress and it will appear here.
              </span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
