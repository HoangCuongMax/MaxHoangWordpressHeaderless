"use client";

import { useState } from "react";

type ContactStatus =
  | { type: "idle"; message: string }
  | { type: "loading"; message: string }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

const initialStatus: ContactStatus = {
  type: "idle",
  message: ""
};

export function ContactForm() {
  const [status, setStatus] = useState<ContactStatus>(initialStatus);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus({
      type: "loading",
      message: "Sending your message..."
    });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          company: formData.get("company"),
          interest: formData.get("interest"),
          message: formData.get("message"),
          website: formData.get("website")
        })
      });

      const payload = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        throw new Error(
          payload.error ??
            "Something went wrong while sending your message. Please try again."
        );
      }

      form.reset();
      setStatus({
        type: "success",
        message:
          payload.message ??
          "Thanks. Your message has been sent and I will get back to you soon."
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong while sending your message. Please try again."
      });
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-form__grid">
        <label className="form-field">
          <span>Name</span>
          <input name="name" type="text" autoComplete="name" required />
        </label>

        <label className="form-field">
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
      </div>

      <div className="contact-form__grid">
        <label className="form-field">
          <span>Company or organisation</span>
          <input name="company" type="text" autoComplete="organization" />
        </label>

        <label className="form-field">
          <span>What is this about?</span>
          <select name="interest" defaultValue="Website project">
            <option>Website project</option>
            <option>AI workflow or automation</option>
            <option>App or product build</option>
            <option>Collaboration or speaking</option>
            <option>Something else</option>
          </select>
        </label>
      </div>

      <label className="form-field">
        <span>Message</span>
        <textarea
          name="message"
          rows={7}
          placeholder="Share the context, what you need, and any timing constraints."
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

      <div className="form-actions">
        <button
          type="submit"
          className="button button--primary"
          disabled={status.type === "loading"}
        >
          {status.type === "loading" ? "Sending..." : "Send message"}
        </button>
        <a className="text-link" href="mailto:hoangngoccuong1414@gmail.com">
          Email directly
        </a>
      </div>

      {status.message ? (
        <p
          className={`form-feedback form-feedback--${status.type}`}
          aria-live="polite"
        >
          {status.message}
        </p>
      ) : null}
    </form>
  );
}
