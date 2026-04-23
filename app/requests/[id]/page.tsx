"use client";

import PageHeader from "@/components/layout/page-header";
import { StatusChip, UrgencyChip } from "@/components/shared/status-chip";
import { useAppStore } from "@/lib/store/app-store";
import { enhanceRequestsWithPriority } from "@/lib/logic/priority-engine";
import { matchVolunteersToRequest } from "@/lib/logic/matching-engine";
import { EntityAvatar } from "@/components/shared/entity-avatar";
import { notFound, useRouter } from "next/navigation";
import { Users, MapPin, Calendar, CheckSquare, Package, AlertTriangle, Clock, Activity, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function RequestDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { requests, volunteers, activities, assignVolunteer, updateRequestStatus } = useAppStore();
  
  const prioritizedRequests = enhanceRequestsWithPriority(requests);
  const request = prioritizedRequests.find(r => r.id === params.id);
  
  if (!request) {
    return <div className="p-12 text-center text-gray-500">Request not found.</div>;
  }

  const matches = matchVolunteersToRequest(request, volunteers).slice(0, 3);
  const assignedVolunteer = volunteers.find(v => v.id === request.assignedVolunteerId);
  const relatedActivities = activities.filter(a => a.relatedEntityId === request.id);
  const isOverdue = request.dueBy && new Date(request.dueBy) < new Date() && request.status !== "Completed";

  const handleAssign = (volunteerId: string) => {
    assignVolunteer(request.id, volunteerId);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Overdue Alert */}
      {isOverdue && (
        <div className="bg-red-50 border border-red-300 p-4 rounded-xl flex items-center gap-3">
          <Clock className="w-5 h-5 text-red-500 shrink-0" />
          <div>
            <h4 className="font-bold text-red-900">Request is Overdue</h4>
            <p className="text-sm text-red-700">Was due at {new Date(request.dueBy!).toLocaleString()}. Immediate action required.</p>
          </div>
        </div>
      )}

      {request.duplicateWarning && (
        <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-orange-900">Potential Duplicate Request Detected</h4>
            <p className="text-sm text-orange-800">A similar request was filed in this zone 2 hours ago. Please verify before dispatching.</p>
          </div>
          <button className="ml-auto bg-white border border-orange-200 text-orange-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-orange-100">
            Review Duplicates
          </button>
        </div>
      )}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-medium text-gray-500">{request.id}</span>
            <StatusChip status={request.status} />
            <UrgencyChip level={request.urgencyLevel} />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">{request.title}</h1>
          <p className="text-gray-500 text-sm mt-1">Source: {request.sourceType} {request.reporterName && `• ${request.reporterName}`}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => updateRequestStatus(request.id, "Escalated")}
            className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-1.5"
          >
            <ShieldAlert className="w-4 h-4" /> Escalate
          </button>
          <Link
            href={`/requests/${request.id}/edit`}
            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Edit
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {request.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Context</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{request.zone} • {request.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>{request.peopleAffected} People Affected</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{new Date(request.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Vulnerable Groups</h3>
                <div className="flex flex-wrap gap-2">
                  {request.vulnerabilityTags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-100 rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                  {request.vulnerabilityTags.length === 0 && (
                    <span className="text-gray-500 text-sm">None recorded</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 mb-4 border-b pb-2">
              <Package className="w-5 h-5 text-gray-400" />
              Requested Resources
            </h3>
            <p className="text-gray-700">{request.requestedResources || "No specific resources listed."}</p>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-5">
              <Activity className="w-5 h-5 text-blue-500" /> Activity Timeline
            </h3>
            {relatedActivities.length > 0 ? (
              <div className="space-y-4">
                {relatedActivities.map(act => (
                  <div key={act.id} className="relative pl-5 border-l-2 border-gray-200">
                    <div className={`absolute w-2.5 h-2.5 rounded-full -left-[5.5px] top-1.5 ${
                      act.type === 'Shortage_Reported' ? 'bg-red-500' :
                      act.type === 'Task_Assigned' ? 'bg-blue-500' :
                      act.type === 'Escalation' ? 'bg-orange-500' :
                      act.type === 'Status_Changed' ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                    <p className="text-sm font-medium text-gray-900">{act.message}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-500">{act.actorName}</span>
                      <span className="text-xs text-gray-400">• {new Date(act.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-300">
                <Clock className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No activity recorded yet.</p>
                <p className="text-xs text-gray-300 mt-1">Actions on this request will appear here.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - System & Assignment */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Priority Profile</h3>
            </div>
            <div className="p-5">
              <div className="flex items-end gap-3 mb-3">
                <span className="text-4xl font-bold text-gray-900">{request.priorityScore}</span>
                <span className="text-sm text-gray-500 mb-1">/ 100</span>
              </div>
              <p className="text-sm text-gray-600 font-medium mb-3 pb-3 border-b border-gray-100">
                {request.priorityFactors?.riskTier}
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  {request.priorityFactors?.explanation}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Task Assignment</h3>
            </div>
            <div className="p-5">
              {assignedVolunteer ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">Currently Assigned To:</p>
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <EntityAvatar name={assignedVolunteer.name} verificationLevel={assignedVolunteer.verificationLevel} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{assignedVolunteer.name}</p>
                      <p className="text-xs text-gray-500">{assignedVolunteer.phone}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm font-medium text-gray-900">Top Recommended Volunteers</p>
                  {matches.map((match, index) => (
                    <div key={match.volunteer.id} className="border border-gray-200 rounded-lg p-3 hover:border-primary transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <EntityAvatar size="sm" name={match.volunteer.name} verificationLevel={match.volunteer.verificationLevel} />
                          <div>
                            <p className="text-sm font-medium text-gray-900 leading-tight">{match.volunteer.name}</p>
                            <p className="text-xs text-gray-500">{match.matchScore}% Match</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleAssign(match.volunteer.id)}
                          className="px-3 py-1 bg-primary text-white rounded text-xs font-medium hover:bg-primary-hover"
                        >
                          Assign
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {match.matchReasons.slice(0, 2).map((r, i) => (
                          <span key={i} className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded font-medium border border-green-200">
                            ✓ {r}
                          </span>
                        ))}
                        {match.volunteer.currentWorkload && match.volunteer.currentWorkload > 0 ? (
                           <span className="text-[10px] bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded font-medium border border-orange-200">
                             ⚠ Currently active on {match.volunteer.currentWorkload} task(s)
                           </span>
                        ) : null}
                        {match.volunteer.verificationLevel === "Basic" ? (
                           <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium border border-gray-200">
                             ⚠ Unverified Status
                           </span>
                        ) : null}
                      </div>
                    </div>
                  ))}
                  {matches.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No available volunteers found.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
