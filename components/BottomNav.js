"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, FileText, CheckSquare } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/calendar", label: "Calendar", icon: Calendar },
    { href: "/notes", label: "Notes", icon: FileText },
    { href: "/checklist", label: "Checklist", icon: CheckSquare },
  ];

  return (
      <nav className="fixed bottom-0 w-full bg-[var(--color-accent-light)] py-4 flex justify-around rounded-t-xl z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] lg:hidden">
        {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center relative group cursor-pointer"
          >
            <span
              className={`absolute -top-4 w-10 h-1.5 rounded-full transition-all duration-300 ${
                isActive
                  ? "bg-[var(--color-dark-green)] opacity-100 scale-x-100"
                  : "bg-[var(--color-accent-light)] opacity-0 scale-x-0"
              }`}
            />
            <Icon
              size={24}
              stroke={isActive ? "var(--color-dark-green)" : "var(--color-nav-inactive)"}
              className="transition-colors duration-300 group-hover:stroke-[var(--color-dark-green)]"
            />
            <span
              className={`text-sm mt-1 transition-all duration-300 ${
                isActive
                  ? "text-[var(--color-dark-green)] font-semibold"
                  : "text-[var(--color-nav-inactive)] font-medium group-hover:text-[var(--color-dark-green)]"
              }`}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
