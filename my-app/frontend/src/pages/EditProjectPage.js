import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api";

export default function EditProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setError("");
    try {
      const data = await api(`/api/projects/${id}`);
      if (!data.isMine) {
        navigate(`/projects/${id}`, { replace: true });
        return;
      }
      setTitle(data.title || "");
      setDescription(data.description || "");
    } catch (e) {
      if (e.status === 404) {
        setError("Project not found.");
      } else {
        setError(e.message || "Could not load project");
      }
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const updated = await api(`/api/projects/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ title, description }),
      });
      navigate(`/projects/${updated.id}`, { replace: true });
    } catch (err) {
      setError(err.message || "Could not save changes");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (
      !window.confirm(
        "Delete this project? Interested people will no longer see it."
      )
    ) {
      return;
    }
    setError("");
    setDeleting(true);
    try {
      await api(`/api/projects/${id}`, { method: "DELETE" });
      navigate("/projects", { replace: true });
    } catch (err) {
      setError(err.message || "Could not delete project");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <p className="text-muted">Loading…</p>
      </div>
    );
  }

  if (error && !title && !description) {
    return (
      <div className="page page--narrow">
        <p className="form-error">{error}</p>
        <Link to="/projects" className="inline-link">
          ← Back to projects
        </Link>
      </div>
    );
  }

  return (
    <div className="page page--narrow">
      <h1 className="page-title">Edit project</h1>
      <p className="page-lead">Update the title or description.</p>
      <form className="card form-card" onSubmit={handleSubmit}>
        {error && <div className="form-error">{error}</div>}
        <label htmlFor="edit-title">
          Title
          <input
            id="edit-title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label htmlFor="edit-description">
          Description
          <textarea
            id="edit-description"
            name="description"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <div className="form-actions">
          <Link to={`/projects/${id}`} className="btn btn--ghost">
            Cancel
          </Link>
          <button
            type="submit"
            className="btn btn--primary"
            disabled={submitting || deleting}
          >
            {submitting ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
      <div className="card form-card danger-zone">
        <p className="text-muted danger-zone__title">Danger zone</p>
        <button
          type="button"
          className="btn btn--secondary"
          disabled={submitting || deleting}
          onClick={handleDelete}
        >
          {deleting ? "Deleting…" : "Delete project"}
        </button>
      </div>
    </div>
  );
}
