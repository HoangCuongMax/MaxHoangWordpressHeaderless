"use client";

import { useEffect, useState } from "react";

const dismissedStorageKey = "maxhoang-newsletter-dismissed";
const subscribedStorageKey = "maxhoang-newsletter-subscribed";

type PopupStatus =
  | { type: "idle"; message: string }
  | { type: "loading"; message: string }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

const initialStatus: PopupStatus = {
  type: "idle",
  message: ""
};

export function NewsletterPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [status, setStatus] = useState<PopupStatus>(initialStatus);

  useEffect(() => {
    const dismissed = window.localStorage.getItem(dismissedStorageKey) === "1";
    const subscribed = window.localStorage.getItem(subscribedStorageKey) === "1";

    if (dismissed || subscribed) {
      return;
    }

    const timer = window.setTimeout(() => {
      setIsVisible(true);
    }, 900);

    return () => window.clearTimeout(timer);
  }, []);

  function dismissPopup() {
    window.localStorage.setItem(dismissedStorageKey, "1");
    setIsVisible(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus({
      type: "loading",
      message: "Saving your email..."
    });

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: formData.get("email"),
          website: formData.get("website")
        })
      });

      const payload = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        throw new Error(
          payload.error ??
            "Unable to save your email right now. Please try again later."
        );
      }

      window.localStorage.setItem(subscribedStorageKey, "1");
      form.reset();
      setStatus({
        type: "success",
        message:
          payload.message ??
          "You are on the monthly list. Mailchimp can be connected later."
      });

      window.setTimeout(() => {
        setIsVisible(false);
      }, 2200);
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to save your email right now. Please try again later."
      });
    }
  }

  if (!isVisible) {
    return null;
  }

  return (
    <aside className="newsletter-popup" aria-label="Monthly mailing list signup">
      <div className="newsletter-popup__card">
        <div className="newsletter-popup__header">
          <div>
            <p className="eyebrow">Monthly mailing list</p>
            <h2>Get one email a month with new writing and product updates.</h2>
          </div>
          <button
            type="button"
            className="icon-button icon-button--small"
            onClick={dismissPopup}
            aria-label="Dismiss mailing list signup"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <form className="newsletter-popup__form" onSubmit={handleSubmit}>
          <label className="form-field form-field--compact">
            <span>Email</span>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>
          <input
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            className="form-trap"
            aria-hidden="true"
          />
          <button
            type="submit"
            className="button button--primary newsletter-popup__submit"
            disabled={status.type === "loading"}
          >
            {status.type === "loading" ? "Saving..." : "Subscribe"}
          </button>
        </form>

        {status.message ? (
          <p
            className={`form-feedback form-feedback--${status.type}`}
            aria-live="polite"
          >
            {status.message}
          </p>
        ) : null}
      </div>
    </aside>
  );
}
