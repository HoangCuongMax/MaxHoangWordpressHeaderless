import {
  Award,
  EventItem,
  MediaAsset,
  PhotoDisplayLocation,
  Post,
  ShortVideo,
  SitePhoto,
  VideoDisplayLocation
} from "@/lib/types";

const NOTION_API_BASE = "https://api.notion.com/v1";
const DEFAULT_NOTION_VERSION = "2026-03-11";
const DEFAULT_REVALIDATE_SECONDS = 300;
const DEFAULT_IMAGEKIT_URL_ENDPOINT = "https://ik.imagekit.io/maxhoang";

export type ContentSource =
  | "blog"
  | "awards"
  | "shortVideos"
  | "photos"
  | "events";

type NotionRichText = {
  plain_text?: string;
  href?: string | null;
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
    code?: boolean;
  };
  text?: {
    content?: string;
  };
};

type NotionProperty = {
  type?: string;
  [key: string]: unknown;
};

type NotionPage = {
  id: string;
  object?: string;
  created_time?: string;
  last_edited_time?: string;
  cover?: unknown;
  properties?: Record<string, NotionProperty>;
};

type NotionBlock = {
  id: string;
  type?: string;
  has_children?: boolean;
  [key: string]: unknown;
};

type RenderableBlock = NotionBlock & {
  children?: RenderableBlock[];
};

type DataSourceConfig = {
  dataSourceId?: string;
  databaseId?: string;
};

type DataSourceEnvConfig = {
  dataSourceEnv: string[];
  databaseEnv: string[];
};

type NotionQueryResponse = {
  results?: NotionPage[];
  has_more?: boolean;
  next_cursor?: string | null;
};

type NotionBlocksResponse = {
  results?: NotionBlock[];
  has_more?: boolean;
  next_cursor?: string | null;
};

type NotionDatabaseResponse = {
  data_sources?: Array<{
    id?: string;
  }>;
};

type Sortable<T> = T & {
  sortDate: string;
};

const dataSourceIdCache = new Map<ContentSource, string>();

const DATA_SOURCE_ENV: Record<ContentSource, DataSourceEnvConfig> = {
  blog: {
    dataSourceEnv: ["NOTION_BLOG_DATA_SOURCE_ID", "NOTION_POSTS_DATA_SOURCE_ID"],
    databaseEnv: ["NOTION_BLOG_DATABASE_ID", "NOTION_POSTS_DATABASE_ID"]
  },
  awards: {
    dataSourceEnv: [
      "NOTION_AWARDS_DATA_SOURCE_ID",
      "NOTION_AWARD_DATA_SOURCE_ID"
    ],
    databaseEnv: ["NOTION_AWARDS_DATABASE_ID", "NOTION_AWARD_DATABASE_ID"]
  },
  shortVideos: {
    dataSourceEnv: [
      "NOTION_SHORT_VIDEOS_DATA_SOURCE_ID",
      "NOTION_REELS_DATA_SOURCE_ID",
      "NOTION_SHORTS_DATA_SOURCE_ID"
    ],
    databaseEnv: [
      "NOTION_SHORT_VIDEOS_DATABASE_ID",
      "NOTION_REELS_DATABASE_ID",
      "NOTION_SHORTS_DATABASE_ID"
    ]
  },
  photos: {
    dataSourceEnv: [
      "NOTION_PHOTOS_DATA_SOURCE_ID",
      "NOTION_MEDIA_DATA_SOURCE_ID",
      "NOTION_IMAGES_DATA_SOURCE_ID"
    ],
    databaseEnv: [
      "NOTION_PHOTOS_DATABASE_ID",
      "NOTION_MEDIA_DATABASE_ID",
      "NOTION_IMAGES_DATABASE_ID"
    ]
  },
  events: {
    dataSourceEnv: [
      "NOTION_EVENTS_DATA_SOURCE_ID",
      "NOTION_EVENT_DATA_SOURCE_ID"
    ],
    databaseEnv: ["NOTION_EVENTS_DATABASE_ID", "NOTION_EVENT_DATABASE_ID"]
  }
};

function readEnv(names: string[]) {
  for (const name of names) {
    const value = process.env[name]?.trim();

    if (value) {
      return value;
    }
  }

  return undefined;
}

function getNotionToken() {
  return readEnv(["NOTION_API_KEY", "NOTION_TOKEN"]);
}

