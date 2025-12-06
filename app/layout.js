
// app/layout.js

import "./globals.css";
import TopNav from "../components/TopNav";
import BottomNav from "../components/BottomNav";
import { Quicksand } from "next/font/google";
import { Patrick_Hand } from "next/font/google"; // casual handwritten style

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const patrickHand = Patrick_Hand({
  subsets: ["latin"],
  variable: "--font-appname",
  weight: ["400"], // handwritten, usually normal weight
});



export const metadata = {
  title: "Meowsy Planner",
  icons: {
    icon: "icon.png", 
  },
  description: "A cute and engaging digital planner",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`antialiased flex flex-col min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] ${quicksand.variable} ${patrickHand.variable} tracking-wide`}
      >

        <TopNav />
        <main className="flex-1">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}