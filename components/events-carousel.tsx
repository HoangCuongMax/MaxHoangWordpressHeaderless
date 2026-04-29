"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MediaCover } from "@/components/media";
import type { EventItem } from "@/lib/types";

function getStartOfWeek(date: Date) {
  const start = new Date(date);
  const day = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - day);
  start.setHours(0, 0, 0, 0);
  return start;
}

function getEventState(event: EventItem) {
  const now = new Date();
  const weekStart = getStartOfWeek(now);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const start = new Date(event.startsAt);
  const end = event.endsAt ? new Date(event.endsAt) : start;

  if (end < weekStart) {
    return "passed";
  }

  if (start < weekEnd && end >= weekStart) {
    return "current";
  }

  return "upcoming";
}

export function EventsCarousel({ items }: { items: EventItem[] }) {
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

    const card = viewport.querySelector<HTMLElement>(".event-card");
    const cardWidth = card?.offsetWidth ?? 320;

    viewport.scrollBy({
      left: (cardWidth + 14) * direction,
      behavior: "smooth"
    });
  }

  return (
    <section className="events-strip" aria-label="Events">
      <div className="container events-strip__inner">
        <div className="events-strip__header">
          <div>
            <p className="eyebrow">Events</p>
            <h2>This week and what&apos;s next</h2>
          </div>
          <div className="events-strip__controls" aria-label="Event controls">
            <button
              type="button"
              className="icon-button icon-button--carousel"
              aria-label="Scroll events left"
              onClick={() => scrollByCard(-1)}
              disabled={!canScrollPrev}
            >
              <span aria-hidden="true">&larr;</span>
            </button>
            <button
              type="button"
              className="icon-button icon-button--carousel"
              aria-label="Scroll events right"
              onClick={() => scrollByCard(1)}
              disabled={!canScrollNext}
            >
              <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </div>

        <div className="events-carousel" ref={viewportRef}>
          <div className="events-carousel__track">
            {items.map((event) => {
              const eventState = getEventState(event);

              return (
                <article
                  className={`event-card event-card--${eventState}${
                    event.coverImage ? " event-card--with-media" : ""
                  }`}
                  key={event.slug}
                >
                  {event.coverImage ? (
                    <figure className="event-card__media">
                      <MediaCover
                        asset={event.coverImage}
                        title={event.title}
                        label="Event"
                        description={event.description}
                        compact
                        sizes="(max-width: 900px) 78vw, 360px"
                        transformation={[
                          {
                            width: 640,
                            quality: 82
                          }
                        ]}
                      />
                    </figure>
                  ) : null}
                  <div className="event-card__body">
                    <p className="event-card__state">
                      {eventState === "current"
                        ? "This week"
                        : eventState === "upcoming"
                          ? "Coming up"
                          : "Passed"}
                    </p>
                    <h3>{event.title}</h3>
                    <p className="event-card__date">{event.displayDate}</p>
                    {event.location ? (
                      <p className="event-card__location">{event.location}</p>
                    ) : null}
                    {event.description ? (
                      <p className="event-card__description">
                        {event.description}
                      </p>
                    ) : null}
                    {event.eventUrl ? (
                      <a href={event.eventUrl} target="_blank" rel="noreferrer">
                        View event
                      </a>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