function getNotionVersion() {
  return process.env.NOTION_VERSION?.trim() || DEFAULT_NOTION_VERSION;
}

function getRevalidateSeconds() {
  const value = Number(process.env.NOTION_REVALIDATE_SECONDS);
  return Number.isFinite(value) && value > 0
    ? value
    : DEFAULT_REVALIDATE_SECONDS;
}

function getImageKitUrlEndpoint() {
  return (
    process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT?.trim() ||
    DEFAULT_IMAGEKIT_URL_ENDPOINT
  ).replace(/\/$/, "");
}

function getDataSourceConfig(source: ContentSource): DataSourceConfig {
  const config = DATA_SOURCE_ENV[source];
  return {
    dataSourceId: readEnv(config.dataSourceEnv),
    databaseId: readEnv(config.databaseEnv)
  };
}

export function hasNotionConfig(source: ContentSource) {
  const config = getDataSourceConfig(source);
  return Boolean(getNotionToken() && (config.dataSourceId || config.databaseId));
}

async function notionRequest<T>(
  path: string,
  init: RequestInit = {}
): Promise<T | undefined> {
  const token = getNotionToken();

  if (!token) {
    return undefined;
  }

  try {
    const response = await fetch(`${NOTION_API_BASE}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Notion-Version": getNotionVersion(),
        ...init.headers
      },
      next: {
        revalidate: getRevalidateSeconds(),
        tags: ["notion"]
      }
    });

    if (!response.ok) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`Notion request failed: ${response.status} ${path}`);
      }

      return undefined;
    }

    return (await response.json()) as T;
  } catch {
    return undefined;
  }
}

async function getDataSourceId(source: ContentSource) {
  const cached = dataSourceIdCache.get(source);

  if (cached) {
    return cached;
  }

  const config = getDataSourceConfig(source);

  if (config.dataSourceId) {
    dataSourceIdCache.set(source, config.dataSourceId);
    return config.dataSourceId;
  }

  if (!config.databaseId) {
    return undefined;
  }

  const database = await notionRequest<NotionDatabaseResponse>(
    `/databases/${encodeURIComponent(config.databaseId)}`
  );
  const dataSourceId = database?.data_sources?.[0]?.id;

  if (dataSourceId) {
    dataSourceIdCache.set(source, dataSourceId);
  }

  return dataSourceId;
}

async function queryDataSource(source: ContentSource, limit: number) {
  const dataSourceId = await getDataSourceId(source);

  if (!dataSourceId) {
    return [];
  }

  const pages: NotionPage[] = [];
  let startCursor: string | undefined;

  do {
    const response = await notionRequest<NotionQueryResponse>(
      `/data_sources/${encodeURIComponent(dataSourceId)}/query`,
      {
        method: "POST",
        body: JSON.stringify({
          page_size: Math.min(100, limit - pages.length),
          ...(startCursor ? { start_cursor: startCursor } : {})
        })
      }
    );

    const results = response?.results ?? [];
    pages.push(...results.filter((result) => result.object !== "data_source"));

    startCursor = response?.next_cursor ?? undefined;

    if (!response?.has_more || pages.length >= limit) {
      break;
    }
  } while (startCursor);

  return pages.slice(0, limit);
}

async function fetchBlockChildren(blockId: string): Promise<RenderableBlock[]> {
  const blocks: RenderableBlock[] = [];
  let startCursor: string | undefined;

  do {
    const query = new URLSearchParams({
      page_size: "100",
      ...(startCursor ? { start_cursor: startCursor } : {})
    });
    const response = await notionRequest<NotionBlocksResponse>(
      `/blocks/${encodeURIComponent(blockId)}/children?${query.toString()}`
    );
    const results = response?.results ?? [];

    for (const block of results) {
      blocks.push({
        ...block,
        children: block.has_children
          ? await fetchBlockChildren(block.id)
          : undefined
      });
    }

    startCursor = response?.next_cursor ?? undefined;

    if (!response?.has_more) {
      break;
    }
  } while (startCursor);

  return blocks;
}

async function fetchPageContentHtml(pageId: string) {
  const blocks = await fetchBlockChildren(pageId);
  return blocksToHtml(blocks).trim();
}

function asObject(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function asString(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttribute(value: string) {
  return escapeHtml(value).replace(/'/g, "&#39;");
}

function isSafeUrl(value: string) {
  try {
    const url = new URL(value);
    return ["http:", "https:", "mailto:"].includes(url.protocol);
  } catch {
    return value.startsWith("/");
  }
}

function getRenderableMediaUrl(value: string, transformation?: string) {
  const urlEndpoint = getImageKitUrlEndpoint();
  const trimmedValue = value.trim();
  const transform = transformation?.trim();
  let mediaUrl = trimmedValue;

  if (!mediaUrl) {
    return undefined;
  }

  if (!isSafeUrl(mediaUrl)) {
    return undefined;
  }

  if (mediaUrl.startsWith("/") && urlEndpoint) {
    mediaUrl = `${urlEndpoint}${mediaUrl}`;
  }

  if (!isSafeUrl(mediaUrl)) {
    return undefined;
  }

  const shouldTransform =
    Boolean(transform) &&
    (mediaUrl.includes("ik.imagekit.io") ||
      Boolean(urlEndpoint && mediaUrl.startsWith(urlEndpoint)));

  if (!shouldTransform) {
    return mediaUrl;
  }

  try {
    const url = new URL(mediaUrl);

    if (transform && !url.searchParams.has("tr")) {
      url.searchParams.set("tr", transform);
    }

    return url.toString();
  } catch {
    return mediaUrl;
  }
}

function richTextPlain(richText: NotionRichText[]) {
  return richText
    .map((part) => part.plain_text ?? part.text?.content ?? "")
    .join("")
    .trim();
}

function richTextToHtml(richText: NotionRichText[]) {
  return richText
    .map((part) => {
      let content = escapeHtml(part.plain_text ?? part.text?.content ?? "");
      const annotations = part.annotations;

      if (annotations?.code) content = `<code>${content}</code>`;
      if (annotations?.bold) content = `<strong>${content}</strong>`;
      if (annotations?.italic) content = `<em>${content}</em>`;
      if (annotations?.underline) content = `<u>${content}</u>`;
      if (annotations?.strikethrough) content = `<s>${content}</s>`;

      if (part.href && isSafeUrl(part.href)) {
        content = `<a href="${escapeAttribute(
          part.href
        )}" target="_blank" rel="noreferrer">${content}</a>`;
      }

      return content;
    })
    .join("");
}

