import { ContactForm } from "@/components/contact-form";

export const metadata = {
  title: "Contact"
};

const contactPoints = [
  {
    label: "Email",
    value: "hoangngoccuong1414@gmail.com"
  },
  {
    label: "Base",
    value: "Darwin, Northern Territory"
  },
  {
    label: "Best fit",
    value: "AI websites, product builds, automation, and collaboration"
  }
];

export default function ContactPage() {
  return (
    <div className="notion-page">
      <header className="notion-page__header">
        <p className="notion-page__eyebrow">Contact</p>
        <h1>Tell me what you are building.</h1>
        <p className="notion-page__lede">
          The form below is a direct way to start a conversation about a site,
          product, or automation.
        </p>
      </header>

      <section className="notion-section">
        <div className="notion-section__head">
          <h2>Quick notes</h2>
        </div>
        <div className="notion-list">
          {contactPoints.map((point) => (
            <div key={point.label} className="notion-row">
              <span className="notion-row__title">{point.label}</span>
              <span className="notion-row__summary">{point.value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="notion-section">
        <div className="notion-section__head">
          <h2>Send a message</h2>
        </div>
        <ContactForm />
      </section>
    </div>
  );
}
