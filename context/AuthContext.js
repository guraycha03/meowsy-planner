"use client";

import { createContext, useContext, useState, useEffect, useMemo } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // --- 1. INITIAL STATE ---
  // We start as null/true for SSR safety.
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // --- 2. SINGLE EFFECT FOR HYDRATION ---
  useEffect(() => {
    // This runs once on mount in the browser
    const syncAuth = () => {
      const saved = localStorage.getItem("currentUser");
      if (saved) {
        try {
          const parsedUser = JSON.parse(saved);
          setUser(parsedUser);
        } catch (e) {
          console.error("Auth Sync Error:", e);
          localStorage.removeItem("currentUser");
        }
      }
      setLoading(false);
      setIsMounted(true);
    };

    syncAuth();
  }, []);

  // --- 3. AUTH ACTIONS ---
  const login = (email) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      setUser(existingUser);
      localStorage.setItem("currentUser", JSON.stringify(existingUser));
      return true;
    }
    return false;
  };

  const signup = (email, username) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.find((u) => u.email === email)) return false;

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
    window.location.href = "/login";
  };

  // --- 4. MEMOIZED VALUE ---
  // Performance optimization: prevents unnecessary re-renders of the entire app
  const value = useMemo(() => ({
    user,
    loading,
    login,
    signup,
    logout,
    isMounted
  }), [user, loading, isMounted]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);