function getBlockData(block: NotionBlock) {
  return block.type ? asObject(block[block.type]) : undefined;
}

function getBlockRichText(block: NotionBlock) {
  return asArray<NotionRichText>(getBlockData(block)?.rich_text);
}

function getFileUrl(value: unknown) {
  const file = asObject(value);
  const type = asString(file?.type);

  if (type === "external") {
    return asString(asObject(file?.external)?.url);
  }

  if (type === "file") {
    return asString(asObject(file?.file)?.url);
  }

  return undefined;
}

function splitMediaUrls(value: string | undefined) {
  return value
    ? value
        .split(/\r?\n|;\s*/)
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
}

function propertyMediaUrls(property: NotionProperty | undefined) {
  if (!property?.type) {
    return [];
  }

  if (property.type === "files") {
    return asArray<unknown>(property.files)
      .map(getFileUrl)
      .filter((url): url is string => Boolean(url));
  }

  return splitMediaUrls(propertyText(property));
}

function toMediaAsset(
  url: string | undefined,
  alt: string,
  caption?: string
): MediaAsset | undefined {
  const mediaUrl = getImageMediaUrl(url);

  if (!mediaUrl || !getRenderableMediaUrl(mediaUrl)) {
    return undefined;
  }

  return {
    url: mediaUrl,
    alt,
    ...(caption ? { caption } : {})
  };
}

function getImageMediaUrl(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  return getYouTubeThumbnailUrl(value) ?? value;
}

