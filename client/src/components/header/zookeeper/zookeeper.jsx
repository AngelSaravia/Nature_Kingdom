import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./zookeeper.css";
import logoImage from "../../../zoo_pictures/Nature's_Kingdom.jpeg";
import { useAuth } from "../../../context/Authcontext";
import apiClient from "../../../services/api";
import ClockInComponent from "../../ClockInComponent/ClockInComponent";

function zookeeperHeader() {
  const navigate = useNavigate();
  const auth = useAuth();

  const username =
    auth?.user?.username || localStorage.getItem("username") || "User";

  const handleLogout = () => {
    if (auth && auth.logout) {
      auth.logout("/employee_login");
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
        <Link to="/zookeeper_dash">Dashboard</Link>
      </nav>
      <div className="user-menu">
        <ClockInComponent />
        <span className="username">Welcome, {username}</span>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default zookeeperHeader;
