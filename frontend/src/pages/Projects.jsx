import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", status: "active" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (err) {
      setError("Failed to load projects");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await API.put(`/projects/${editingId}`, form);
        setEditingId(null);
      } else {
        await API.post("/projects", form);
      }
      setForm({ name: "", description: "", status: "active" });
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (project) => {
    setEditingId(project._id);
    setForm({
      name: project.name,
      description: project.description,
      status: project.status,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await API.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      setError("Failed to delete project");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: "", description: "", status: "active" });
    setShowForm(false);
  };

  return (
    <div className="page">
      <div className="breadcrumb">
        <Link to="/dashboard">Dashboard</Link>
        <span>/</span>
        <span>Projects</span>
      </div>

      <div className="page-header">
        <h2>Projects</h2>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn btn-filled">
            &#43; New Project
          </button>
        )}
      </div>

      {error && <p className="error">{error}</p>}

      {showForm && (
        <div className="crud-form">
          <h3>{editingId ? "Edit Project" : "Create New Project"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Project Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="My Awesome Project"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  name="description"
                  placeholder="Brief description..."
                  value={form.description}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group" style={{ maxWidth: "160px" }}>
                <label>Status</label>
                <select name="status" value={form.status} onChange={handleChange}>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>
            </div>
            <div className="form-actions" style={{ marginTop: "16px" }}>
              <button type="submit" className="btn btn-filled">
                {editingId ? "Update Project" : "Create Project"}
              </button>
              <button type="button" onClick={cancelEdit} className="btn btn-outline">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">&#128194;</div>
          <h3>No projects yet</h3>
          <p>Create your first project to start organizing your tasks</p>
        </div>
      ) : (
        <div className="cards-grid">
          {projects.map((p) => (
            <div key={p._id} className="project-card">
              <div className="card-header">
                <h3>{p.name}</h3>
                <div className="card-actions">
                  <button onClick={() => handleEdit(p)} className="btn btn-icon edit" title="Edit">
                    &#9998;
                  </button>
                  <button onClick={() => handleDelete(p._id)} className="btn btn-icon danger" title="Delete">
                    &#128465;
                  </button>
                </div>
              </div>
              <p className="card-desc">{p.description || "No description"}</p>
              <div className="card-footer">
                <span className={`badge badge-${p.status}`}>{p.status}</span>
                <Link to={`/projects/${p._id}/tasks`} className="btn btn-sm btn-outline">
                  View Tasks &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
