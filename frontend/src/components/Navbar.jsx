import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? "nav-link active" : "nav-link";

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">
          <span className="brand-icon">&#9776;</span>
          <span className="brand-text">TaskFlow</span>
        </Link>
      </div>
      {user && (
        <div className="navbar-menu">
          <Link to="/dashboard" className={isActive("/dashboard")}>Dashboard</Link>
          <Link to="/projects" className={isActive("/projects")}>Projects</Link>
        </div>
      )}
      {user && (
        <div className="navbar-user">
          <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
          <span className="user-name">{user.name}</span>
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
