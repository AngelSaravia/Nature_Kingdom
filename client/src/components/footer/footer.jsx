import React from "react";
import "./Footer.css";
import { FaGithub } from "react-icons/fa";
import logoImage from "../../zoo_pictures/Nature's_Kingdom.jpeg";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <img
            src={logoImage}
            alt="Nature Kingdom Logo"
            className="footer-logo"
          />
          <p className="copyright">
            © 2025 Nature Kingdom all rights reserved.
          </p>
        </div>

        <div className="footer-right">
          <nav className="footer-nav">
            <a href="/contact" className="footer-link">
              Contact Us
            </a>
            <a href="/employee_login" className="footer-link">
              Employee Login
            </a>
            <a
              href="https://github.com/AngelSaravia/ZOO-PROJECT"
              className="github-icon"
              aria-label="GitHub"
            >
              <FaGithub size={32} />
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
