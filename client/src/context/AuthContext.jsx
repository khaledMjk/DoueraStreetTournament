import { createContext, useContext, useState, useCallback } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("douera_token"));
  const [username, setUsername] = useState(() => localStorage.getItem("douera_user"));

  const login = useCallback(async (user, pass) => {
    const data = await api.login(user, pass);
    localStorage.setItem("douera_token", data.token);
    localStorage.setItem("douera_user", data.username);
    setToken(data.token);
    setUsername(data.username);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("douera_token");
    localStorage.removeItem("douera_user");
    setToken(null);
    setUsername(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, username, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
