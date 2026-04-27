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
    <section className="section page-intro page-intro--contact">
      <div className="container contact-layout">
        <div className="contact-panel contact-panel--intro">
          <p className="eyebrow">Contact</p>
          <h1>Tell me what you are building and where the bottleneck is.</h1>
          <p className="page-intro__lede">
            Use the form for project enquiries, collaborations, product work, or
            speaking requests. If the brief is clear, I can usually reply with
            next steps quickly.
          </p>

          <dl className="contact-facts">
            {contactPoints.map((point) => (
              <div key={point.label}>
                <dt>{point.label}</dt>
                <dd>{point.value}</dd>
              </div>
            ))}
          </dl>

          <div className="contact-panel__notes">
            <div className="contact-note">
              <h2>What helps me reply faster</h2>
              <p>
                Include the project scope, any launch deadline, the main decision
                you are trying to make, and links to anything already live.
              </p>
            </div>
            <div className="contact-note">
              <h2>Prefer direct email?</h2>
              <p>
                You can also write to{" "}
                <a className="text-link" href="mailto:hoangngoccuong1414@gmail.com">
                  hoangngoccuong1414@gmail.com
                </a>
                .
              </p>
            </div>
          </div>
        </div>

        <div className="contact-panel contact-panel--form">
          <p className="contact-panel__label">Send a message</p>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
