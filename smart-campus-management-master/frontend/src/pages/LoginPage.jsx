import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import branding from "../config/branding";

// Decode JWT payload without a library
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return {};
  }
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      const payload = parseJwt(data.token);
      const user = { name: payload.name || form.email.split("@")[0], role: payload.role, id: payload.id };
      login(data.token, user);
      toast.success("Welcome back! 🎉");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-logo">
          <div dangerouslySetInnerHTML={{ __html: branding.logoSVG(56) }} style={{ display: 'flex', justifyContent: 'center' }} />
          <h1>{branding.fullPlatformName}</h1>
          <p className="auth-subtitle">Sign in to your student portal</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <FiMail className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Registration No. / Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FiLock className="input-icon" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-4px' }}>
            <a href="#" style={{ fontSize: '0.78rem', color: branding.colors.primary, fontWeight: 600 }}>
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <span className="spinner" />
            ) : (
              <>
                <FiLogIn /> Sign In
              </>
            )}
          </button>
        </form>

        <div style={{ 
          marginTop: '1.5rem', 
          padding: '1rem', 
          background: '#f8f9fc', 
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, marginBottom: '4px' }}>
            {branding.helpDeskLabel}
          </p>
          <p style={{ fontSize: '0.78rem', color: '#4a5568' }}>
            For any issues, contact IT Support at{' '}
            <span style={{ color: branding.colors.primary, fontWeight: 600 }}>{branding.supportEmail}</span>
          </p>
        </div>

        <p className="auth-footer">
          New student?{" "}
          <Link to="/register" className="link">Create Account</Link>
        </p>
      </div>
    </div>
  );
}
