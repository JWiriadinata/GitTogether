import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../contexts/AuthContext";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [project, setProject] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [interestError, setInterestError] = useState("");
  const [loading, setLoading] = useState(true);
  const [interestBusy, setInterestBusy] = useState(false);

  const load = useCallback(async () => {
    setLoadError("");
    setInterestError("");
    try {
      const data = await api(`/api/projects/${id}`);
      setProject(data);
    } catch (e) {
      if (e.status === 404) {
        setLoadError("Project not found.");
      } else {
        setLoadError(e.message || "Could not load project");
      }
      setProject(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  async function updateInterest(next) {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/projects/${id}` } } });
      return;
    }
    setInterestBusy(true);
    setInterestError("");
    try {
      const updated = await api(`/api/projects/${id}/interest`, {
        method: "POST",
        body: JSON.stringify({ interested: next }),
      });
      setProject(updated);
    } catch (e) {
      setInterestError(e.message || "Could not update interest");
    } finally {
      setInterestBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <p className="text-muted">Loading…</p>
      </div>
    );
  }

  if (loadError || !project) {
    return (
      <div className="page page--narrow">
        <p className="form-error">{loadError || "Something went wrong."}</p>
        <Link to="/projects" className="inline-link">
          ← Back to projects
        </Link>
      </div>
    );
  }

  return (
    <div className="page page--detail">
      <Link to="/projects" className="back-link">
        ← All projects
      </Link>

      <article className="card detail-card">
        <header className="detail-header">
          <h1 className="page-title detail-title">{project.title}</h1>
          <p className="detail-meta">
            Posted by{" "}
            <strong>{project.owner?.name || project.owner?.username}</strong>{" "}
            <span className="text-muted">
              (@{project.owner?.username})
            </span>
          </p>
        </header>

        <div className="detail-body">
          {project.description ? (
            <p className="detail-description">{project.description}</p>
          ) : (
            <p className="text-muted">No description provided.</p>
          )}
        </div>

        {interestError ? (
          <p className="form-error interest-inline-error" role="alert">
            {interestError}
          </p>
        ) : null}

        <div className="detail-actions">
          <div className="interest-summary">
            <span className="interest-count">
              {project.interestedCount}{" "}
              {project.interestedCount === 1 ? "person is" : "people are"}{" "}
              interested
            </span>
          </div>

          {project.isMine ? (
            <div className="owner-note">
              <p className="text-muted">This is your project.</p>
              <Link
                to={`/projects/${id}/edit`}
                className="btn btn--secondary"
              >
                Edit project
              </Link>
            </div>
          ) : (
            <div className="interest-buttons">
              {project.meInterested ? (
                <button
                  type="button"
                  className="btn btn--secondary"
                  disabled={interestBusy}
                  onClick={() => updateInterest(false)}
                >
                  {interestBusy ? "Updating…" : "Remove interest"}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn--interest"
                  disabled={interestBusy}
                  onClick={() => updateInterest(true)}
                >
                  {interestBusy ? "Saving…" : "I’m interested"}
                </button>
              )}
            </div>
          )}
        </div>

        {project.interestedUsers && project.interestedUsers.length > 0 && (
          <section className="interested-section">
            <h2 className="subsection-title">Interested people</h2>
            <ul className="interested-list">
              {project.interestedUsers.map((u) => (
                <li key={u.id}>
                  {u.name ? (
                    <>
                      <span className="interested-name">{u.name}</span>
                      <span className="text-muted"> @{u.username}</span>
                    </>
                  ) : (
                    <span className="interested-name">@{u.username}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </div>
  );
}
