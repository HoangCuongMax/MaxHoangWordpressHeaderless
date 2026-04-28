import Link from "next/link";

const designTalkingPoints = [
  "Custom websites that feel tailored instead of templated.",
  "Simple editing flows so you can update content without friction.",
  "Fast frontend delivery with clean structure and less plugin clutter.",
  "Separation between design and content so the site can scale cleanly."
];

const supportingServices = [
  {
    name: "Notion-backed content platforms",
    summary:
      "Custom frontends connected to structured content so the publishing flow stays simple."
  },
  {
    name: "AI-powered website features",
    summary:
      "Chatbots, helpers, and automations that make the site more useful."
  },
  {
    name: "Portfolio and project platforms",
    summary:
      "Clear archives for blogs, case studies, services, and product work."
  }
];

export const metadata = {
  title: "Services"
};

export default function ServicesPage() {
  return (
    <div className="notion-page">
      <header className="notion-page__header">
        <p className="notion-page__eyebrow">Services</p>
        <h1>Clean websites and simple content systems.</h1>
        <p className="notion-page__lede">
          A focused set of services for people who want a clear site that is easy
          to manage and pleasant to read.
        </p>
        <div className="notion-page__actions">
          <a
            href="https://www.linkedin.com/in/maxhoangau/"
            className="workspace-button workspace-button--primary"
            target="_blank"
            rel="noreferrer"
          >
            Connect on LinkedIn
          </a>
          <Link href="/projects" className="workspace-button">
            See projects
          </Link>
        </div>
      </header>

      <section className="notion-section">
        <div className="notion-section__head">
          <h2>What I build</h2>
          <p>Short, practical, and easy to maintain.</p>
        </div>
        <div className="notion-list">
          {designTalkingPoints.map((point, index) => (
            <div key={point} className="notion-row notion-row--article">
              <span className="notion-row__title">{String(index + 1).padStart(2, "0")}</span>
              <span className="notion-row__summary">{point}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="notion-section">
        <div className="notion-section__head">
          <h2>Other ways I can help</h2>
        </div>
        <div className="notion-list">
          {supportingServices.map((service) => (
            <div key={service.name} className="notion-row">
              <span className="notion-row__title">{service.name}</span>
              <span className="notion-row__summary">{service.summary}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
