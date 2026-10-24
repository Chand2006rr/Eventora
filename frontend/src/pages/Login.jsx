import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { errorText } from "../api";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(form.email, form.password);
      nav("/");
    } catch (err) {
      setError(errorText(err));
    }
  };

  return (
    <main className="auth">
      <h1 className="brand">Eventora</h1>
      <p className="tagline">Put it on the calendar. We’ll remind everyone.</p>
      <form onSubmit={submit} className="card stack">
        <label>Email
          <input type="email" required value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>
        <label>Password
          <input type="password" required value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="btn">Log in</button>
        <p className="muted">New here? <Link to="/register">Create an account</Link></p>
      </form>
    </main>
  );
}
