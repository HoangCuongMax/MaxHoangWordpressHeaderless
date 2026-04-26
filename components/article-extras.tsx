import Link from "next/link";
import { MediaCover } from "@/components/media";
import type { RelatedContentItem, TableOfContentsItem } from "@/lib/types";

export function TableOfContents({
  items
}: {
  items: TableOfContentsItem[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav className="toc-panel" aria-label="Table of contents">
      <p className="toc-panel__eyebrow">On this page</p>
      <ol className="toc-panel__list">
        {items.map((item) => (
          <li
            className={item.level === 3 ? "toc-panel__item toc-panel__item--nested" : "toc-panel__item"}
            key={item.id}
          >
            <a href={`#${item.id}`}>{item.text}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function InlineRelatedCard({
  item
}: {
  item: RelatedContentItem;
}) {
  return (
    <aside className="inline-related" aria-label={`Related ${item.kindLabel.toLowerCase()}`}>
      <figure className="inline-related__media">
        <MediaCover
          asset={item.coverImage}
          title={item.title}
          label={item.kindLabel}
          description={item.summary}
          compact
          sizes="(max-width: 900px) 100vw, 280px"
          transformation={[
            {
              width: 680,
              quality: 82
            }
          ]}
        />
      </figure>

      <div className="inline-related__body">
        <p className="inline-related__eyebrow">{item.kindLabel}</p>
        <p className="inline-related__meta">{item.meta}</p>
        <h3>
          <Link href={item.href}>{item.title}</Link>
        </h3>
        <p>{item.summary}</p>
      </div>
    </aside>
  );
}

export function RelatedContentSection({
  title,
  items
}: {
  title: string;
  items: RelatedContentItem[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="related-section" aria-labelledby="related-content-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Continue reading</p>
          <h2 id="related-content-heading">{title}</h2>
        </div>
      </div>

      <div className="related-grid">
        {items.map((item) => (
          <article className="related-card" key={item.href}>
            <figure className="related-card__media">
              <MediaCover
                asset={item.coverImage}
                title={item.title}
                label={item.kindLabel}
                description={item.summary}
                compact
                sizes="(max-width: 900px) 100vw, 33vw"
                transformation={[
                  {
                    width: 760,
                    quality: 82
                  }
                ]}
              />
            </figure>
            <p className="related-card__eyebrow">{item.kindLabel}</p>
            <p className="related-card__meta">{item.meta}</p>
            <h3>
              <Link href={item.href}>{item.title}</Link>
            </h3>
            <p>{item.summary}</p>
            {item.tags.length > 0 ? (
              <ul className="tag-list" aria-label={`${item.title} tags`}>
                {item.tags.slice(0, 3).map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
