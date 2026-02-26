"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  GraduationCap,
  ClipboardCheck,
  CalendarDays,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  studentName: string;
}

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/classes", label: "My Classes", icon: BookOpen },
  { href: "/grades", label: "My Grades", icon: GraduationCap },
  { href: "/attendance", label: "Attendance", icon: ClipboardCheck },
  { href: "/schedule", label: "Schedule", icon: CalendarDays },
];

export function Sidebar({
  isCollapsed,
  onToggleCollapse,
  studentName,
}: SidebarProps) {
  const pathname = usePathname();

  const initials = studentName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r border-border bg-sidebar-bg h-screen sticky top-0 transition-all duration-200",
        isCollapsed ? "w-16" : "w-60",
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center justify-between border-b border-border px-3">
        {!isCollapsed && (
          <Link href="/" className="text-lg font-bold text-gray-900">
            EduTrack{" "}
            <span className="text-sm font-normal text-gray-500">Student</span>
          </Link>
        )}
        <button
          onClick={onToggleCollapse}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 cursor-pointer"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                isCollapsed && "justify-center px-0",
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && (
                <span className="flex-1">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Student info */}
      {!isCollapsed && (
        <div className="border-t border-border p-3">
          <Link
            href="/profile"
            className={cn(
              "flex items-center gap-3 rounded-lg p-1.5 transition-colors hover:bg-gray-100",
              isActive("/profile") && "bg-blue-50",
            )}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-900">
                {studentName}
              </p>
              <p className="text-xs text-gray-500">View profile</p>
            </div>
          </Link>
        </div>
      )}

      {isCollapsed && (
        <div className="border-t border-border p-3 flex justify-center">
          <Link
            href="/profile"
            className="rounded-lg p-1 transition-colors hover:bg-gray-100"
            title="View profile"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
              {initials}
            </div>
          </Link>
        </div>
      )}
    </aside>
  );
}
