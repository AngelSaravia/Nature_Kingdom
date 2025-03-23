import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./authHeader.css";
import logoImage from "../../../zoo_pictures/Nature's_Kingdom.jpeg";

function AuthHeader() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("User");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername("User");
    navigate("/login");
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
        <Link to="/tickets">My Tickets</Link>
        <Link to="/membership">Membership</Link>
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
