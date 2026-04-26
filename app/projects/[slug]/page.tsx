import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  InlineRelatedCard,
  RelatedContentSection,
  TableOfContents
} from "@/components/article-extras";
import { MediaCover, MediaGallery, MediaVideo } from "@/components/media";
import { splitArticleHtml } from "@/lib/article";
import { getProjectBySlug, getRelatedProjects } from "@/lib/content";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project not found"
    };
  }

  return {
    title: project.title,
    description: project.summary
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const [inlineRelatedProject, ...relatedProjects] = await getRelatedProjects(
    project.slug,
    4
  );
  const articleSections = splitArticleHtml(project.contentHtml);

  return (
    <section className="article article--editorial">
      <div className="container">
        <Link href="/projects" className="text-link">
          Back to projects
        </Link>

        <div className="article-hero">
          <div className="article__inner">
            <p className="eyebrow">Project</p>
            <h1>{project.title}</h1>
            <p className="article__excerpt">{project.summary}</p>
          </div>

          <aside className="article-aside article-aside--project">
            <p className="project-card__status">{project.status}</p>
            {project.publishedAt ? (
              <p className="archive-item__meta">{project.publishedAt}</p>
            ) : null}
            {project.tags.length > 0 ? (
              <ul className="tag-list tag-list--spaced">
                {project.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            ) : null}
          </aside>
        </div>

        <figure className="article-cover">
          <MediaCover
            asset={project.coverImage}
            title={project.title}
            label="Project"
            description={project.summary}
            priority
            sizes="(max-width: 900px) 100vw, 1140px"
            transformation={[
              {
                width: 1400,
                quality: 84
              }
            ]}
          />
        </figure>

        {project.videoUrl ? (
          <div className="article-video">
            <MediaVideo src={project.videoUrl} />
          </div>
        ) : null}

        <MediaGallery items={project.gallery} title={project.title} />

        <div
          className={`article-body${
            project.tableOfContents.length > 0 ? " article-body--with-toc" : ""
          }`}
        >
          <div className="article-body__main">
            <article
              className="article__inner prose"
              dangerouslySetInnerHTML={{ __html: articleSections.before }}
            />

            {inlineRelatedProject ? (
              <InlineRelatedCard item={inlineRelatedProject} />
            ) : null}

            {articleSections.after ? (
              <article
                className="article__inner prose"
                dangerouslySetInnerHTML={{ __html: articleSections.after }}
              />
            ) : null}
          </div>

          <aside className="article-support">
            <TableOfContents items={project.tableOfContents} />
          </aside>
        </div>

        <RelatedContentSection
          title="Related projects"
          items={relatedProjects}
        />
      </div>
    </section>
  );
}
