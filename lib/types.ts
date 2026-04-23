export type MediaAsset = {
  url: string;
  alt: string;
  caption?: string;
};

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  publishedAt: string;
  readingTime: string;
  coverImage?: MediaAsset;
  gallery: MediaAsset[];
  videoUrl?: string;
  featured?: boolean;
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  contentHtml: string;
  status: string;
  tags: string[];
  publishedAt?: string;
  coverImage?: MediaAsset;
  gallery: MediaAsset[];
  videoUrl?: string;
  featured?: boolean;
};
