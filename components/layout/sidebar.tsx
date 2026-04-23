"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Inbox, CheckSquare, Users, Package, AlertTriangle, BarChart3, Briefcase, MonitorPlay, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store/app-store";

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Needs & Requests', href: '/requests', icon: Inbox, countKey: 'openRequests' },
  { name: 'Task Board', href: '/tasks', icon: CheckSquare, countKey: 'activeTasks' },
  { name: 'Shortages', href: '/shortages', icon: AlertTriangle, countKey: 'openShortages' },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Volunteers', href: '/volunteers', icon: Users },
  { name: 'Partner NGOs', href: '/partners', icon: Briefcase },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Overwatch', href: '/overwatch', icon: MonitorPlay },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { requests, shortages, currentUser, isSidebarOpen, toggleSidebar } = useAppStore();

  const liveCounts: Record<string, number> = {
    openRequests: requests.filter(r => r.status === "New" || r.status === "Triaged").length,
    activeTasks: requests.filter(r => r.status === "Assigned" || r.status === "In Progress").length,
    openShortages: shortages.filter(s => s.status === "Open").length,
  };

  return (
    <Fragment>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      <div className={cn(
        "w-[264px] bg-[#111827] text-white flex flex-col h-full shrink-0 fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-[72px] flex items-center justify-between px-6 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-white text-sm">V</div>
            <span className="font-semibold text-lg tracking-tight">Voluntra</span>
          </div>
          <button onClick={toggleSidebar} className="md:hidden text-gray-400 hover:text-white p-1 -mr-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            const count = item.countKey ? liveCounts[item.countKey] : 0;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-[#1F2937] text-white border-l-[3px] border-primary" 
                    : "text-gray-400 hover:text-white hover:bg-[#1F2937]/50 border-l-[3px] border-transparent"
                )}
              >
                <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-white" : "text-gray-400")} />
                <span className="flex-1">{item.name}</span>
                {count > 0 && (
                  <span className={cn(
                    "text-xs py-0.5 px-2 rounded-full font-bold",
                    item.countKey === "openShortages" ? "bg-red-500/20 text-red-400" : "bg-primary/20 text-primary-soft"
                  )}>
                    {count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-white text-sm">
              {currentUser?.name?.split(' ').map(n => n[0]).join('') || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{currentUser?.name || "Admin User"}</p>
              <p className="text-xs text-gray-400 truncate">{currentUser?.role || "Global Coordinator"}</p>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
