import type { TableOfContentsItem } from "@/lib/types";

const headingPattern = /<h([23])>([\s\S]*?)<\/h\1>/g;

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function escapeAttribute(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function addHeadingAnchors(contentHtml: string): {
  contentHtml: string;
  tableOfContents: TableOfContentsItem[];
} {
  const counts = new Map<string, number>();
  const tableOfContents: TableOfContentsItem[] = [];

  const html = contentHtml.replace(
    headingPattern,
    (match, levelValue: string, innerHtml: string) => {
      const text = stripHtml(innerHtml);

      if (!text) {
        return match;
      }

      const baseId = slugify(text) || `section-${tableOfContents.length + 1}`;
      const currentCount = (counts.get(baseId) ?? 0) + 1;
      const id = currentCount === 1 ? baseId : `${baseId}-${currentCount}`;

      counts.set(baseId, currentCount);
      tableOfContents.push({
        id,
        text,
        level: Number(levelValue) as 2 | 3
      });

      return `<h${levelValue} id="${escapeAttribute(id)}">${innerHtml}</h${levelValue}>`;
    }
  );

  return {
    contentHtml: html,
    tableOfContents
  };
}

export function splitArticleHtml(contentHtml: string) {
  const paragraphMatches = [...contentHtml.matchAll(/<\/p>/gi)];

  if (paragraphMatches.length >= 2) {
    const marker = paragraphMatches[1];
    const index = (marker.index ?? 0) + marker[0].length;

    return {
      before: contentHtml.slice(0, index),
      after: contentHtml.slice(index)
    };
  }

  if (paragraphMatches.length === 1) {
    const marker = paragraphMatches[0];
    const index = (marker.index ?? 0) + marker[0].length;

    return {
      before: contentHtml.slice(0, index),
      after: contentHtml.slice(index)
    };
  }

  const headingMatch = contentHtml.match(/<\/h[23]>/i);

  if (headingMatch?.index !== undefined) {
    const index = headingMatch.index + headingMatch[0].length;

    return {
      before: contentHtml.slice(0, index),
      after: contentHtml.slice(index)
    };
  }

  return {
    before: contentHtml,
    after: ""
  };
}