function getYouTubeThumbnailUrl(value: string | undefined) {
  const youtubeId = getYouTubeId(value);

  return youtubeId
    ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`
    : undefined;
}

function renderListItem(block: RenderableBlock) {
  const body = richTextToHtml(getBlockRichText(block));
  const children = block.children?.length ? blocksToHtml(block.children) : "";
  return `<li>${body}${children}</li>`;
}

function renderBlock(block: RenderableBlock) {
  const data = getBlockData(block);
  const richText = getBlockRichText(block);
  const html = richTextToHtml(richText);
  const children = block.children?.length ? blocksToHtml(block.children) : "";

  switch (block.type) {
    case "paragraph":
      return html || children ? `<p>${html}</p>${children}` : "";
    case "heading_1":
    case "heading_2":
      return `<h2>${html}</h2>${children}`;
    case "heading_3":
      return `<h3>${html}</h3>${children}`;
    case "quote":
    case "callout":
      return `<blockquote>${html}${children}</blockquote>`;
    case "to_do": {
      const checked = Boolean(data?.checked);
      return `<p>${checked ? "[x]" : "[ ]"} ${html}</p>${children}`;
    }
    case "code": {
      const plain = richTextPlain(richText);
      const language = asString(data?.language);
      return `<pre${
        language ? ` data-language="${escapeAttribute(language)}"` : ""
      }><code>${escapeHtml(plain)}</code></pre>`;
    }
    case "divider":
      return "<hr />";
    case "image": {
      const src = getFileUrl(data);
      const caption = richTextToHtml(
        asArray<NotionRichText>(data?.caption)
      );
      const imageUrl = src
        ? getRenderableMediaUrl(src, "w-1200,q-82")
        : undefined;

      if (!imageUrl) {
        return "";
      }

      return `<figure><img src="${escapeAttribute(
        imageUrl
      )}" alt="${escapeAttribute(
        richTextPlain(asArray<NotionRichText>(data?.caption))
      )}" />${caption ? `<figcaption>${caption}</figcaption>` : ""}</figure>`;
    }
    case "bookmark":
    case "embed":
    case "link_preview": {
      const url = asString(data?.url);
      return url && isSafeUrl(url)
        ? `<p><a href="${escapeAttribute(
            url
          )}" target="_blank" rel="noreferrer">${escapeHtml(url)}</a></p>`
        : "";
    }
    default:
      return children;
  }
}

function blocksToHtml(blocks: RenderableBlock[]) {
  let html = "";

  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];

    if (block.type === "bulleted_list_item") {
      const items: string[] = [];

      while (blocks[index]?.type === "bulleted_list_item") {
        items.push(renderListItem(blocks[index]));
        index += 1;
      }

      index -= 1;
      html += `<ul>${items.join("")}</ul>`;
      continue;
    }

    if (block.type === "numbered_list_item") {
      const items: string[] = [];

      while (blocks[index]?.type === "numbered_list_item") {
        items.push(renderListItem(blocks[index]));
        index += 1;
      }

      index -= 1;
      html += `<ol>${items.join("")}</ol>`;
      continue;
    }

    html += renderBlock(block);
  }

  return html;
}

function getPropertyByName(
  properties: Record<string, NotionProperty> | undefined,
  names: string[]
) {
  if (!properties) {
    return undefined;
  }

  const normalizedNames = names.map((name) => name.toLowerCase());
  const match = Object.entries(properties).find(([name]) =>
    normalizedNames.includes(name.toLowerCase())
  );

  return match?.[1];
}

function getPropertyByType(
  properties: Record<string, NotionProperty> | undefined,
  type: string
) {
  return Object.values(properties ?? {}).find((property) => property.type === type);
}

function propertyText(property: NotionProperty | undefined) {
  if (!property?.type) {
    return undefined;
  }

  if (property.type === "title" || property.type === "rich_text") {
    return richTextPlain(asArray<NotionRichText>(property[property.type]));
  }

  if (property.type === "select" || property.type === "status") {
    return asString(asObject(property[property.type])?.name);
  }

  if (["url", "email", "phone_number"].includes(property.type)) {
    return asString(property[property.type]);
  }

  if (property.type === "number") {
    const value = property.number;
    return typeof value === "number" ? String(value) : undefined;
  }

  if (property.type === "formula") {
    const formula = asObject(property.formula);
    const formulaType = asString(formula?.type);

    if (formulaType === "string") return asString(formula?.string);
    if (formulaType === "number" && typeof formula?.number === "number") {
      return String(formula.number);
    }
    if (formulaType === "boolean" && typeof formula?.boolean === "boolean") {
      return String(formula.boolean);
    }
  }

  return undefined;
}

function propertyDate(property: NotionProperty | undefined) {
  if (!property?.type) {
    return undefined;
  }

  if (property.type === "date") {
    return asString(asObject(property.date)?.start);
  }

  if (property.type === "formula") {
    const formula = asObject(property.formula);
    const formulaDate = asObject(formula?.date);
    return asString(formulaDate?.start);
  }

  return undefined;
}

