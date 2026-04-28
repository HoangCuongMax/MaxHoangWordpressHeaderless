import Link from "next/link";

const tools = [
  {
    name: "Business Hours Calculation",
    slug: "business-hours-calculation",
    summary:
      "Estimate daily, weekly, and monthly business hours from your schedule."
  },
  {
    name: "Email Signature Generator",
    slug: "email-signature-generator",
    summary:
      "Create a polished email signature and copy the generated HTML."
  }
];

export const metadata = {
  title: "Tools"
};

export default function ToolsPage() {
  return (
    <div className="notion-page">
      <header className="notion-page__header">
        <p className="notion-page__eyebrow">Tools</p>
        <h1>Useful utilities and small product ideas.</h1>
        <p className="notion-page__lede">
          Practical tools presented as a simple list, so the page stays easy to scan.
        </p>
      </header>

      <section className="notion-section">
        <div className="notion-list">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="notion-row notion-row--article"
            >
              <div className="notion-row__stack">
                <span className="notion-row__title">{tool.name}</span>
                <span className="notion-row__summary">{tool.summary}</span>
              </div>
              <span className="notion-row__meta">Open tool</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
