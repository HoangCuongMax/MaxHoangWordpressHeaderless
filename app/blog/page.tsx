import Link from "next/link";
import { getPosts } from "@/lib/content";
import { MediaCover } from "@/components/media";

export const metadata = {
  title: "Blog"
};

type BlogPageProps = {
  searchParams?: Promise<{
    tag?: string;
  }>;
};

export default async function BlogIndexPage({ searchParams }: BlogPageProps) {
  const posts = await getPosts();
  const params = (await searchParams) ?? {};
  const activeTag = params.tag?.toLowerCase();
  const tags = Array.from(
    new Set(posts.flatMap((post) => post.tags).map((tag) => tag.trim()).filter(Boolean))
  ).sort((first, second) => first.localeCompare(second));

  const filteredPosts = activeTag
    ? posts.filter((post) =>
        post.tags.some((tag) => tag.toLowerCase() === activeTag)
      )
    : posts;

  return (
    <div className="notion-page">
      <header className="notion-page__header">
        <p className="notion-page__eyebrow">Blog</p>
        <h1>Writing, notes, and simple updates.</h1>
        <p className="notion-page__lede">
          A clean reading list with clear categories, no extra noise, and a layout
          that stays easy to scan.
        </p>
        <div className="notion-chip-bar" aria-label="Categories">
          <Link
            href="/blog"
            className={`workspace-chip${!activeTag ? " is-active" : ""}`}
          >
            All
          </Link>
          {tags.map((tag) => {
            const slug = tag.toLowerCase();

            return (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(slug)}`}
                className={`workspace-chip${activeTag === slug ? " is-active" : ""}`}
              >
                {tag}
              </Link>
            );
          })}
        </div>
      </header>

      <section className="notion-section">
        <div className="notion-list">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <article key={post.slug} className="notion-row notion-row--article">
                <Link
                  href={`/blog/${post.slug}`}
                  className="notion-row__media"
                  aria-label={`Read ${post.title}`}
                >
                  <MediaCover
                    asset={post.coverImage}
                    title={post.title}
                    label="Blog post"
                    description={post.excerpt}
                    compact
                    sizes="(max-width: 900px) 34vw, 180px"
                    transformation={[
                      {
                        width: 420,
                        quality: 82
                      }
                    ]}
                  />
                </Link>
                <div className="notion-row__stack">
                  <Link href={`/blog/${post.slug}`} className="notion-row__title">
                    {post.title}
                  </Link>
                  <p className="notion-row__summary">{post.excerpt}</p>
                </div>
                <div className="notion-row__meta">
                  <span>{post.publishedAt}</span>
                  <span>{post.readingTime}</span>
                </div>
              </article>
            ))
          ) : (
            <div className="notion-row notion-row--static">
              <span className="notion-row__title">No posts in this category</span>
              <span className="notion-row__summary">
                Try a different category or publish a new post in WordPress.
              </span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
