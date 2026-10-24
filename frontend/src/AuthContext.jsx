import { createContext, useContext, useEffect, useState } from "react";
import api from "./api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // restore session on refresh
  useEffect(() => {
    if (!localStorage.getItem("eventora_token")) return setLoading(false);
    api
      .get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem("eventora_token"))
      .finally(() => setLoading(false));
  }, []);

  const authenticate = async (path, body) => {
    const { data } = await api.post(`/auth/${path}`, body);
    localStorage.setItem("eventora_token", data.token);
    setUser(data.user);
  };

  const login = (email, password) => authenticate("login", { email, password });
  const register = (name, email, password) => authenticate("register", { name, email, password });
  const logout = () => {
    localStorage.removeItem("eventora_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
