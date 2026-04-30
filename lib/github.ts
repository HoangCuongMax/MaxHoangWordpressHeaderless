export type GitHubRepository = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics?: string[];
  pushed_at: string;
  archived: boolean;
  fork: boolean;
};

export type RepositoryCard = {
  id: number;
  name: string;
  description: string;
  url: string;
  homepage?: string;
  language?: string;
  stars: number;
  forks: number;
  topics: string[];
  updatedAt: string;
};

const githubUsername =
  process.env.GITHUB_USERNAME ||
  process.env.NEXT_PUBLIC_GITHUB_USERNAME ||
  "HoangCuongMax";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

function toRepositoryCard(repo: GitHubRepository): RepositoryCard {
  return {
    id: repo.id,
    name: repo.name,
    description: repo.description ?? "Repository details are available on GitHub.",
    url: repo.html_url,
    ...(repo.homepage ? { homepage: repo.homepage } : {}),
    ...(repo.language ? { language: repo.language } : {}),
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    topics: repo.topics ?? [],
    updatedAt: formatDate(repo.pushed_at)
  };
}

export async function getGithubRepositories(limit?: number) {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28"
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(
    `https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated&type=owner`,
    {
      headers,
      next: {
        revalidate: 1800
      }
    }
  );

  if (!response.ok) {
    return [];
  }

  const repositories = (await response.json()) as GitHubRepository[];
  const visibleRepositories = repositories
    .filter((repo) => !repo.archived && !repo.fork)
    .sort(
      (first, second) =>
        new Date(second.pushed_at).getTime() -
        new Date(first.pushed_at).getTime()
    )
    .map(toRepositoryCard);

  return typeof limit === "number"
    ? visibleRepositories.slice(0, limit)
    : visibleRepositories;
}

export function getGithubProfileUrl() {
  return `https://github.com/${githubUsername}`;
}
