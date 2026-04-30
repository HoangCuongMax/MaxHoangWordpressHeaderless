import { BlogIndex } from "@/components/blog-index";

export const metadata = {
  title: "Data & AI Blog"
};

type HomePageProps = {
  searchParams?: Promise<{
    tag?: string;
  }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  return <BlogIndex searchParams={searchParams} basePath="/" />;
}
