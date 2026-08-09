function RepoList({ repos, search, handleSearch }) {
  return (
    <section className="page" aria-labelledby="projects-heading">
      <h1 id="projects-heading">Projects</h1>
      <p>Explore the projects I have built while learning web development.</p>

      <h2>My GitHub Repositories</h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search Repository..."
        value={search}
        onChange={handleSearch}
        style={{
          padding: "8px",
          width: "300px",
          marginBottom: "20px",
        }}
      />

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

            {/* Star Count */}
            <p>⭐ Stars: {repo.stargazers_count}</p>

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