function propertyNumber(property: NotionProperty | undefined) {
  if (!property?.type) {
    return undefined;
  }

  if (property.type === "number" && typeof property.number === "number") {
    return property.number;
  }

  if (property.type === "formula") {
    const formula = asObject(property.formula);

    if (typeof formula?.number === "number") {
      return formula.number;
    }
  }

  const text = propertyText(property);
  const value = text ? Number(text) : Number.NaN;

  return Number.isFinite(value) ? value : undefined;
}

function propertyCheckbox(property: NotionProperty | undefined) {
  return property?.type === "checkbox" && typeof property.checkbox === "boolean"
    ? property.checkbox
    : undefined;
}

function propertyTags(property: NotionProperty | undefined) {
  if (!property?.type) {
    return [];
  }

  if (property.type === "multi_select") {
    return asArray<Record<string, unknown>>(property.multi_select)
      .map((tag) => asString(tag.name))
      .filter((tag): tag is string => Boolean(tag));
  }

  const text = propertyText(property);
  return text
    ? text
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];
}

function getTitle(page: NotionPage) {
  return (
    propertyText(getPropertyByName(page.properties, ["Title", "Name"])) ??
    propertyText(getPropertyByType(page.properties, "title")) ??
    "Untitled"
  );
}

function getSlug(page: NotionPage, title: string) {
  const slug =
    propertyText(
      getPropertyByName(page.properties, ["Slug", "URL Slug", "Path"])
    ) ?? slugify(title);

  return slug || page.id;
}

function getExcerpt(page: NotionPage, contentHtml: string) {
  return (
    propertyText(
      getPropertyByName(page.properties, [
        "Excerpt",
        "Summary",
        "Description",
        "Subtitle"
      ])
    ) ?? stripHtml(contentHtml).slice(0, 180).trim()
  );
}

function getMediaAltText(page: NotionPage, title: string) {
  return (
    propertyText(
      getPropertyByName(page.properties, [
        "Media Alt Text",
        "Alt Text",
        "Image Alt Text"
      ])
    ) ?? `${title} media`
  );
}

function getCoverImage(page: NotionPage, title: string) {
  const alt = getMediaAltText(page, title);
  const coverProperty = getPropertyByName(page.properties, [
    "Cover Photo",
    "Cover Photo URL",
    "Cover Image",
    "Cover Image URL",
    "Hero Image",
    "Hero Image URL",
    "Image",
    "Image URL",
    "Thumbnail",
    "Thumbnail URL"
  ]);
  const [propertyCover] = propertyMediaUrls(coverProperty);
  const pageCover = getFileUrl(page.cover);

  return toMediaAsset(propertyCover ?? pageCover, alt);
}

function getGallery(page: NotionPage, title: string) {
  const alt = getMediaAltText(page, title);
  const galleryProperty = getPropertyByName(page.properties, [
    "Gallery",
    "Gallery URLs",
    "Media Gallery",
    "Images",
    "Image Gallery"
  ]);

  return propertyMediaUrls(galleryProperty)
    .map((url, index) => toMediaAsset(url, `${alt} ${index + 1}`))
    .filter((asset): asset is MediaAsset => Boolean(asset));
}

function propertyDateEnd(property: NotionProperty | undefined) {
  if (!property?.type) {
    return undefined;
  }

  if (property.type === "date") {
    return asString(asObject(property.date)?.end);
  }

  if (property.type === "formula") {
    const formula = asObject(property.formula);
    const formulaDate = asObject(formula?.date);
    return asString(formulaDate?.end);
  }

  return undefined;
}

function getPhotoUrl(page: NotionPage) {
  const photoProperty = getPropertyByName(page.properties, [
    "Photo",
    "Photo URL",
    "Image",
    "Image URL",
    "Media",
    "Media URL",
    "File",
    "Files",
    "URL",
    "Link"
  ]);
  const [photoUrl] = propertyMediaUrls(photoProperty);
  const pageCover = getFileUrl(page.cover);

  return photoUrl ?? pageCover;
}

function getVideoUrl(page: NotionPage) {
  const videoProperty = getPropertyByName(page.properties, [
    "Video URL",
    "Video",
    "Demo Video",
    "Media Video"
  ]);
  const [videoUrl] = propertyMediaUrls(videoProperty);

  return videoUrl && getRenderableMediaUrl(videoUrl) ? videoUrl : undefined;
}

function getDateValue(page: NotionPage) {
  return (
    propertyDate(
      getPropertyByName(page.properties, [
        "Published",
        "Published At",
        "Publish Date",
        "Date"
      ])
    ) ??
    page.created_time ??
    page.last_edited_time ??
    new Date().toISOString()
  );
}

