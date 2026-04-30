import { BlogIndex } from "@/components/blog-index";

export const metadata = {
  title: "Data & AI Blog"
};

type BlogPageProps = {
  searchParams?: Promise<{
    tag?: string;
  }>;
};

export default async function BlogIndexPage({ searchParams }: BlogPageProps) {
  return <BlogIndex searchParams={searchParams} basePath="/blog" />;
}
