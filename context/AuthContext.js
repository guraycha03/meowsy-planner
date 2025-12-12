"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("currentUser");
    if (saved) {
      // Defer setState to avoid synchronous update in effect
      setTimeout(() => setUser(JSON.parse(saved)), 0);
    }
    setTimeout(() => setLoading(false), 0);
  }, []);

  const login = (email) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const existingUser = users.find((u) => u.email === email);

    if (existingUser) {
      setUser(existingUser);
      localStorage.setItem("currentUser", JSON.stringify(existingUser));
      return true;
    } else {
      return false;
    }
  };

  const signup = (email, username) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const existingUser = users.find((u) => u.email === email);

    if (existingUser) {
      return false;
    }

    const userData = { id: crypto.randomUUID(), email, username };
    users.push(userData);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(userData));
    setUser(userData);
    return true;
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
