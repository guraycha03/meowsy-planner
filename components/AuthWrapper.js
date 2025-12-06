"use client";

import { useAuth } from "../context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthWrapper({ children }) {
  const { user, loading } = useAuth(); // <-- get loading
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return; // <-- wait until auth state is resolved

    const publicRoutes = ["/login", "/signup"];

    if (!user && !publicRoutes.includes(pathname)) {
      router.push("/login");
    }

    if (user && publicRoutes.includes(pathname)) {
      router.push("/");
    }
  }, [user, loading, pathname, router]);

  if (loading) return null; // <-- don't render children until ready

  return children;
}
