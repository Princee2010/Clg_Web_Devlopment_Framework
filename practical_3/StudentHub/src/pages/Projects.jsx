import { useState, useEffect } from "react";
import Spinner from "../component/Spinner";
import ErrorMessage from "../component/ErrorMessage";
import RepoList from "../component/RepoList";

function Projects() {
  const [repos, setRepos] = useState([]);
  const [filteredRepos, setFilteredRepos] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch repositories
  const fetchRepos = () => {
    setLoading(true);
    setError(null);

    fetch("https://api.github.com/users/Princee2010/repos")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch repositories");
        }
        return res.json();
      })
      .then((data) => {
        setRepos(data);
        setFilteredRepos(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchRepos();
  }, []);

  // Search function
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    const filtered = repos.filter((repo) =>
      repo.name.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredRepos(filtered);
  };

  // Conditional Rendering
  if (loading) return <Spinner />;

  if (error)
    return (
      <ErrorMessage
        message={error}
        onRetry={fetchRepos}
      />
    );

  return (
    <RepoList
      repos={filteredRepos}
      search={search}
      handleSearch={handleSearch}
    />
  );
}

export default Projects;