function isVisiblePage(page: NotionPage) {
  const publishedFlag = propertyCheckbox(
    getPropertyByName(page.properties, ["Published", "Public", "Visible"])
  );

  if (typeof publishedFlag === "boolean") {
    return publishedFlag;
  }

  const status = propertyText(
    getPropertyByName(page.properties, ["Publish Status", "Status", "State"])
  )?.toLowerCase();

  if (!status) {
    return true;
  }

  return !["archived", "draft", "hidden", "private", "unpublished"].includes(
    status
  );
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function getReadingTime(html: string) {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 220));
  return `${minutes} min read`;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(date));
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function mapPost(page: NotionPage): Promise<Sortable<Post>> {
  const contentHtml = await fetchPageContentHtml(page.id);
  const title = getTitle(page);
  const sortDate = getDateValue(page);

  return {
    slug: getSlug(page, title),
    title,
    excerpt: getExcerpt(page, contentHtml),
    contentHtml,
    publishedAt: formatDate(sortDate),
    readingTime: getReadingTime(contentHtml),
    tags: propertyTags(
      getPropertyByName(page.properties, [
        "Tags",
        "Categories",
        "Category",
        "Topics",
        "Topic"
      ])
    ),
    tableOfContents: [],
    coverImage: getCoverImage(page, title),
    gallery: getGallery(page, title),
    videoUrl: getVideoUrl(page),
    featured: propertyCheckbox(
      getPropertyByName(page.properties, ["Featured", "Homepage", "Pinned"])
    ),
    sortDate
  };
}

function getReferenceUrl(page: NotionPage) {
  const url = propertyText(
      getPropertyByName(page.properties, [
        "Reference URL",
        "Event URL",
        "Link",
        "URL"
    ])
  );

  return url && isSafeUrl(url) ? url : undefined;
}

function getShortVideoUrl(page: NotionPage) {
  const url = propertyText(
    getPropertyByName(page.properties, [
      "YouTube URL",
      "Shorts URL",
      "Short URL",
      "Video URL",
      "Video",
      "URL",
      "Link"
    ])
  );

  return url && isSafeUrl(url) ? url : undefined;
}

function getYouTubeId(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  try {
    const url = new URL(value);

    if (url.hostname.includes("youtu.be")) {
      return url.pathname.split("/").filter(Boolean)[0];
    }

    if (url.searchParams.has("v")) {
      return url.searchParams.get("v") ?? undefined;
    }

    const parts = url.pathname.split("/").filter(Boolean);
    const marker = parts.findIndex((part) =>
      ["shorts", "embed", "live"].includes(part)
    );

    if (marker >= 0) {
      return parts[marker + 1];
    }
  } catch {
    return undefined;
  }

  return undefined;
}

type SortableShortVideo = ShortVideo & {
  sortDate: string;
  sortOrder: number;
  featuredRank: number;
};

function getVideoDisplayLocations(page: NotionPage): VideoDisplayLocation[] {
  const values = propertyTags(
    getPropertyByName(page.properties, [
      "Display",
      "Displays",
      "Display Location",
      "Placement",
      "Placements",
      "Show On",
      "Use As"
    ])
  ).map((value) => value.toLowerCase().trim());
  const locations = new Set<VideoDisplayLocation>();

  if (
    values.some((value) =>
      [
        "about reels",
        "about",
        "reels",
        "shorts",
        "short videos",
        "homepage reels"
      ].includes(value)
    ) ||
    propertyCheckbox(
      getPropertyByName(page.properties, ["About Reels", "Reels", "Shorts"])
    )
  ) {
    locations.add("aboutReels");
  }

  return [...locations];
}

function mapShortVideo(page: NotionPage): SortableShortVideo | undefined {
  const title = getTitle(page);
  const url = getShortVideoUrl(page);
  const youtubeId = getYouTubeId(url);
  const displayLocations = getVideoDisplayLocations(page);

  if (!url || !youtubeId || displayLocations.length === 0) {
    return undefined;
  }

  const sortDate = getDateValue(page);
  const featured = propertyCheckbox(
    getPropertyByName(page.properties, ["Featured", "Homepage", "Pinned"])
  );

  return {
    slug: getSlug(page, title),
    title,
    url,
    youtubeId,
    displayLocations,
    summary: propertyText(
      getPropertyByName(page.properties, [
        "Summary",
        "Description",
        "Excerpt",
        "Caption"
      ])
    ),
    publishedAt: formatDate(sortDate),
    featured,
    sortDate,
    sortOrder:
      propertyNumber(
        getPropertyByName(page.properties, ["Sort Order", "Order", "Rank"])
      ) ?? 999,
    featuredRank: featured === false ? 1 : 0
  };
}

