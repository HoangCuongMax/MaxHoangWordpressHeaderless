import { ReelsVideoCarousel } from "@/components/reels-video-carousel";
import { getShortVideos } from "@/lib/content";

export const metadata = {
  title: "Connect"
};

const socialLinks = [
  {
    name: "LinkedIn",
    label: "Professional updates",
    description:
      "Service improvement, AI, data analytics, awards, and career updates.",
    href: "https://www.linkedin.com/in/maxhoangau/"
  },
  {
    name: "GitHub",
    label: "Code and repositories",
    description:
      "AI, data, automation, and web projects that show technical delivery.",
    href: "https://github.com/HoangCuongMax"
  },
  {
    name: "YouTube",
    label: "Short videos",
    description:
      "Reels, demos, ideas, and quick behind-the-scenes clips from my work.",
    href: "https://www.youtube.com/shorts/IowxyLGJc3Y"
  },
  {
    name: "Email",
    label: "Direct contact",
    description:
      "For collaborations, data roles, AI projects, speaking, or questions.",
    href: "mailto:hoangngoccuong1414@gmail.com"
  }
];

export default async function ConnectPage() {
  const shortVideos = await getShortVideos();

  return (
    <section className="section connect-page">
      <div className="container">
        <header className="connect-page__header">
          <p className="eyebrow">Connect</p>
          <h1>Find me across the web.</h1>
          <p>
            Social channels, code, short videos, and direct contact in one
            place.
          </p>
        </header>

        <div className="social-grid">
          {socialLinks.map((link) => (
            <a
              className="social-card"
              href={link.href}
              key={link.name}
              target={link.href.startsWith("mailto:") ? undefined : "_blank"}
              rel={link.href.startsWith("mailto:") ? undefined : "noreferrer"}
            >
              <span>{link.label}</span>
              <h2>{link.name}</h2>
              <p>{link.description}</p>
            </a>
          ))}
        </div>

        <section className="connect-reels" aria-label="YouTube short videos">
          <ReelsVideoCarousel items={shortVideos} />
        </section>
      </div>
    </section>
  );
}
