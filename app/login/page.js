"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, signup } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const validatePassword = () =>
    /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!isLogin) {
      if (!validatePassword()) {
        setError(
          "Password must be at least 8 characters and contain letters and numbers."
        );
        return;
      }
      if (password !== confirmPass) {
        setError("Passwords do not match.");
        return;
      }
      if (username.trim().length < 3) {
        setError("Username must be at least 3 characters.");
        return;
      }
      // Sign up
      signup(email, username);
      router.push("/");
    } else {
      // Login
      login(email);
      router.push("/");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-[var(--color-background)]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6 relative">
        <div className="flex justify-center">
          <img
            src="/images/login-illustration.png"
            alt="Planner illustration"
            className="w-40 h-40 object-contain"
          />
        </div>

        <h2 className="text-2xl font-bold text-center">
          {isLogin ? "Welcome Back!" : "Create Your Account"}
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-2 rounded-md text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-xl border-2 border-[#e6e6e6] bg-[#FCFCFC] placeholder-gray-400 text-gray-700 focus:outline-none focus:border-[var(--color-accent-dark2)] transition"
              required
            />
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl border-2 border-[#e6e6e6] bg-[#FCFCFC] placeholder-gray-400 text-gray-700 focus:outline-none focus:border-[var(--color-accent-dark2)] transition"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl border-2 border-[#e6e6e6] bg-[#FCFCFC] placeholder-gray-400 text-gray-700 focus:outline-none focus:border-[var(--color-accent-dark2)] transition"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 inset-y-0 flex items-center text-gray-500 focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {!isLogin && (
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                className="w-full p-3 rounded-xl border-2 border-[#e6e6e6] bg-[#FCFCFC] placeholder-gray-400 text-gray-700 focus:outline-none focus:border-[var(--color-accent-dark2)] transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 inset-y-0 flex items-center text-gray-500 focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[var(--color-accent-dark2)] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-[var(--color-text-dark)]">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            className="text-[var(--color-accent-dark2)] cursor-pointer font-semibold"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}
