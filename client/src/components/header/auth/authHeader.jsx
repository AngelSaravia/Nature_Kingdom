import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./authHeader.css";
import logoImage from "../../../zoo_pictures/Nature's_Kingdom.jpeg";
import apiClient from "../../../services/api";
import { useAuth } from "../../../context/Authcontext";

function AuthHeader() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("User");
  const { logout } = useAuth();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    logout();
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
        <Link to="/tickets">Tickets</Link>
        <Link to="/membership">Membership</Link>
        <Link to="/giftshop">Gift Shop</Link>
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

export default AuthHeader;
