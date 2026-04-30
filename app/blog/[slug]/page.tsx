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
import { getPostBySlug, getRelatedPosts } from "@/lib/content";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post not found"
    };
  }

  return {
    title: post.title,
    description: post.excerpt
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const [inlineRelatedPost, ...relatedPosts] = await getRelatedPosts(post.slug, 4);
  const articleSections = splitArticleHtml(post.contentHtml);

  return (
    <section className="article article--editorial">
      <div className="container">
        <Link href="/blog" className="text-link">
          Back to blog
        </Link>

        <div className="article-hero">
          <div className="article__inner">
            <p className="eyebrow">Blog</p>
            <h1>{post.title}</h1>
            <p className="article__excerpt">{post.excerpt}</p>
            <div className="article-meta-strip" aria-label="Post details">
              <span>{post.publishedAt}</span>
              <span>{post.readingTime}</span>
              {post.tags.slice(0, 3).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>

          <aside className="article-aside">
            <p className="article-aside__label">Reading guide</p>
            <p className="archive-item__meta">{post.publishedAt}</p>
            <p>{post.readingTime}</p>
            {post.tags.length > 0 ? (
              <ul className="article-aside__tags" aria-label="Post tags">
                {post.tags.slice(0, 4).map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            ) : null}
          </aside>
        </div>

        <figure className="article-cover">
          <MediaCover
            asset={post.coverImage}
            title={post.title}
            label="Blog post"
            description={post.excerpt}
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

        {post.videoUrl ? (
          <div className="article-video">
            <MediaVideo src={post.videoUrl} />
          </div>
        ) : null}

        <MediaGallery items={post.gallery} title={post.title} />

        <div
          className={`article-body${
            post.tableOfContents.length > 0 ? " article-body--with-toc" : ""
          }`}
        >
          <div className="article-body__main">
            <article
              className="article__inner prose"
              dangerouslySetInnerHTML={{ __html: articleSections.before }}
            />

            {inlineRelatedPost ? <InlineRelatedCard item={inlineRelatedPost} /> : null}

            {articleSections.after ? (
              <article
                className="article__inner prose"
                dangerouslySetInnerHTML={{ __html: articleSections.after }}
              />
            ) : null}
          </div>

          <aside className="article-support">
            <TableOfContents items={post.tableOfContents} />
          </aside>
        </div>

        <RelatedContentSection title="Related posts" items={relatedPosts} />
      </div>
    </section>
  );
}
