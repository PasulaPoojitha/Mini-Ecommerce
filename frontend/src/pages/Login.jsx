// src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please fill all fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // ⭐ Save user for your application
      localStorage.setItem(
        "user",
        JSON.stringify(data.user || { email: form.email })
      );

      // ⭐ MOST IMPORTANT LINE — Saves user email for CART
      localStorage.setItem("userEmail", form.email);

      // Refresh navbar cart count after login
      window.dispatchEvent(new Event("cartUpdated"));

      navigate("/");

    } catch (err) {
      setError(err.message || "Login error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Sign in</h2>

        <form onSubmit={onSubmit} className="auth-form">
          <label>
            Email
            <input
              name="email"
              value={form.email}
              onChange={onChange}
              type="email"
            />
          </label>

          <label>
            Password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
            />
          </label>

          {error && <div className="auth-error">{error}</div>}

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="auth-footer">
          New to ElectroZone? <Link to="/signup">Create your account</Link>
        </div>
      </div>
    </div>
  );
}
