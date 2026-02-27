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
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
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
  };

  return (
    <div className="page">
      <h2>Tasks — {projectName}</h2>
      <Link to="/projects" className="btn back-btn">← Back to Projects</Link>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="crud-form">
        <input
          type="text"
          name="title"
          placeholder="Task title"
          value={form.title}
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
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <button type="submit">{editingId ? "Update" : "Add Task"}</button>
        {editingId && (
          <button type="button" onClick={cancelEdit}>Cancel</button>
        )}
      </form>

      <div className="list">
        {tasks.length === 0 && <p>No tasks yet. Add one above!</p>}
        {tasks.map((t) => (
          <div key={t._id} className={`card task-${t.status}`}>
            <div className="card-body">
              <h3>{t.title}</h3>
              <p>{t.description}</p>
              <span className={`badge badge-${t.status}`}>{t.status}</span>
            </div>
            <div className="card-actions">
              <button onClick={() => handleEdit(t)} className="btn btn-edit">Edit</button>
              <button onClick={() => handleDelete(t._id)} className="btn btn-delete">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
