import type { Metadata } from "next";
import { Space_Grotesk, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { NewsletterPopup } from "@/components/newsletter-popup";
import { SiteFooter } from "@/components/site-footer";
import { WorkspaceSidebar } from "@/components/workspace-sidebar";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const sans = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"]
});

const serif = Instrument_Serif({
  variable: "--font-serif",
  weight: "400",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Max Hoang Journal",
    template: "%s | Max Hoang Journal"
  },
  description:
    "AI Visionary - mapping practical intelligence, better services, and data-powered ideas.",
  icons: {
    icon: [
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }]
  },
  openGraph: {
    title: "Max Hoang Journal",
    description:
      "AI Visionary - mapping practical intelligence, better services, and data-powered ideas.",
    type: "website",
    images: [
      {
        url: "/max-hoang-portrait.jpg",
        width: 1024,
        height: 1024,
        alt: "Max Hoang"
      }
    ]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${serif.variable}`}>
        <div className="workspace-shell">
          <WorkspaceSidebar />
          <div className="workspace-main">
            <main className="workspace-content">
              <div className="workspace-content__inner">{children}</div>
            </main>
            <SiteFooter />
          </div>
          <NewsletterPopup />
        </div>
      </body>
    </html>
  );
}
