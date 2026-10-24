import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { errorText } from "../api";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(form.name, form.email, form.password);
      nav("/");
    } catch (err) {
      setError(errorText(err));
    }
  };

  return (
    <main className="auth">
      <h1 className="brand">Eventora</h1>
      <p className="tagline">Create your account to start scheduling.</p>
      <form onSubmit={submit} className="card stack">
        <label>Name
          <input required value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </label>
        <label>Email
          <input type="email" required value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>
        <label>Password (6+ characters)
          <input type="password" minLength={6} required value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="btn">Create account</button>
        <p className="muted">Already registered? <Link to="/login">Log in</Link></p>
      </form>
    </main>
  );
}
