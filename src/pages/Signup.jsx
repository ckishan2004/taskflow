import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/signup.css";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    const payload = { name: name.trim(), email: email.trim(), password: pass.trim() };
    localStorage.setItem("registeredUser", JSON.stringify(payload));
    localStorage.setItem("user", JSON.stringify({ name: payload.name, email: payload.email }));
    navigate("/");
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <div className="header">
          <i className="fas fa-user-plus"></i>
          <h1>Create Your Account</h1>
          <p>Join TaskFlow and manage your tasks with ease.</p>
        </div>

        <form id="signupForm" onSubmit={onSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" id="signupName" placeholder="John Doe" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" id="signupEmail" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="form-group password-group">
            <label>Password</label>
            <input type={showPass ? "text" : "password"} id="signupPassword" placeholder="••••••••" required value={pass} onChange={(e) => setPass(e.target.value)} />
            <i id="togglePassword" className={`fas ${showPass ? "fa-eye-slash" : "fa-eye"}`} onClick={() => setShowPass((s) => !s)} />
          </div>

          <button type="submit" className="btn-signup">
            <i className="fas fa-user-plus"></i> Sign Up
          </button>
        </form>

        <p className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
