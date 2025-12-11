// app/layout.js
"use client";

import "./globals.css";
import { Quicksand, Patrick_Hand } from "next/font/google";
import { AuthProvider } from "../context/AuthContext";
import { usePathname } from "next/navigation";
import TopNav from "../components/TopNav";
import BottomNav from "../components/BottomNav";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const patrickHand = Patrick_Hand({
  subsets: ["latin"],
  variable: "--font-appname",
  weight: ["400"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Pages where we hide TopNav and BottomNav
  const hideNavPages = ["/login", "/signup"];

  const showNav = !hideNavPages.includes(pathname);

  return (
    <html lang="en">
      <body className={`${quicksand.variable} ${patrickHand.variable} font-sans`}>
        <AuthProvider>
          {showNav && <TopNav />}
          <main className="flex-1">{children}</main>
          {showNav && <BottomNav />}
        </AuthProvider>
      </body>
    </html>
  );
}
