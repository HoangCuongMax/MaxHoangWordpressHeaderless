import type { Metadata } from "next";
import { Space_Grotesk, Instrument_Serif } from "next/font/google";
import "./globals.css";
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
    default: "Max Hoang",
    template: "%s | Max Hoang"
  },
  description:
    "Personal website for publishing essays, documenting projects, and presenting a focused body of work.",
  openGraph: {
    title: "Max Hoang",
    description:
      "Personal website for publishing essays, documenting projects, and presenting a focused body of work.",
    type: "website"
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
          <main className="workspace-content">
            <div className="workspace-content__inner">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
