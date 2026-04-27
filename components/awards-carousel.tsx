"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MediaCover } from "@/components/media";
import type { Award } from "@/lib/types";

export function AwardsCarousel({ items }: { items: Award[] }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(items.length > 1);

  const syncScrollState = useCallback(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    const maxScrollLeft = Math.max(
      0,
      viewport.scrollWidth - viewport.clientWidth - 2
    );

    setCanScrollPrev(viewport.scrollLeft > 4);
    setCanScrollNext(viewport.scrollLeft < maxScrollLeft);
  }, []);

  useEffect(() => {
    syncScrollState();

    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    viewport.addEventListener("scroll", syncScrollState, { passive: true });
    window.addEventListener("resize", syncScrollState);

    return () => {
      viewport.removeEventListener("scroll", syncScrollState);
      window.removeEventListener("resize", syncScrollState);
    };
  }, [syncScrollState]);

  if (items.length === 0) {
    return null;
  }

  function scrollByCard(direction: -1 | 1) {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    const scrollAmount = Math.max(viewport.clientWidth * 0.78, 320);

    viewport.scrollBy({
      left: scrollAmount * direction,
      behavior: "smooth"
    });
  }

  return (
    <div className="awards-rail">
      <button
        type="button"
        className="icon-button icon-button--carousel icon-button--carousel-prev"
        aria-label="Scroll awards left"
        onClick={() => scrollByCard(-1)}
        disabled={!canScrollPrev}
      >
        <span aria-hidden="true">←</span>
      </button>

      <div
        className="awards-carousel"
        aria-label="Awards and recognition"
        ref={viewportRef}
      >
        <div className="awards-carousel__track">
          {items.map((award) => (
            <article className="award-card" key={award.slug}>
              <figure className="award-card__media">
                <MediaCover
                  asset={award.coverImage}
                  title={award.title}
                  label={String(award.year)}
                  description={award.summary}
                  compact
                  sizes="(max-width: 900px) 86vw, 380px"
                  transformation={[
                    {
                      width: 760,
                      quality: 82
                    }
                  ]}
                />
              </figure>

              <div className="award-card__body">
                <p className="award-card__event">{award.event}</p>
                <h3>{award.title}</h3>
                <p className="award-card__result">{award.result}</p>
                {award.project ? (
                  <p className="award-card__project">Project: {award.project}</p>
                ) : null}
                <p>{award.summary}</p>

                {award.tags.length > 0 ? (
                  <ul className="tag-list" aria-label={`${award.title} tags`}>
                    {award.tags.slice(0, 4).map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                ) : null}

                {award.referenceUrl ? (
                  <a
                    className="text-link"
                    href={award.referenceUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View reference
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="icon-button icon-button--carousel icon-button--carousel-next"
        aria-label="Scroll awards right"
        onClick={() => scrollByCard(1)}
        disabled={!canScrollNext}
      >
        <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}