function getPhotoDisplayLocations(page: NotionPage): PhotoDisplayLocation[] {
  const values = propertyTags(
    getPropertyByName(page.properties, [
      "Display",
      "Displays",
      "Display Location",
      "Placement",
      "Placements",
      "Show On",
      "Use As"
    ])
  ).map((value) => value.toLowerCase().trim());
  const locations = new Set<PhotoDisplayLocation>();

  if (
    values.some((value) =>
      ["hero", "hero slider", "home hero", "homepage hero", "slider"].includes(
        value
      )
    ) ||
    propertyCheckbox(getPropertyByName(page.properties, ["Hero", "Hero Slider"]))
  ) {
    locations.add("hero");
  }

  if (
    values.some((value) =>
      ["logo", "site logo", "avatar", "profile", "brand"].includes(value)
    ) ||
    propertyCheckbox(getPropertyByName(page.properties, ["Logo", "Site Logo"]))
  ) {
    locations.add("logo");
  }

  return [...locations];
}

type SortableSitePhoto = SitePhoto & {
  sortDate: string;
};

function mapSitePhoto(page: NotionPage): SortableSitePhoto | undefined {
  const title = getTitle(page);
  const url = getPhotoUrl(page);
  const displayLocations = getPhotoDisplayLocations(page);
  const caption = propertyText(
    getPropertyByName(page.properties, ["Caption", "Description", "Summary"])
  );
  const asset = toMediaAsset(url, getMediaAltText(page, title), caption);

  if (!asset || displayLocations.length === 0) {
    return undefined;
  }

  return {
    ...asset,
    slug: getSlug(page, title),
    title,
    displayLocations,
    sortOrder:
      propertyNumber(
        getPropertyByName(page.properties, ["Sort Order", "Order", "Rank"])
      ) ?? 999,
    featured: propertyCheckbox(
      getPropertyByName(page.properties, ["Featured", "Homepage", "Pinned"])
    ),
    sortDate: getDateValue(page)
  };
}

function mapAward(page: NotionPage): Award & {
  sortOrder: number;
  featuredRank: number;
} {
  const title = getTitle(page);
  const year =
    propertyNumber(getPropertyByName(page.properties, ["Year"])) ??
    new Date(getDateValue(page)).getFullYear();
  const featured = propertyCheckbox(
    getPropertyByName(page.properties, ["Featured", "Homepage", "Pinned"])
  );

  return {
    slug: getSlug(page, title),
    title,
    event:
      propertyText(getPropertyByName(page.properties, ["Event", "Program"])) ??
      "",
    project: propertyText(
      getPropertyByName(page.properties, ["Project", "Work", "Project Name"])
    ),
    result:
      propertyText(
        getPropertyByName(page.properties, [
          "Result",
          "Award",
          "Recognition",
          "Prize"
        ])
      ) ?? "",
    summary:
      propertyText(
        getPropertyByName(page.properties, [
          "Summary",
          "Description",
          "Excerpt"
        ])
      ) ?? "",
    year,
    tags: propertyTags(
      getPropertyByName(page.properties, [
        "Tags",
        "Categories",
        "Category"
      ])
    ),
    coverImage: getCoverImage(page, title),
    referenceUrl: getReferenceUrl(page),
    featured,
    sortOrder:
      propertyNumber(
        getPropertyByName(page.properties, ["Sort Order", "Order", "Rank"])
      ) ?? 999,
    featuredRank: featured ? 0 : 1
  };
}

function sortByNewest<T extends { sortDate: string }>(items: T[]) {
  return [...items].sort(
    (first, second) =>
      new Date(second.sortDate).getTime() - new Date(first.sortDate).getTime()
  );
}

function stripSortDate<T extends { sortDate: string }>(
  item: T
): Omit<T, "sortDate"> {
  const { sortDate, ...rest } = item;
  void sortDate;
  return rest;
}

