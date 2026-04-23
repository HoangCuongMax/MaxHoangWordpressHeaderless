import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MediaGallery, MediaImage, MediaVideo } from "@/components/media";
import { getPostBySlug } from "@/lib/content";

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
          </div>

          <aside className="article-aside">
            <p className="archive-item__meta">{post.publishedAt}</p>
            <p>{post.readingTime}</p>
          </aside>
        </div>

        {post.coverImage ? (
          <figure className="article-cover">
            <MediaImage
              asset={post.coverImage}
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
        ) : null}

        {post.videoUrl ? (
          <div className="article-video">
            <MediaVideo src={post.videoUrl} />
          </div>
        ) : null}

        <MediaGallery items={post.gallery} title={post.title} />

        <article
          className="article__inner prose"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </div>
    </section>
  );
}
