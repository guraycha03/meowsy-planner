// app/layout.js


"use client";


import "./globals.css";
import { Quicksand, Patrick_Hand } from "next/font/google";
import { AuthProvider } from "../context/AuthContext";
import AuthWrapper from "../components/AuthWrapper";
import TopNav from "../components/TopNav";
import BottomNav from "../components/BottomNav";
import { usePathname } from "next/navigation";

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
  return (
    <html lang="en">
      <body
        className={`antialiased flex flex-col min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] ${quicksand.variable} ${patrickHand.variable} tracking-wide`}
      >
        <AuthProvider>
          <AuthWrapper>
            <LayoutWrapper>{children}</LayoutWrapper>
          </AuthWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}

// Inner wrapper to handle conditional top/bottom nav
function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const hideNavPages = ["/login", "/signup"]; // pages where nav should be hidden
  const showNav = !hideNavPages.includes(pathname);

  return (
    <>
      {showNav && <TopNav />}
      <main className="flex-1">{children}</main>
      {showNav && <BottomNav />}
    </>
  );
}
