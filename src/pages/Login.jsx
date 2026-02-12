import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../style/login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      alert("Please enter email and password.");
      return;
    }
    const username = email.split("@")[0];
    localStorage.setItem("user", JSON.stringify({ name: username, email }));
    navigate("/");
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h1>Welcome Back</h1>
        <p>Sign in to access your account</p>
      </div>

      <div className="login-form">
        <form id="loginForm" onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="loginEmail">Email Address</label>
            <input
              type="email"
              id="loginEmail"
              className="form-control"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ position: "relative" }}>
            <label htmlFor="loginPassword">Password</label>
            <input
              type={showPass ? "text" : "password"}
              id="loginPassword"
              className="form-control"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <i
              className={`fas ${showPass ? "fa-eye-slash" : "fa-eye"}`}
              id="togglePassword"
              style={{ position: "absolute", right: 15, top: 47, cursor: "pointer", color: "#94a3b8" }}
              onClick={() => setShowPass((s) => !s)}
            />
          </div>

          <button type="submit" className="submit-btn">Sign In</button>

          <div className="register-link">
            <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}
