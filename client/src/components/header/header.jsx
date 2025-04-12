import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./header.css";
import logoImage from "../../zoo_pictures/Nature's_Kingdom.jpeg";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedInStatus);

    if (loggedInStatus) {
      try {
        const userDataString = localStorage.getItem("userData");
        const userData = JSON.parse(userDataString);
        setUserData(userData);
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userData");
    setIsLoggedIn(false);
    setUserData(null);
    setDropdownOpen(false);
    navigate("/");
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
            <span> NATURE</span>
            <span>KINGDOM</span>
          </div>
        </Link>
      </div>

      <nav className="nav-links">
        <Link to="/tickets" className="nav-item">
          <span className="ticket-icon"></span> Tickets
        </Link>
        <Link to="/membership" className="nav-item">
          Membership
        </Link>
        <Link to="/contact" className="nav-item">
          Contact
        </Link>
        <Link to="/exhibits">Exhibits</Link>

        {isLoggedIn ? (
          <div className="user-menu" ref={dropdownRef}>
            <span className="welcome-text">
              Welcome, {userData?.firstname || "User"}
            </span>
            <div className="dropdown">
              <button className="dropdown-toggle" onClick={toggleDropdown}>
                My Account
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item">
                    Profile
                  </Link>
                  <Link to="/my-tickets" className="dropdown-item">
                    My Tickets
                  </Link>
                  <Link to="/settings" className="dropdown-item">
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="dropdown-item logout"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Link to="/login" className="login-button">
            LOGIN / SIGN UP
          </Link>
        )}
      </nav>
    </header>
  );
}

export default Header;
