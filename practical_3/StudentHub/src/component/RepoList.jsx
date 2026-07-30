function RepoList({ repos }) {
    return (
    <section className="page" aria-labelledby="projects-heading">
      <h1 id="projects-heading">Projects</h1>
      <p>Explore the projects I have built while learning web development.</p>

      <h2>My GitHub Repositories</h2>

      {repos.length === 0 ? (
        <p>No repositories found.</p>
      ) : (
        repos.map((repo) => (
          <div
            key={repo.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              margin: "10px 0",
              borderRadius: "5px",
            }}
          >
            <h3>{repo.name}</h3>
            <p>{repo.description || "No description available."}</p>

            <a href={repo.html_url} target="_blank" rel="noreferrer">
              View Repository
            </a>
          </div>
        ))
      )}
    </section>
  );
}

export default RepoList;