export async function fetchNotionPosts(): Promise<Post[]> {
  const pages = await queryDataSource("blog", 50);
  const posts = await Promise.all(pages.filter(isVisiblePage).map(mapPost));
  return sortByNewest(posts).map(stripSortDate);
}

export async function fetchNotionAwards(): Promise<Award[]> {
  const pages = await queryDataSource("awards", 50);
  const awards = pages.filter(isVisiblePage).map(mapAward);

  return awards
    .sort(
      (first, second) =>
        first.featuredRank - second.featuredRank ||
        first.sortOrder - second.sortOrder ||
        second.year - first.year ||
        first.title.localeCompare(second.title)
    )
    .map(({ sortOrder, featuredRank, ...award }) => {
      void sortOrder;
      void featuredRank;
      return award;
    });
}

function formatEventDate(start: string, end?: string) {
  const formatter = new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
  const startLabel = formatter.format(new Date(start));

  if (!end || end === start) {
    return startLabel;
  }

  return `${startLabel} - ${formatter.format(new Date(end))}`;
}

function mapEvent(page: NotionPage): EventItem & {
  sortDate: string;
  sortOrder: number;
  featuredRank: number;
} {
  const title = getTitle(page);
  const eventDateProperty = getPropertyByName(page.properties, [
    "Event Date",
    "Date",
    "Start Date",
    "Starts At",
    "Start"
  ]);
  const endDateProperty = getPropertyByName(page.properties, [
    "End Date",
    "Ends At",
    "End"
  ]);
  const startsAt =
    propertyDate(eventDateProperty) ??
    page.created_time ??
    new Date().toISOString();
  const endsAt =
    propertyDate(endDateProperty) ?? propertyDateEnd(eventDateProperty);
  const featured = propertyCheckbox(
    getPropertyByName(page.properties, ["Featured", "Homepage", "Pinned"])
  );

  return {
    slug: getSlug(page, title),
    title,
    startsAt,
    endsAt,
    displayDate: formatEventDate(startsAt, endsAt),
    location: propertyText(
      getPropertyByName(page.properties, ["Location", "Venue", "Place"])
    ),
    description: propertyText(
      getPropertyByName(page.properties, [
        "Description",
        "Summary",
        "Excerpt",
        "Caption"
      ])
    ),
    eventUrl: getReferenceUrl(page),
    coverImage: getCoverImage(page, title),
    featured,
    sortDate: startsAt,
    sortOrder:
      propertyNumber(
        getPropertyByName(page.properties, ["Sort Order", "Order", "Rank"])
      ) ?? 999,
    featuredRank: featured ? 0 : 1
  };
}

export async function fetchNotionShortVideos(): Promise<ShortVideo[]> {
  const pages = await queryDataSource("shortVideos", 50);
  const videos = pages
    .filter(isVisiblePage)
    .map(mapShortVideo)
    .filter((video): video is SortableShortVideo => Boolean(video));

  return videos
    .sort(
      (first, second) =>
        first.featuredRank - second.featuredRank ||
        first.sortOrder - second.sortOrder ||
        new Date(second.sortDate).getTime() - new Date(first.sortDate).getTime()
    )
    .map(({ sortDate, sortOrder, featuredRank, ...video }) => {
      void sortDate;
      void sortOrder;
      void featuredRank;
      return video;
    });
}

export async function fetchNotionSitePhotos(): Promise<SitePhoto[]> {
  const pages = await queryDataSource("photos", 100);
  const photos = pages
    .filter(isVisiblePage)
    .map(mapSitePhoto)
    .filter((photo): photo is SortableSitePhoto => Boolean(photo));

  return photos
    .sort(
      (first, second) =>
        first.sortOrder - second.sortOrder ||
        new Date(second.sortDate).getTime() - new Date(first.sortDate).getTime()
    )
    .map(({ sortDate, ...photo }) => {
      void sortDate;
      return photo;
    });
}

export async function fetchNotionEvents(): Promise<EventItem[]> {
  const pages = await queryDataSource("events", 50);
  const events = pages.filter(isVisiblePage).map(mapEvent);

  return events
    .sort(
      (first, second) =>
        first.featuredRank - second.featuredRank ||
        first.sortOrder - second.sortOrder ||
        new Date(first.sortDate).getTime() - new Date(second.sortDate).getTime()
    )
    .map(({ sortDate, sortOrder, featuredRank, ...event }) => {
      void sortDate;
      void sortOrder;
      void featuredRank;
      return event;
    });
}
