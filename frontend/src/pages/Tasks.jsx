import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";

const Tasks = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [form, setForm] = useState({ title: "", description: "", status: "todo" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const res = await API.get(`/projects/${projectId}`);
      setProjectName(res.data.name);
    } catch (err) {
      setError("Failed to load project");
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await API.get(`/tasks?project=${projectId}`);
      setTasks(res.data);
    } catch (err) {
      setError("Failed to load tasks");
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
        await API.put(`/tasks/${editingId}`, form);
        setEditingId(null);
      } else {
        await API.post("/tasks", { ...form, project: projectId });
      }
      setForm({ title: "", description: "", status: "todo" });
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (task) => {
    setEditingId(task._id);
    setForm({
      title: task.title,
      description: task.description,
      status: task.status,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      setError("Failed to delete task");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ title: "", description: "", status: "todo" });
    setShowForm(false);
  };

  const todoCount = tasks.filter((t) => t.status === "todo").length;
  const progressCount = tasks.filter((t) => t.status === "in-progress").length;
  const doneCount = tasks.filter((t) => t.status === "done").length;

  return (
    <div className="page">
      <div className="breadcrumb">
        <Link to="/dashboard">Dashboard</Link>
        <span>/</span>
        <Link to="/projects">Projects</Link>
        <span>/</span>
        <span>{projectName}</span>
      </div>

      <div className="page-header">
        <h2>{projectName} — Tasks</h2>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn btn-filled">
            &#43; Add Task
          </button>
        )}
      </div>

      {tasks.length > 0 && (
        <div className="dashboard-stats" style={{ marginBottom: "24px" }}>
          <div className="stat-card">
            <h3>To Do</h3>
            <div className="stat-value">{todoCount}</div>
          </div>
          <div className="stat-card">
            <h3>In Progress</h3>
            <div className="stat-value">{progressCount}</div>
          </div>
          <div className="stat-card">
            <h3>Done</h3>
            <div className="stat-value">{doneCount}</div>
          </div>
        </div>
      )}

      {error && <p className="error">{error}</p>}

      {showForm && (
        <div className="crud-form">
          <h3>{editingId ? "Edit Task" : "Add New Task"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Task Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Design homepage"
                  value={form.title}
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
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>
            <div className="form-actions" style={{ marginTop: "16px" }}>
              <button type="submit" className="btn btn-filled">
                {editingId ? "Update Task" : "Add Task"}
              </button>
              <button type="button" onClick={cancelEdit} className="btn btn-outline">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">&#9776;</div>
          <h3>No tasks yet</h3>
          <p>Add your first task to start tracking progress</p>
        </div>
      ) : (
        <div className="cards-grid">
          {tasks.map((t) => (
            <div key={t._id} className={`task-card status-${t.status}`}>
              <div className="card-header">
                <h3>{t.title}</h3>
                <div className="card-actions">
                  <button onClick={() => handleEdit(t)} className="btn btn-icon edit" title="Edit">
                    &#9998;
                  </button>
                  <button onClick={() => handleDelete(t._id)} className="btn btn-icon danger" title="Delete">
                    &#128465;
                  </button>
                </div>
              </div>
              <p className="card-desc">{t.description || "No description"}</p>
              <div className="card-footer">
                <span className={`badge badge-${t.status}`}>{t.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tasks;
