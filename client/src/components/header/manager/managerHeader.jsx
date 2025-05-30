import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./manager.css";
import logoImage from "../../../zoo_pictures/Nature's_Kingdom.jpeg";
import { useAuth } from "../../../context/Authcontext";
import apiClient from "../../../services/api";
import ClockInComponent from "../../ClockInComponent/ClockInComponent";
import ManagerNotification from "../../../components/notification/ManagerNotification";

function ManagerHeader() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const username = user?.username || localStorage.getItem("username") || "User";

  const handleLogout = () => {
    if (logout) {
      logout("/employee_login");
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      localStorage.removeItem("email");

      delete apiClient.defaults.headers.common["Authorization"];
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
      </nav>
      <div className="user-menu">
        <ClockInComponent />
        <span className="username">Welcome, {username}</span>
        <ManagerNotification />
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default ManagerHeader;
