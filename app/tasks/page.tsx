"use client";

import PageHeader from "@/components/layout/page-header";
import { useAppStore } from "@/lib/store/app-store";
import { StatusChip } from "@/components/shared/status-chip";
import Link from "next/link";
import { MapPin, Clock, AlertOctagon, ChevronRight } from "lucide-react";
import { EntityAvatar } from "@/components/shared/entity-avatar";
import { RequestStatus } from "@/types/common";

const columns = [
  { id: "Triaged", title: "Open / Triaged", color: "bg-blue-500" },
  { id: "Assigned", title: "Assigned", color: "bg-amber-500" },
  { id: "In Progress", title: "In Progress", color: "bg-purple-500" },
  { id: "Escalated", title: "Escalated", color: "bg-red-500" },
  { id: "Completed", title: "Completed", color: "bg-green-500" },
];

export default function TaskBoardPage() {
  const { requests, volunteers, updateRequestStatus } = useAppStore();

  const getNextStatus = (currentStatus: string) => {
    const flow: Record<string, string> = {
      "New": "Triaged",
      "Triaged": "Assigned",
      "Assigned": "In Progress",
      "In Progress": "Completed",
    };
    return flow[currentStatus] || null;
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      <PageHeader title="Task Board" subtitle="Live view of operational progress across all zones." />
      
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-4 h-full min-w-max pb-4">
          {columns.map(col => {
            const columnTasks = requests.filter(r => 
              col.id === "Triaged" 
                ? ["New", "Triaged", "Recommended"].includes(r.status) 
                : r.status === col.id
            );

            return (
              <div key={col.id} className="w-[300px] flex flex-col bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-sm shrink-0">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${col.color}`} />
                    <h3 className="font-semibold text-gray-800 text-sm">{col.title}</h3>
                  </div>
                  <span className="bg-gray-200 text-gray-600 text-xs py-0.5 px-2 rounded-full font-medium">
                    {columnTasks.length}
                  </span>
                </div>
                
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {columnTasks.map(task => {
                    const assignedVol = volunteers.find(v => v.id === task.assignedVolunteerId);
                    const nextStatus = getNextStatus(task.status);
                    const isEscalated = task.status === "Escalated";
                    
                    return (
                      <div
                        key={task.id}
                        className={`bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow ${
                          isEscalated ? "border-red-300 border-l-4 border-l-red-500" : "border-gray-200 hover:border-primary"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <StatusChip status={task.status} />
                          <div className="flex items-center gap-1">
                            {task.priorityScore >= 75 && (
                              <span className="w-2 h-2 rounded-full bg-red-500" title="High priority" />
                            )}
                            {isEscalated && <AlertOctagon className="w-4 h-4 text-red-500" />}
                          </div>
                        </div>

                        <Link href={`/requests/${task.id}`}>
                          <h4 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2 hover:text-primary transition-colors">{task.title}</h4>
                        </Link>
                        
                        <div className="space-y-1.5 mt-2">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <MapPin className="w-3.5 h-3.5" /> {task.zone}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(task.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>

                        {assignedVol && (
                          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
                            <EntityAvatar size="sm" name={assignedVol.name} verificationLevel={assignedVol.verificationLevel} />
                            <span className="text-xs font-medium text-gray-700 truncate">{assignedVol.name}</span>
                          </div>
                        )}

                        {/* Move to next status */}
                        {nextStatus && task.status !== "Completed" && (
                          <button
                            onClick={() => updateRequestStatus(task.id, nextStatus as RequestStatus)}
                            className="mt-3 w-full flex items-center justify-center gap-1 text-xs text-primary hover:text-primary-hover font-semibold border border-primary/30 hover:border-primary rounded-lg py-1.5 transition-colors"
                          >
                            Move to {nextStatus} <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                  
                  {columnTasks.length === 0 && (
                    <div className="h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                      No tasks
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
