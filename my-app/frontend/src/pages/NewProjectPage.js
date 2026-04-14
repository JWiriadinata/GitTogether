import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";

export default function NewProjectPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const created = await api("/api/projects", {
        method: "POST",
        body: JSON.stringify({ title, description }),
      });
      navigate(`/projects/${created.id}`, { replace: true });
    } catch (err) {
      setError(err.message || "Could not create project");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page page--narrow">
      <h1 className="page-title">New project</h1>
      <p className="page-lead">
        Share an idea or repo. Others can mark themselves as interested.
      </p>
      <form className="card form-card" onSubmit={handleSubmit}>
        {error && <div className="form-error">{error}</div>}
        <label htmlFor="title">
          Title
          <input
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g. Open-source campus map"
          />
        </label>
        <label htmlFor="description">
          Description
          <textarea
            id="description"
            name="description"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What are you building? Tech stack, timeline, how to help…"
          />
        </label>
        <div className="form-actions">
          <Link to="/projects" className="btn btn--ghost">
            Cancel
          </Link>
          <button
            type="submit"
            className="btn btn--primary"
            disabled={submitting}
          >
            {submitting ? "Publishing…" : "Publish project"}
          </button>
        </div>
      </form>
    </div>
  );
}
