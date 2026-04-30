import Link from "next/link";
import { getGithubProfileUrl, getGithubRepositories } from "@/lib/github";

export const metadata = {
  title: "GitHub"
};

export default async function GithubPage() {
  const repositories = await getGithubRepositories();
  const githubProfileUrl = getGithubProfileUrl();
  const featuredRepositories = repositories.slice(0, 3);
  const focusAreas = [
    "AI prototypes",
    "Data analytics",
    "Automation",
    "Public-service tech"
  ];
  const topSkills = Array.from(
    new Set(repositories.flatMap((repo) => repo.skills))
  ).slice(0, 8);

  return (
    <section className="section github-page">
      <div className="container">
        <header className="github-page__header">
          <div>
            <p className="eyebrow">GitHub</p>
            <h1>AI and data portfolio.</h1>
            <p>
              A curated view of public repositories that show data thinking,
              automation, AI product ideas, and practical software delivery.
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
          </div>

          <div className="github-stats" aria-label="GitHub portfolio summary">
            <div>
              <strong>{repositories.length}</strong>
              <span>public repos</span>
            </div>
            <div>
              <strong>{topSkills.length}</strong>
              <span>visible skills</span>
            </div>
            <div>
              <strong>Live</strong>
              <span>auto-updated</span>
            </div>
          </div>
        </header>

        <section className="github-focus" aria-label="GitHub focus areas">
          {focusAreas.map((area) => (
            <span key={area}>{area}</span>
          ))}
        </section>

        {topSkills.length > 0 ? (
          <section className="github-skills" aria-label="Visible technical skills">
            <p>Skills shown across repositories</p>
            <ul>
              {topSkills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {featuredRepositories.length > 0 ? (
          <section className="github-featured" aria-labelledby="featured-repos">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Featured</p>
                <h2 id="featured-repos">Strongest employer signals</h2>
              </div>
            </div>
            <div className="repo-grid repo-grid--featured">
              {featuredRepositories.map((repo) => (
                <article className="repo-card repo-card--featured" key={repo.id}>
                  <div className="repo-card__topline">
                    <p>{repo.category}</p>
                    <span>Updated {repo.updatedAt}</span>
                  </div>
                  <h2>
                    <a href={repo.url} target="_blank" rel="noreferrer">
                      {repo.name}
                    </a>
                  </h2>
                  <p>{repo.impact}</p>
                  <ul className="repo-card__signals" aria-label={`${repo.name} signals`}>
                    {repo.signals.map((signal) => (
                      <li key={signal}>{signal}</li>
                    ))}
                  </ul>
                  <ul className="repo-card__topics" aria-label={`${repo.name} skills`}>
                    {repo.skills.slice(0, 5).map((skill) => (
                      <li key={skill}>{skill}</li>
                    ))}
                  </ul>
                  <div className="repo-card__footer">
                    <span>{repo.stars} stars</span>
                    <span>{repo.forks} forks</span>
                    {repo.homepage ? (
                      <a href={repo.homepage} target="_blank" rel="noreferrer">
                        Live demo
                      </a>
                    ) : (
                      <a href={repo.url} target="_blank" rel="noreferrer">
                        Code
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="github-all" aria-labelledby="all-repos">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Repositories</p>
              <h2 id="all-repos">All public work</h2>
            </div>
          </div>
          <div className="repo-grid">
            {repositories.length > 0 ? (
              repositories.map((repo) => (
                <article className="repo-card" key={repo.id}>
                  <div className="repo-card__topline">
                    <p>{repo.category}</p>
                    <span>Updated {repo.updatedAt}</span>
                  </div>
                  <h2>
                    <a href={repo.url} target="_blank" rel="noreferrer">
                      {repo.name}
                    </a>
                  </h2>
                  <p>{repo.impact}</p>
                  {repo.skills.length > 0 ? (
                    <ul
                      className="repo-card__topics"
                      aria-label={`${repo.name} topics`}
                    >
                      {repo.skills.slice(0, 4).map((skill) => (
                        <li key={skill}>{skill}</li>
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
        </section>
      </div>
    </section>
  );
}
