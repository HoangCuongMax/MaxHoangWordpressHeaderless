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
        <Link href="/" className="article-backlink">
          <span aria-hidden="true">&larr;</span>
          Blog
        </Link>

        <div className="article-hero">
          <div className="article__inner article-hero__copy">
            <div className="article-topline">
              <p className="eyebrow">Blog</p>
              <div className="article-meta-strip" aria-label="Post details">
                <span>{post.publishedAt}</span>
                <span>{post.readingTime}</span>
                {post.tags.slice(0, 3).map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
            <h1>{post.title}</h1>
            {post.excerpt ? (
              <p className="article__excerpt">{post.excerpt}</p>
            ) : null}
          </div>

          <figure className="article-cover">
            <MediaCover
              asset={post.coverImage}
              title={post.title}
              label="Blog post"
              description={post.excerpt}
              priority
              sizes="(max-width: 900px) 100vw, 520px"
              transformation={[
                {
                  width: 1100,
                  quality: 84
                }
              ]}
            />
          </figure>
        </div>

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
