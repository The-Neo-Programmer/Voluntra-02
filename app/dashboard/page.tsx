"use client";

import PageHeader from "@/components/layout/page-header";
import { MetricCard } from "@/components/shared/metric-card";
import { useAppStore } from "@/lib/store/app-store";
import { enhanceRequestsWithPriority } from "@/lib/logic/priority-engine";
import { Inbox, AlertTriangle, Users, CheckSquare, Activity, Map, Package, TrendingUp } from "lucide-react";
import Link from "next/link";
import { StatusChip, UrgencyChip } from "@/components/shared/status-chip";
import { EntityAvatar } from "@/components/shared/entity-avatar";

export default function DashboardPage() {
  const { requests, volunteers, shortages, inventory, activities } = useAppStore();
  
  const prioritizedRequests = enhanceRequestsWithPriority(requests);
  const openRequests = prioritizedRequests.filter(r => r.status === "New" || r.status === "Triaged");
  const criticalRequests = prioritizedRequests.filter(r => r.priorityScore >= 75 && r.status !== "Completed");
  const activeTasks = prioritizedRequests.filter(r => r.status === "Assigned" || r.status === "In Progress");
  const availableVolunteers = volunteers.filter(v => v.availabilityStatus === "Available");
  const busyVolunteers = volunteers.filter(v => v.availabilityStatus === "Busy");
  const offlineVolunteers = volunteers.filter(v => v.availabilityStatus === "Offline");
  const openShortages = shortages.filter(s => s.status === "Open");
  const lowStockItems = inventory.filter(i => i.stock > 0 && i.stock <= i.lowStockThreshold);
  const completedRequests = requests.filter(r => r.status === "Completed");
  const totalBeneficiaries = completedRequests.reduce((sum, r) => sum + (r.peopleAffected || 0), 0);

  // Dynamic zone counts
  const allZones = ["South Zone", "North Zone", "East Zone", "West Zone", "Central Zone"];
  const zoneCounts = allZones
    .map(zone => ({ name: zone.replace(" Zone", ""), count: requests.filter(r => r.zone === zone && r.status !== "Completed").length }))
    .filter(z => z.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  const getZoneColor = (count: number) => {
    if (count >= 6) return "text-red-600";
    if (count >= 4) return "text-orange-500";
    if (count >= 2) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div>
      <PageHeader 
        title="Operations Command Center" 
        subtitle="Monitor urgent needs, field activities, shortages, and volunteer readiness in real time."
      />
      
      {/* KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <MetricCard title="Open Requests" value={openRequests.length} icon={<Inbox className="w-5 h-5" />} />
        <MetricCard title="Critical Needs" value={criticalRequests.length} icon={<AlertTriangle className="w-5 h-5 text-red-500" />} highlightClass="text-red-600" />
        <MetricCard title="Active Tasks" value={activeTasks.length} icon={<CheckSquare className="w-5 h-5" />} />
        <MetricCard title="Ready Volunteers" value={availableVolunteers.length} icon={<Users className="w-5 h-5" />} highlightClass="text-green-600" />
        <Link href="/shortages" className="block hover:scale-[1.02] transition-transform">
          <MetricCard title="Open Shortages" value={openShortages.length} icon={<AlertTriangle className="w-5 h-5 text-orange-500" />} highlightClass="text-orange-600" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Priority Triage Queue */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Priority Triage Queue</h3>
              <Link href="/requests" className="text-sm text-primary hover:text-primary-hover font-medium">View All</Link>
            </div>
            <div className="divide-y divide-gray-100">
              {prioritizedRequests.filter(r => r.status !== "Completed").slice(0, 6).map(req => (
                <div key={req.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold w-10 shrink-0 ${req.priorityScore >= 75 ? 'text-red-600' : req.priorityScore >= 50 ? 'text-orange-500' : 'text-gray-500'}`}>
                        #{req.priorityScore}
                      </span>
                      <Link href={`/requests/${req.id}`} className="font-medium text-gray-900 hover:text-primary truncate">
                        {req.title}
                      </Link>
                      {req.duplicateWarning && (
                        <span className="bg-orange-100 text-orange-700 text-[10px] px-2 py-0.5 rounded font-bold uppercase shrink-0">Dup?</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate pl-12">{req.category} • {req.zone}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <UrgencyChip level={req.urgencyLevel} />
                    <StatusChip status={req.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Zone Intelligence — Dynamic */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <Map className="w-5 h-5 text-gray-500" />
              <h3 className="font-semibold text-gray-900">Zone Intelligence</h3>
              <span className="text-xs text-gray-400 ml-auto">Active requests by zone</span>
            </div>
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {zoneCounts.length > 0 ? zoneCounts.map((zone, idx) => (
                <div key={zone.name} className={idx > 0 ? "border-l border-gray-100" : ""}>
                  <p className={`text-2xl font-bold ${getZoneColor(zone.count)}`}>{zone.count}</p>
                  <p className="text-xs font-semibold text-gray-500 uppercase mt-1">{zone.name}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {zone.count >= 6 ? "Critical Strain" : zone.count >= 4 ? "High Load" : zone.count >= 2 ? "Moderate" : "Low"}
                  </p>
                </div>
              )) : (
                <div className="col-span-4 text-center text-gray-400 text-sm py-2">No active zone pressure</div>
              )}
            </div>
          </div>

          {/* Analytics Snapshot */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold text-gray-900">Impact Snapshot</h3>
              <Link href="/analytics" className="text-sm text-primary hover:text-primary-hover font-medium ml-auto">Full Report</Link>
            </div>
            <div className="p-6 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">{completedRequests.length}</p>
                <p className="text-xs text-gray-500 font-medium mt-1">Tasks Completed</p>
              </div>
              <div className="border-l border-gray-100">
                <p className="text-2xl font-bold text-blue-600">{totalBeneficiaries.toLocaleString()}</p>
                <p className="text-xs text-gray-500 font-medium mt-1">Beneficiaries Served</p>
              </div>
              <div className="border-l border-gray-100">
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round((completedRequests.length / Math.max(requests.length, 1)) * 100)}%
                </p>
                <p className="text-xs text-gray-500 font-medium mt-1">Completion Rate</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Side Column */}
        <div className="space-y-6">

          {/* Live Activity Feed */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-[320px] flex flex-col">
            <div className="bg-gray-50 px-5 py-4 border-b border-gray-200 flex items-center gap-2 shrink-0">
              <Activity className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-gray-900">Live Activity Feed</h3>
            </div>
            <div className="p-5 overflow-y-auto flex-1 space-y-5">
              {activities.slice(0, 10).map(act => (
                <div key={act.id} className="relative pl-4 border-l-2 border-gray-200 pb-1">
                  <div className={`absolute w-2.5 h-2.5 rounded-full -left-[5.5px] top-1.5 ${
                    act.type === 'Shortage_Reported' ? 'bg-red-500' :
                    act.type === 'Task_Assigned' ? 'bg-blue-500' :
                    act.type === 'Status_Changed' ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                  <p className="text-sm font-medium text-gray-900 leading-tight">{act.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-semibold text-gray-500">{act.actorName}</span>
                    <span className="text-[10px] text-gray-400">• {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Volunteer Readiness Panel */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-500" />
                <h3 className="font-semibold text-gray-900">Volunteer Readiness</h3>
              </div>
              <Link href="/volunteers" className="text-xs text-primary font-medium">See All</Link>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center p-2 bg-green-50 rounded-lg border border-green-100">
                  <p className="text-lg font-bold text-green-600">{availableVolunteers.length}</p>
                  <p className="text-[11px] text-green-700 font-medium">Available</p>
                </div>
                <div className="text-center p-2 bg-orange-50 rounded-lg border border-orange-100">
                  <p className="text-lg font-bold text-orange-500">{busyVolunteers.length}</p>
                  <p className="text-[11px] text-orange-600 font-medium">Busy</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-lg font-bold text-gray-500">{offlineVolunteers.length}</p>
                  <p className="text-[11px] text-gray-500 font-medium">Offline</p>
                </div>
              </div>
              <div className="space-y-2">
                {availableVolunteers.slice(0, 3).map(vol => (
                  <div key={vol.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <EntityAvatar size="sm" name={vol.name} verificationLevel={vol.verificationLevel} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{vol.name}</p>
                      <p className="text-xs text-gray-500 truncate">{vol.skills?.slice(0, 2).join(", ")}</p>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Supply Alerts Panel */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-orange-500" />
                <h3 className="font-semibold text-gray-900">Supply Alerts</h3>
              </div>
              <Link href="/shortages" className="text-xs text-primary font-medium">See All</Link>
            </div>
            <div className="divide-y divide-gray-100">
              {openShortages.slice(0, 3).map(shortage => (
                <div key={shortage.id} className="px-4 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{shortage.itemName}</p>
                    <p className="text-xs text-gray-500">{shortage.quantityNeeded} units needed</p>
                  </div>
                  <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold">OPEN</span>
                </div>
              ))}
              {lowStockItems.slice(0, 2).map(item => (
                <div key={item.id} className="px-4 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                    <Package className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.stock} {item.unit} left</p>
                  </div>
                  <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-bold">LOW</span>
                </div>
              ))}
              {openShortages.length === 0 && lowStockItems.length === 0 && (
                <div className="px-4 py-6 text-center text-gray-400 text-sm">All supplies are healthy ✓</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
