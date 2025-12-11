"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage safely
  useEffect(() => {
    const saved = localStorage.getItem("localUser");
    if (saved) {
      // defer setState to next tick
      setTimeout(() => setUser(JSON.parse(saved)), 0);
    }
    setTimeout(() => setLoading(false), 0);
  }, []);

  const login = (email) => {
    const userData = { id: crypto.randomUUID(), email };
    localStorage.setItem("localUser", JSON.stringify(userData));
    setTimeout(() => setUser(userData), 0);
  };

  const signup = (email, username) => {
    const userData = { id: crypto.randomUUID(), email, username };
    localStorage.setItem("localUser", JSON.stringify(userData));
    setTimeout(() => setUser(userData), 0);
  };

  const logout = () => {
    localStorage.removeItem("localUser");
    setTimeout(() => setUser(null), 0);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
