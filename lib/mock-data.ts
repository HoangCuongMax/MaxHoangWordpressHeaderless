import {
  Award,
  EventItem,
  Post,
  ShortVideo,
  SitePhoto
} from "@/lib/types";
import { heroSliderImages } from "@/lib/hero-slider-images";

export const fallbackSitePhotos: SitePhoto[] = heroSliderImages.map(
  (url, index) => ({
    slug: `hero-photo-${index + 1}`,
    title: `Hero photo ${index + 1}`,
    url,
    alt: `Max Hoang hero photo ${index + 1}`,
    displayLocations: ["hero"],
    sortOrder: index + 1,
    featured: true
  })
);

export const fallbackShortVideos: ShortVideo[] = [
  {
    slug: "short-iowxylgjc3y",
    title: "YouTube Short",
    url: "https://www.youtube.com/shorts/IowxyLGJc3Y",
    youtubeId: "IowxyLGJc3Y",
    displayLocations: ["aboutReels"],
    featured: true
  },
  {
    slug: "short-tmve2nsdwse",
    title: "YouTube Short",
    url: "https://www.youtube.com/shorts/tmVE2nsdWsE",
    youtubeId: "tmVE2nsdWsE",
    displayLocations: ["aboutReels"],
    featured: true
  },
  {
    slug: "short-etukhe77alo",
    title: "YouTube Short",
    url: "https://www.youtube.com/shorts/etuKhe77Alo",
    youtubeId: "etuKhe77Alo",
    displayLocations: ["aboutReels"],
    featured: true
  },
  {
    slug: "short-ap1f-top994",
    title: "YouTube Short",
    url: "https://www.youtube.com/shorts/ap1F-ToP994",
    youtubeId: "ap1F-ToP994",
    displayLocations: ["aboutReels"],
    featured: true
  },
  {
    slug: "short-iv32gulribc",
    title: "YouTube Short",
    url: "https://www.youtube.com/shorts/IV32guLriBc",
    youtubeId: "IV32guLriBc",
    displayLocations: ["aboutReels"],
    featured: true
  },
  {
    slug: "short-pum0wjkb4jw",
    title: "YouTube Short",
    url: "https://www.youtube.com/shorts/pUm0wjkb4jw",
    youtubeId: "pUm0wjkb4jw",
    displayLocations: ["aboutReels"],
    featured: true
  },
  {
    slug: "short-glvaxkih9l8",
    title: "YouTube Short",
    url: "https://www.youtube.com/shorts/glvaxkIH9L8",
    youtubeId: "glvaxkIH9L8",
    displayLocations: ["aboutReels"],
    featured: true
  },
  {
    slug: "short-becugbwdvck",
    title: "YouTube Short",
    url: "https://www.youtube.com/shorts/bEcUgBwDVCk",
    youtubeId: "bEcUgBwDVCk",
    displayLocations: ["aboutReels"],
    featured: true
  },
  {
    slug: "short-enkhma9nn70",
    title: "YouTube Short",
    url: "https://www.youtube.com/shorts/ENKhmA9nn70",
    youtubeId: "ENKhmA9nn70",
    displayLocations: ["aboutReels"],
    featured: true
  },
  {
    slug: "short-0ozc67tvplk",
    title: "YouTube Short",
    url: "https://www.youtube.com/shorts/0OZc67TVplk",
    youtubeId: "0OZc67TVplk",
    displayLocations: ["aboutReels"],
    featured: true
  },
  {
    slug: "short-m6xegeppzhg",
    title: "YouTube Short",
    url: "https://www.youtube.com/shorts/m6xEGEppzHg",
    youtubeId: "m6xEGEppzHg",
    displayLocations: ["aboutReels"],
    featured: true
  }
];

export const fallbackEvents: EventItem[] = [];

