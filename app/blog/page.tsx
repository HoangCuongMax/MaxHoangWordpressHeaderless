import Link from "next/link";
import { MediaImage } from "@/components/media";
import { getPosts } from "@/lib/content";

export const metadata = {
  title: "Blog"
};

export default async function BlogIndexPage() {
  const posts = await getPosts();
  const featuredPost = posts[0];
  const archivePosts = posts.slice(1);

  return (
    <section className="section page-intro page-intro--blog">
      <div className="container editorial-shell">
        <p className="eyebrow">Blog</p>
        <h1>Writing on product, systems, and the work behind the work.</h1>
        <p className="page-intro__lede">
          Posts are intended to be published from Notion and rendered here in
          a custom reading experience.
        </p>

        {featuredPost ? (
          <>
            <article
              className={`feature-panel ${
                featuredPost.coverImage ? "feature-panel--with-media" : ""
              }`}
            >
              {featuredPost.coverImage ? (
                <figure className="feature-panel__media">
                  <MediaImage
                    asset={featuredPost.coverImage}
                    priority
                    sizes="(max-width: 900px) 100vw, 28vw"
                    transformation={[
                      {
                        width: 900,
                        quality: 84
                      }
                    ]}
                  />
                </figure>
              ) : null}
              <div className="feature-panel__meta">
                <p className="archive-item__meta">
                  {featuredPost.publishedAt} · {featuredPost.readingTime}
                </p>
                <span className="feature-panel__label">Latest essay</span>
              </div>
              <div className="feature-panel__body">
                <h2>
                  <Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
                </h2>
                <p>{featuredPost.excerpt}</p>
                <Link href={`/blog/${featuredPost.slug}`} className="text-link">
                  Read article
                </Link>
              </div>
            </article>

            <div className="archive-list archive-list--cards">
              {archivePosts.map((post) => (
                <article key={post.slug} className="archive-card">
                  {post.coverImage ? (
                    <figure className="archive-card__media">
                      <MediaImage
                        asset={post.coverImage}
                        sizes="(max-width: 900px) 100vw, 50vw"
                        transformation={[
                          {
                            width: 780,
                            quality: 82
                          }
                        ]}
                      />
                    </figure>
                  ) : null}
                  <p className="archive-item__meta">
                    {post.publishedAt} · {post.readingTime}
                  </p>
                  <h2>
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p>{post.excerpt}</p>
                </article>
              ))}
            </div>
          </>
        ) : (
          <article className="archive-item">
            <div>
              <p className="archive-item__meta">Notion posts</p>
              <h2>No posts published yet.</h2>
              <p>
                Create a published post in Notion and it will appear in this archive.
              </p>
            </div>
          </article>
        )}
      </div>
    </section>
  );
}
