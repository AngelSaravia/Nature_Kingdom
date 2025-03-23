import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./admin.css";
import logoImage from "../../../zoo_pictures/Nature's_Kingdom.jpeg";
import { useAuth } from "../../../context/Authcontext";

function AdminHeader() {
  const navigate = useNavigate();
  const auth = useAuth();

  const username =
    auth?.user?.username || localStorage.getItem("username") || "User";

  const handleLogout = () => {
    if (auth && auth.logout) {
      auth.logout();
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      navigate("/login");
    }
  };

  return (
    <header className="header">
      <div className="logo-section">
        <Link to="/" className="logo-link">
          <img
            src={logoImage}
            alt="Nature Kingdom Logo"
            className="logo-image"
          />
          <div className="brand-name">
            <span>NATURE</span>
            <span>KINGDOM</span>
          </div>
        </Link>
      </div>

      <nav className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/event_form">Events Form</Link>
        <Link to="/enclosure_form">Enclosure Form</Link>
        <Link to="/animal_form">Animal Form</Link>
        <Link to="/employee_form">Employee Form</Link>
      </nav>
      <div className="user-menu">
        <span className="username">Welcome, {username}</span>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default AdminHeader;
