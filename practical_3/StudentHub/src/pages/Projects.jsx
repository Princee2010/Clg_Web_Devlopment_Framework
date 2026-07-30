import { useState, useEffect } from "react";
import Spinner from "../component/Spinner";
import ErrorMessage from "../component/ErrorMessage";
import RepoList from "../component/RepoList";


function Projects() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://api.github.com/users/Princee2010/repos")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch repositories");
        }
        return res.json();
      })
      .then((data) => setRepos(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Conditional Rendering
  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;

  return <RepoList repos={repos} />;
}

export default Projects;