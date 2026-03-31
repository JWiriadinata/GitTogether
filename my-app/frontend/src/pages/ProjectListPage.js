import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../contexts/AuthContext";

function excerpt(text, max = 120) {
  if (!text) return "";
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max)}…`;
}

export default function ProjectListPage() {
  const { isAuthenticated, token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await api("/api/projects");
        if (!cancelled) setProjects(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setError(e.message || "Could not load projects");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (loading) {
    return (
      <div className="page">
        <p className="text-muted">Loading projects…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <p className="form-error">{error}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-lead">
            Explore what people are building—show interest to connect.
          </p>
        </div>
        {isAuthenticated ? (
          <Link to="/projects/new" className="btn btn--primary">
            New project
          </Link>
        ) : (
          <Link to="/register" className="btn btn--primary">
            Sign up to post
          </Link>
        )}
      </header>

      {projects.length === 0 ? (
        <div className="card empty-state">
          <p>No projects yet.</p>
          {isAuthenticated ? (
            <Link to="/projects/new" className="btn btn--secondary">
              Post the first one
            </Link>
          ) : (
            <Link to="/register" className="btn btn--secondary">
              Sign up to post the first one
            </Link>
          )}
        </div>
      ) : (
        <ul className="project-grid">
          {projects.map((p) => (
            <li key={p.id}>
              <Link to={`/projects/${p.id}`} className="project-card card">
                <h2 className="project-card__title">{p.title}</h2>
                <p className="project-card__meta">
                  by {p.owner?.username || "unknown"}
                </p>
                <p className="project-card__desc">{excerpt(p.description)}</p>
                <div className="project-card__footer">
                  <span className="interest-pill">
                    {p.interestedCount}{" "}
                    {p.interestedCount === 1 ? "interested" : "interested"}
                  </span>
                  {p.meInterested && (
                    <span className="interest-pill interest-pill--you">
                      You’re interested
                    </span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
