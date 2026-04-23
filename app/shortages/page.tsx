"use client";

import PageHeader from "@/components/layout/page-header";
import { useAppStore } from "@/lib/store/app-store";
import { AlertTriangle, Clock, Link as LinkIcon, CheckCircle2, X, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { EntityAvatar } from "@/components/shared/entity-avatar";

export default function ShortagesPage() {
  const { shortages, requests, volunteers, partners, updateShortageStatus } = useAppStore();

  const openCount = shortages.filter(s => s.status === "Open").length;
  const resolvedCount = shortages.filter(s => s.status === "Resolved").length;

  return (
    <div>
      <PageHeader title="Active Shortages" subtitle="Critical material gaps reported by field volunteers.">
        <div className="flex gap-3 text-sm">
          <span className="bg-red-100 text-red-700 border border-red-200 px-3 py-1.5 rounded-lg font-semibold">{openCount} Open</span>
          <span className="bg-green-100 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg font-semibold">{resolvedCount} Resolved</span>
        </div>
      </PageHeader>
      
      <div className="grid grid-cols-1 gap-4">
        {shortages.map(shortage => {
          const relatedRequest = requests.find(r => r.id === shortage.requestId);
          const reportingVolunteer = volunteers.find(v => v.id === shortage.volunteerId);
          const claimingPartner = partners.find(p => p.id === shortage.claimedByPartnerId);

          return (
            <div key={shortage.id} className={`bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col md:flex-row ${
              shortage.status === "Resolved" ? "border-green-200 opacity-75" : "border-gray-200"
            }`}>
              <div className={`p-6 flex flex-col justify-center items-center md:w-48 border-b md:border-b-0 md:border-r border-gray-200 shrink-0 ${
                shortage.status === "Resolved" ? "bg-green-50" : "bg-red-50"
              }`}>
                {shortage.status === "Resolved" 
                  ? <CheckCircle2 className="w-8 h-8 text-green-500 mb-2" />
                  : <AlertTriangle className="w-8 h-8 text-red-500 mb-2" />
                }
                <span className="text-2xl font-bold text-red-700">{shortage.quantityNeeded}</span>
                <span className="text-sm font-medium text-red-800 text-center">{shortage.itemName}</span>
              </div>
              
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">Missing: {shortage.itemName}</h3>
                      <div className="flex items-center flex-wrap gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" /> Reported {new Date(shortage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {relatedRequest && (
                          <Link href={`/requests/${shortage.requestId}`} className="flex items-center gap-1 text-primary hover:underline">
                            <LinkIcon className="w-4 h-4" /> {relatedRequest.title}
                          </Link>
                        )}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide shrink-0 ${
                      shortage.status === "Open" ? "bg-red-100 text-red-700 border-red-200"
                      : shortage.status === "Resolved" ? "bg-green-100 text-green-700 border-green-200"
                      : "bg-blue-100 text-blue-700 border-blue-200"
                    }`}>
                      {shortage.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Reported By</span>
                    {reportingVolunteer && (
                      <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                        <EntityAvatar size="sm" name={reportingVolunteer.name} verificationLevel={reportingVolunteer.verificationLevel} />
                        <span className="text-sm font-medium text-gray-900">{reportingVolunteer.name}</span>
                      </div>
                    )}
                    {!reportingVolunteer && (
                      <span className="text-sm text-gray-500">Field Volunteer</span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {shortage.status === "Open" && (
                      <>
                        <button
                          onClick={() => updateShortageStatus(shortage.id, "Acknowledged")}
                          className="flex items-center gap-1.5 border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                          <ShieldAlert className="w-4 h-4" /> Acknowledge
                        </button>
                        <button
                          onClick={() => updateShortageStatus(shortage.id, "Resolved")}
                          className="flex items-center gap-1.5 bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Resolve
                        </button>
                      </>
                    )}
                    {shortage.status === "Acknowledged" && (
                      <button
                        onClick={() => updateShortageStatus(shortage.id, "Resolved")}
                        className="flex items-center gap-1.5 bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Mark Resolved
                      </button>
                    )}
                    {shortage.status === "Claimed" && claimingPartner && (
                      <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 px-4 py-1.5 rounded-lg font-medium border border-blue-200">
                        <CheckCircle2 className="w-4 h-4" />
                        Supply en route via {claimingPartner.name}
                      </div>
                    )}
                    {shortage.status === "Resolved" && (
                      <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-4 py-1.5 rounded-lg font-medium border border-green-200">
                        <CheckCircle2 className="w-4 h-4" /> Resolved
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {shortages.length === 0 && (
          <div className="p-12 text-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-600 font-medium text-lg">No active shortages.</p>
            <p className="text-gray-500 text-sm">All field volunteers are fully supplied.</p>
          </div>
        )}
      </div>
    </div>
  );
}
