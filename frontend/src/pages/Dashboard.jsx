import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div>
          <span>Welcome, {user?.name}</span>
          <button onClick={logout} className="btn-logout">
            Logout
          </button>
        </div>
      </header>
      <main>
        <div className="dashboard-card">
          <h2>My Projects</h2>
          <p>Create, view, and manage your projects and their tasks.</p>
          <Link to="/projects" className="btn">
            Go to Projects
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
