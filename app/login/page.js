"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  auth,
  googleProvider,
  facebookProvider,
} from "../../lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";

import { Eye, EyeOff } from "lucide-react"; // Shadcn icons

export default function LoginPage() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
        setError("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const validatePassword = () =>
  /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password);

  const friendlyErrorMessage = (code) => {
  const messages = {
    "auth/user-not-found": "Account not found. Consider signing up.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/email-already-in-use": "This email is already registered.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/weak-password": "Password is too weak. Must be at least 6 characters.",
    default: "An unexpected error occurred. Please try again.",
  };
  return messages[code] || messages.default;
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isLogin) {
      if (!validatePassword()) {
        setError("Password must be at least 8 characters and contain letters and numbers.");
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
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCred.user, { displayName: username });
      }
      router.push("/");
    } catch (err) {
  console.log("Firebase error:", err);
  setError(friendlyErrorMessage(err.code));
}

  };

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/");
    } catch (err) {
  console.log("Firebase error:", err);
  setError(friendlyErrorMessage(err.code));
}

  };

  const loginWithFacebook = async () => {
    try {
      await signInWithPopup(auth, facebookProvider);
      router.push("/");
    } catch (err) {
  console.log("Firebase error:", err);
  setError(friendlyErrorMessage(err.code));
}

  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-[var(--color-background)]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6 relative">

        {/* Illustration */}
        <div className="flex justify-center">
          <img
            src="/images/login-illustration.png"
            alt="Planner illustration"
            className="w-40 h-40 object-contain"
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center">
          {isLogin ? "Welcome Back!" : "Create Your Account"}
        </h2>

        {/* Error notification */}
        {showError && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-2 rounded-md text-center transition-opacity duration-500">
            {error}
          </div>
        )}

        {/* Form label */}
        <div className="text-center mb-2">
          <span className="text-[var(--color-text-dark)] font-semibold">
            {isLogin ? "Login to your account" : "Sign up for a new account"}
          </span>
        </div>

        {/* Form */}
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

          {/* Password with eye icon toggle */}
          {/* Password with eye icon toggle */}
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

{/* Confirm Password (if signing up) */}
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

        {/* OR divider */}
        <div className="relative my-4">
          <hr />
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 text-gray-400 text-sm">
            OR
          </span>
        </div>

        {/* Social Buttons */}
        <button
          onClick={loginWithGoogle}
          className="w-full p-3 rounded-xl border-2 border-[#e6e6e6] bg-white flex justify-center items-center gap-3 hover:bg-[#F5F5F5] transition"
        >
          <img src="/images/google.svg" className="w-5" />
          <span className="text-gray-700">Continue with Google</span>
        </button>

        <button
          onClick={loginWithFacebook}
          className="w-full p-3 rounded-xl border-2 border-[#e6e6e6] bg-white flex justify-center items-center gap-3 hover:bg-[#F5F5F5] transition"
        >
          <img src="/images/facebook.svg" className="w-5" />
          <span className="text-gray-700">Continue with Facebook</span>
        </button>

        {/* Login / Sign up toggle */}
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
