"use client";

import { useAppStore } from "@/lib/store/app-store";
import { MapPin, Clock, CheckCircle2, AlertCircle, Menu } from "lucide-react";
import Link from "next/link";
import { StatusChip, UrgencyChip } from "@/components/shared/status-chip";

export default function VolunteerDashboard() {
  const { requests, currentUser } = useAppStore();
  
  if (!currentUser) return null;

  const myTasks = requests.filter(r => r.assignedVolunteerId === currentUser.id);
  const activeTasks = myTasks.filter(r => r.status === "Assigned" || r.status === "In Progress");

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen flex flex-col">
      {/* Mobile Header */}
      <header className="bg-primary text-white px-5 py-4 flex justify-between items-center shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
            {currentUser.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h1 className="font-semibold">{currentUser.name}</h1>
            <div className="flex items-center gap-1 text-xs text-primary-soft">
              <span className="w-2 h-2 rounded-full bg-green-400"></span> Active
            </div>
          </div>
        </div>
        <button><Menu className="w-6 h-6 text-white" /></button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
            <p className="text-2xl font-bold text-gray-900">{activeTasks.length}</p>
            <p className="text-xs text-gray-500 font-medium mt-1">Current Tasks</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
            <p className="text-2xl font-bold text-gray-900">{currentUser.reliabilityScore}%</p>
            <p className="text-xs text-gray-500 font-medium mt-1">Reliability</p>
          </div>
        </div>

        {/* Active Assignments */}
        <div>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 px-1">My Assignments</h2>
          <div className="space-y-3">
            {activeTasks.map(task => (
              <Link 
                key={task.id}
                href={`/volunteer/tasks/${task.id}`}
                className="block bg-white p-4 rounded-xl border border-gray-200 shadow-sm active:bg-gray-50"
              >
                <div className="flex justify-between items-start mb-2">
                  <UrgencyChip level={task.urgencyLevel} />
                  <StatusChip status={task.status} />
                </div>
                <h3 className="font-bold text-gray-900 leading-tight mb-2">{task.title}</h3>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>{task.address} • {task.zone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <AlertCircle className="w-3.5 h-3.5 text-gray-400" />
                    <span className="truncate">{task.requestedResources || "No specific resources"}</span>
                  </div>
                </div>
              </Link>
            ))}
            
            {activeTasks.length === 0 && (
              <div className="text-center p-8 bg-white rounded-xl border border-dashed border-gray-300">
                <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">You have no active tasks.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
