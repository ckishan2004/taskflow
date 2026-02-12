import React, { useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";

// Uses the same header markup/classes used by taskflow.css
import "../style/taskflow.css";

export default function Header() {
  const navigate = useNavigate();

  const user = useMemo(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  }, []);

  const onLoginStatusClick = (e) => {
    if (!user) return; // normal link behavior to /login (NavLink)
    e.preventDefault();
    const ok = window.confirm("Are you sure you want to log out?");
    if (ok) {
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <header>
      <div className="container">
        <div className="logo">
          <i className="fas fa-tasks"></i>
          TaskFlow
        </div>

        <nav>
          <ul>
            <li>
              <NavLink to="/" end>
                <i className="fas fa-home"></i> Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/calendar">
                <i className="fas fa-calendar"></i> Calendar
              </NavLink>
            </li>
            <li>
              <NavLink to="/reports">
                <i className="fas fa-chart-line"></i> Reports
              </NavLink>
            </li>
            <li>
              <NavLink to="/settings">
                <i className="fas fa-cog"></i> Settings
              </NavLink>
            </li>
            <li>
              <NavLink to="/login" onClick={onLoginStatusClick}>
                <i className="fas fa-user"></i> {user ? user.name : "Login"}
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
