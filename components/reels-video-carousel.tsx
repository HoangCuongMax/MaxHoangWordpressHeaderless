"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ShortVideo } from "@/lib/types";

function getEmbedUrl(youtubeId: string) {
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1"
  });

  return `https://www.youtube-nocookie.com/embed/${youtubeId}?${params.toString()}`;
}

export function ReelsVideoCarousel({ items }: { items: ShortVideo[] }) {
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

    const card = viewport.querySelector<HTMLElement>(".reel-card");
    const cardWidth = card?.offsetWidth ?? 260;

    viewport.scrollBy({
      left: (cardWidth + 16) * direction,
      behavior: "smooth"
    });
  }

  return (
    <div className="reels-rail">
      <div className="reels-rail__topbar">
        <div>
          <p className="eyebrow">Short videos</p>
          <h3>Recent reels from YouTube</h3>
        </div>
        <div
          className="reels-rail__controls"
          aria-label="Short video carousel controls"
        >
          <button
            type="button"
            className="icon-button icon-button--carousel"
            aria-label="Scroll short videos left"
            onClick={() => scrollByCard(-1)}
            disabled={!canScrollPrev}
          >
            <span aria-hidden="true">&larr;</span>
          </button>
          <button
            type="button"
            className="icon-button icon-button--carousel"
            aria-label="Scroll short videos right"
            onClick={() => scrollByCard(1)}
            disabled={!canScrollNext}
          >
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </div>

      <div className="reels-carousel-shell">
        <div
          className="reels-carousel"
          aria-label="Recent YouTube Shorts"
          ref={viewportRef}
        >
          <div className="reels-carousel__track">
            {items.map((item, index) => (
              <article className="reel-card" key={item.slug}>
                <div className="reel-card__frame">
                  <iframe
                    src={getEmbedUrl(item.youtubeId)}
                    title={item.title || `YouTube Short ${index + 1}`}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <div className="reel-card__meta">
                  <p>{item.publishedAt ?? "YouTube Short"}</p>
                  <a href={item.url} target="_blank" rel="noreferrer">
                    Watch on YouTube
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
