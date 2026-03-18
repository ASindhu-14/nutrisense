import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    navigate("/dashboard");
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">

        <div className="auth-brand">
          <div className="auth-brand-logo">NS</div>
          <h1 className="auth-brand-name">NutriSense</h1>
          <p className="auth-brand-tagline">Your kitchen. Your nutrition.</p>
        </div>

        <h2 className="auth-heading">Welcome back</h2>

        <label className="input-label">Email</label>
        <input
          className="input"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <label className="input-label">Password</label>
        <input
          className="input"
          type="password"
          placeholder="Your password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {error && <div className="auth-error">{error}</div>}

        <button
          className="btn-primary btn-full"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? <span className="spinner" /> : "Log In →"}
        </button>

        <p className="auth-switch">
          Don't have an account?{" "}
          <span onClick={() => navigate("/signup")}>Sign up</span>
        </p>

      </div>
    </div>
  );
}
