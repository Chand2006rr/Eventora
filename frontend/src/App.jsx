import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function Private({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="center-note">Loading…</p>;
  return user ? children : <Navigate to="/login" replace />;
}

function Guest({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="center-note">Loading…</p>;
  return user ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Private><Dashboard /></Private>} />
      <Route path="/login" element={<Guest><Login /></Guest>} />
      <Route path="/register" element={<Guest><Register /></Guest>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
