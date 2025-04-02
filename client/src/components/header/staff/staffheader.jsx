import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./staffheader.css";
import logoImage from "../../../zoo_pictures/Nature's_Kingdom.jpeg";
import { useAuth } from "../../../context/Authcontext";

function staffHeader() {
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
      navigate("/employee_login");
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
        <Link to="/manager_dash">Dashboard</Link>
        <Link to="/event_form">Events Form</Link>
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

export default staffHeader;
