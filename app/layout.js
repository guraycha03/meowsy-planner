

// app/layout.js




import "./globals.css";
import TopNav from "../components/TopNav";
import BottomNav from "../components/BottomNav";
import { Quicksand, Fredoka } from "next/font/google";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-appname",
  weight: ["700"], // bold = similar to Fredoka One
});



export const metadata = {
  title: "Meowsy Planner",
  description: "A cute and engaging digital planner",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`antialiased flex flex-col min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] ${quicksand.variable} ${fredoka.variable} tracking-wide`}
      >
        <TopNav />
        <main className="flex-1">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
