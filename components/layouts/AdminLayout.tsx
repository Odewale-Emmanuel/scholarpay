"use client";

import { useEffect, useState } from "react";

import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

import { authHelper } from "@/utils/auth-helper";
import { useNavigate } from "@/hooks/useNavigate";
import { Loader } from "../shared/Loader";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const { navigateTo } = useNavigate();

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authenticated = authHelper.isAuthenticated();

    if (!authenticated) {
      navigateTo("/login");
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAuthenticated(true);
    }

    setIsCheckingAuth(false);
  }, [navigateTo]);

  if (isCheckingAuth) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar title={title} />

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