export const fallbackPosts: Post[] = [
  {
    slug: "building-reliable-sql-reporting-foundations",
    title: "Building Reliable SQL Reporting Foundations",
    excerpt:
      "Notes on database integrity, query clarity, and designing reporting tables that decision makers can trust.",
    publishedAt: "April 13, 2026",
    readingTime: "5 min read",
    tags: ["SQL", "Data quality", "Reporting"],
    featured: true,
    tableOfContents: [],
    gallery: [],
    contentHtml: `
      <p>Good reporting starts before the dashboard. It starts with clear table structure, consistent definitions, and queries that can be reviewed without guesswork.</p>
      <p>My approach is to make data checks visible: source fields, joins, transformations, and final report logic should all be easy to trace.</p>
      <h2>Why integrity matters</h2>
      <p>When a report supports service decisions, the smallest data mismatch can affect trust. Validation, documentation, and repeatable SQL patterns help protect that trust.</p>
    `
  },
  {
    slug: "power-bi-dashboards-for-service-improvement",
    title: "Power BI Dashboards for Service Improvement",
    excerpt:
      "How I think about turning operational data into useful metrics, visuals, and service improvement conversations.",
    publishedAt: "April 6, 2026",
    readingTime: "4 min read",
    tags: ["Power BI", "Data analytics", "Stakeholders"],
    featured: true,
    tableOfContents: [],
    gallery: [],
    contentHtml: `
      <p>A good dashboard does not just display numbers. It helps teams see what changed, why it matters, and what needs attention next.</p>
      <p>I design Power BI-style reporting around stakeholder questions first, then work backwards into measures, filters, and data quality checks.</p>
    `
  },
  {
    slug: "itil-servicenow-and-clean-documentation",
    title: "ITIL, ServiceNow, and Clean Documentation",
    excerpt:
      "Service improvement depends on accurate records, clear workflows, and documentation that teams can actually use.",
    publishedAt: "March 28, 2026",
    readingTime: "3 min read",
    tags: ["ITIL", "ServiceNow", "Compliance"],
    tableOfContents: [],
    gallery: [],
    contentHtml: `
      <p>ITIL and ServiceNow practices work best when teams share clean records, common definitions, and a simple understanding of what each workflow is meant to achieve.</p>
      <p>For compliance and reporting, documentation is not an afterthought. It is part of the control environment.</p>
    `
  }
];

export const fallbackAwards: Award[] = [
  {
    slug: "rimpa-global-hackathon-winner",
    title: "RIMPA Global Hackathon Winner",
    event: "RIMPA Global Hackathon 2025",
    project: "GreenLedger AI",
    result: "$10,000 prize winner",
    summary:
      "Built GreenLedger AI, a carbon reporting and reduction platform for data and records teams, turning sustainability compliance into a practical workflow.",
    year: 2025,
    tags: ["AI", "Hackathon", "Award", "Innovation"],
    featured: true
  },
  {
    slug: "northern-territory-digital-excellence-award",
    title: "Northern Territory Digital Excellence Award",
    event: "Northern Territory Digital Excellence Awards 2025",
    project: "CDU IT Code Fair project work",
    result: "Recognised by Joshua Burgoyne MLA",
    summary:
      "Recognition for applied AI and product work in the Northern Territory digital community after a strong year of prototype and project delivery.",
    year: 2025,
    tags: ["AI", "Award", "Government", "Innovation"],
    featured: true
  },
  {
    slug: "cdu-it-code-fair-winner",
    title: "CDU IT Code Fair Winner",
    event: "CDU IT Code Fair 2025",
    project: "NT Shift Surge",
    result: "Winning team presentation",
    summary:
      "Presented NT Shift Surge, a concept designed to reduce staffing disruption during the Northern Territory wet season and improve workforce planning.",
    year: 2025,
    tags: ["Award", "Education", "Innovation"],
    featured: true
  },
  {
    slug: "govhack-nt-builder",
    title: "GovHack NT Builder",
    event: "GovHack NT 2025",
    project: "CivicMate and government-service AI ideas",
    result: "Open-data hackathon project delivery",
    summary:
      "Developed AI-assisted concepts focused on helping Australians navigate government services and public-sector information during the GovHack weekend.",
    year: 2025,
    tags: ["AI", "Hackathon", "Government", "Innovation"],
    featured: true
  }
];
