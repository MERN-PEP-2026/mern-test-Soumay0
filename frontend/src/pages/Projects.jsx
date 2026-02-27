import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", status: "active" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  // Fetch all projects on mount
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
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
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
  };

  return (
    <div className="page">
      <h2>Projects</h2>
      <Link to="/dashboard" className="btn back-btn">← Back to Dashboard</Link>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="crud-form">
        <input
          type="text"
          name="name"
          placeholder="Project name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="on-hold">On Hold</option>
        </select>
        <button type="submit">{editingId ? "Update" : "Create"}</button>
        {editingId && (
          <button type="button" onClick={cancelEdit}>Cancel</button>
        )}
      </form>

      <div className="list">
        {projects.length === 0 && <p>No projects yet. Create one above!</p>}
        {projects.map((p) => (
          <div key={p._id} className="card">
            <div className="card-body">
              <h3>{p.name}</h3>
              <p>{p.description}</p>
              <span className={`badge badge-${p.status}`}>{p.status}</span>
            </div>
            <div className="card-actions">
              <Link to={`/projects/${p._id}/tasks`} className="btn">Tasks</Link>
              <button onClick={() => handleEdit(p)} className="btn btn-edit">Edit</button>
              <button onClick={() => handleDelete(p._id)} className="btn btn-delete">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
