"use client";

import { ReactNode } from "react";
import Sidebar from "./sidebar";
import Topbar from "./topbar";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/lib/store/app-store";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { currentUser } = useAppStore();
  
  // Hide shell for auth or pure mobile volunteer views
  const isMobileVolunteer = pathname.startsWith("/volunteer");
  const isAuth = pathname === "/auth" || pathname === "/";

  if (isAuth || isMobileVolunteer) {
    return <main className="min-h-screen bg-gray-50">{children}</main>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 bg-[#F5F7FA]">
          <div className="max-w-[1440px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
