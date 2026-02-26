"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  GraduationCap,
  ClipboardCheck,
  CalendarDays,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/classes", label: "Classes", icon: BookOpen },
  { href: "/grades", label: "Grades", icon: GraduationCap },
  { href: "/attendance", label: "Attend.", icon: ClipboardCheck },
  { href: "/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/profile", label: "Profile", icon: UserCircle },
];

export function MobileNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-border bg-white md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] text-xs transition-colors",
              active ? "text-blue-600" : "text-gray-500",
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
