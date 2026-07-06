"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  Calendar,
  Bell,
  ChevronLeft,
  GraduationCap,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { toggleSidebar } from "@/lib/store/slices/user/uiSlice";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/students", icon: Users, label: "Students" },
  { href: "/fees", icon: FileText, label: "Fee Records" },
  { href: "/installments", icon: Calendar, label: "Installments" },
  { href: "/payments", icon: CreditCard, label: "Payments" },
  { href: "/notifications", icon: Bell, label: "Notifications" },
];

export function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((s) => s.ui.sidebarOpen);
  const school = useAppSelector((s) => s.school.currentSchool);

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-card border-r transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-16",
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b min-h-[65px]">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary shrink-0">
          <GraduationCap className="h-5 w-5 text-primary-foreground" />
        </div>
        {isOpen && (
          <div className="overflow-hidden">
            <p className="font-bold text-sm leading-tight">ScholarPay</p>
            <p className="text-xs text-muted-foreground truncate max-w-[140px]">
              {school?.name ?? "School Admin"}
            </p>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn("ml-auto h-7 w-7 shrink-0", !isOpen && "hidden")}
          onClick={() => dispatch(toggleSidebar())}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {isOpen && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t">
        {!isOpen && (
          <Button
            variant="ghost"
            size="icon"
            className="w-full h-9"
            onClick={() => dispatch(toggleSidebar())}
          >
            <ChevronLeft className="h-4 w-4 rotate-180" />
          </Button>
        )}
        <Link
          href="/login"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors",
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {isOpen && <span>Sign Out</span>}
        </Link>
      </div>
    </aside>
  );
}
