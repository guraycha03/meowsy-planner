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
    <nav className="fixed bottom-0 w-full bg-[#f0d9c4] shadow-t py-6 flex justify-around rounded-t-xl z-50">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center relative cursor-pointer"
          >
            {/* Active indicator */}
            {isActive && (
              <span className="absolute -top-2 w-10 h-1.5 rounded-full bg-[#eabfa7] opacity-90" />
            )}

            {/* Icon */}
            <Icon
              size={22}
              stroke={isActive ? "#637e3f" : "#5c544d"}
              className="transition-colors duration-200"
            />

            {/* Label */}
            <span
              style={{
                color: isActive ? "#637e3f" : "#5c544d",
                fontWeight: isActive ? 600 : 400,
                transition: "color 0.2s",
              }}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
