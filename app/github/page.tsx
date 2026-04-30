import Link from "next/link";
import { getGithubProfileUrl, getGithubRepositories } from "@/lib/github";

export const metadata = {
  title: "GitHub"
};

export default async function GithubPage() {
  const repositories = await getGithubRepositories();
  const githubProfileUrl = getGithubProfileUrl();

  return (
    <section className="section github-page">
      <div className="container">
        <header className="github-page__header">
          <p className="eyebrow">GitHub</p>
          <h1>Repository showcase.</h1>
          <p>
            A live view of my public GitHub repositories, sorted by the most
            recently updated work. New public repositories appear here
            automatically.
          </p>
          <div className="hero__actions">
            <a
              href={githubProfileUrl}
              className="button button--primary"
              target="_blank"
              rel="noreferrer"
            >
              View GitHub profile
            </a>
            <Link href="/contact" className="button button--ghost">
              Collaborate
            </Link>
          </div>
        </header>

        <div className="repo-grid">
          {repositories.length > 0 ? (
            repositories.map((repo) => (
              <article className="repo-card" key={repo.id}>
                <div className="repo-card__topline">
                  <p>{repo.language ?? "Repository"}</p>
                  <span>Updated {repo.updatedAt}</span>
                </div>
                <h2>
                  <a href={repo.url} target="_blank" rel="noreferrer">
                    {repo.name}
                  </a>
                </h2>
                <p>{repo.description}</p>
                {repo.topics.length > 0 ? (
                  <ul className="repo-card__topics" aria-label={`${repo.name} topics`}>
                    {repo.topics.slice(0, 4).map((topic) => (
                      <li key={topic}>{topic}</li>
                    ))}
                  </ul>
                ) : null}
                <div className="repo-card__footer">
                  <span>{repo.stars} stars</span>
                  <span>{repo.forks} forks</span>
                  {repo.homepage ? (
                    <a href={repo.homepage} target="_blank" rel="noreferrer">
                      Live site
                    </a>
                  ) : (
                    <a href={repo.url} target="_blank" rel="noreferrer">
                      Code
                    </a>
                  )}
                </div>
              </article>
            ))
          ) : (
            <article className="repo-card repo-card--empty">
              <p className="repo-card__empty-label">GitHub API</p>
              <h2>No repositories available right now.</h2>
              <p>
                Check the GitHub profile directly, or add a public repository
                and it will show here after the next refresh.
              </p>
              <a href={githubProfileUrl} target="_blank" rel="noreferrer">
                Open GitHub
              </a>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
