"use client";

import { useAppStore } from "@/lib/store/app-store";
import { Bell, Search, CheckCircle2, AlertTriangle, Info, Menu } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function Topbar() {
  const { currentUser, notifications, markNotificationRead, markAllNotificationsRead, toggleSidebar } = useAppStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button 
          onClick={toggleSidebar}
          className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search tasks, volunteers, or resources..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-lg text-sm focus:bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                <span className="font-bold text-gray-900 text-sm">Notifications</span>
                <div className="flex items-center gap-3">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                  {unreadCount > 0 && (
                    <span className="text-xs font-semibold text-red-500">{unreadCount} new</span>
                  )}
                </div>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500">No notifications</div>
                ) : (
                  notifications.map(notif => (
                    <div 
                      key={notif.id} 
                      onClick={() => markNotificationRead(notif.id)}
                      className={cn(
                        "p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors flex gap-3",
                        !notif.read && "bg-blue-50/30"
                      )}
                    >
                      <div className="mt-0.5">
                        {notif.type === "Urgent_Request" && <AlertTriangle className="w-4 h-4 text-orange-500" />}
                        {notif.type === "Shortage_Alert" && <AlertTriangle className="w-4 h-4 text-red-500" />}
                        {notif.type === "Task_Assigned" && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                        {!["Urgent_Request", "Shortage_Alert", "Task_Assigned"].includes(notif.type) && <Info className="w-4 h-4 text-gray-400" />}
                      </div>
                      <div>
                        <p className={cn("text-sm font-semibold mb-0.5", !notif.read ? "text-gray-900" : "text-gray-600")}>
                          {notif.title}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-2">{notif.message}</p>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase font-semibold">
                          {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                      {!notif.read && (
                        <div className="w-2 h-2 bg-primary rounded-full self-center ml-auto shrink-0"></div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-gray-200"></div>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-gray-900 leading-tight">{currentUser?.name || "Guest"}</p>
            <p className="text-xs text-gray-500 font-medium">{currentUser?.role || "Viewer"}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-primary/20">
            {currentUser?.name.charAt(0) || "G"}
          </div>
        </div>
      </div>
    </header>
  );
}
