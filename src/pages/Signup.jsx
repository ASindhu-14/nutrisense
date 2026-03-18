import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    await supabase.from("users").insert({ id: data.user.id, name });

    setLoading(false);
    navigate("/profile");
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">

        <div className="auth-brand">
          <div className="auth-brand-logo">NS</div>
          <h1 className="auth-brand-name">NutriSense</h1>
          <p className="auth-brand-tagline">Your kitchen. Your nutrition.</p>
        </div>

        <h2 className="auth-heading">Create your account</h2>

        <label className="input-label">Your Name</label>
        <input
          className="input"
          placeholder="e.g. Sindhu"
          value={name}
          onChange={e => setName(e.target.value)}
        />

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
          placeholder="Min. 6 characters"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {error && <div className="auth-error">{error}</div>}

        <button
          className="btn-primary btn-full"
          onClick={handleSignup}
          disabled={loading}
        >
          {loading ? <span className="spinner" /> : "Create Account →"}
        </button>

        <p className="auth-switch">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Log in</span>
        </p>

      </div>
    </div>
  );
}
