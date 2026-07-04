"use client";

import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { toggleSidebar } from "@/lib/store/slices/user/uiSlice";
import { getInitials } from "@/utils/format";

interface TopBarProps {
  title?: string;
}

export function TopBar({ title }: TopBarProps) {
  const dispatch = useAppDispatch();
  const school = useAppSelector((s) => s.school.currentSchool);

  return (
    <header className="h-16 border-b bg-card flex items-center gap-4 px-4 shrink-0">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => dispatch(toggleSidebar())}
      >
        <Menu className="h-4 w-4" />
      </Button>

      {title && (
        <h1 className="font-semibold text-base hidden sm:block">{title}</h1>
      )}

      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs bg-primary text-primary-foreground">
            {school?.name ? getInitials(school.name) : "SP"}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
