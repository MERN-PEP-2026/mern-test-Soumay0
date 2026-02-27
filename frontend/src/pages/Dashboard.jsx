import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import API from "../api";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ projects: 0, tasks: 0, completed: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projRes, taskRes] = await Promise.all([
          API.get("/projects"),
          API.get("/tasks"),
        ]);
        const completedTasks = taskRes.data.filter((t) => t.status === "done").length;
        setStats({
          projects: projRes.data.length,
          tasks: taskRes.data.length,
          completed: completedTasks,
        });
      } catch (err) {
        // silently fail
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard page">
      <div className="dashboard-welcome">
        <h1>Welcome back, {user?.name} &#128075;</h1>
        <p>Here's an overview of your workspace</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon projects">&#128194;</div>
          <h3>Total Projects</h3>
          <div className="stat-value">{stats.projects}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon tasks">&#9776;</div>
          <h3>Total Tasks</h3>
          <div className="stat-value">{stats.tasks}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon completed">&#9989;</div>
          <h3>Completed Tasks</h3>
          <div className="stat-value">{stats.completed}</div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/projects" className="btn btn-filled">&#43; New Project</Link>
          <Link to="/projects" className="btn btn-outline">View All Projects</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
