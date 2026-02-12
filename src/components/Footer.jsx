import React from "react";
import "../style/taskflow.css";

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-text">&copy; 2025 TaskFlow. All rights reserved.</div>
        <div className="social-links">
          <a href="#" className="social-link" aria-label="Facebook">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="#" className="social-link" aria-label="Twitter">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="social-link" aria-label="Instagram">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#" className="social-link" aria-label="GitHub">
            <i className="fab fa-github"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}
