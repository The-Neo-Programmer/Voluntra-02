"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store/app-store";
import { StatusChip, UrgencyChip } from "@/components/shared/status-chip";
import { notFound, useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Package, AlertTriangle, Users, CheckCircle2, XCircle, Navigation } from "lucide-react";

export default function VolunteerTaskDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { requests, updateRequestStatus, reportShortage, currentUser, logActivity } = useAppStore();

  const [showShortageForm, setShowShortageForm] = useState(false);
  const [showCompleteForm, setShowCompleteForm] = useState(false);
  const [shortageItem, setShortageItem] = useState("");
  const [shortageQty, setShortageQty] = useState("1");
  const [beneficiariesServed, setBeneficiariesServed] = useState("");
  const [completionNote, setCompletionNote] = useState("");
  const [checkInTime, setCheckInTime] = useState<string | null>(null);

  const task = requests.find(r => r.id === params.id);
  if (!task) return notFound();

  const handleAccept = () => updateRequestStatus(task.id, "Accepted");

  const handleDecline = () => {
    updateRequestStatus(task.id, "New");
    router.push("/volunteer/dashboard");
  };

  const handleCheckIn = () => {
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setCheckInTime(now);
    updateRequestStatus(task.id, "In Progress");
  };

  const handleBackupRequest = () => {
    logActivity({
      id: `ACT-${Date.now()}`,
      type: "Status_Changed",
      message: `🚨 BACKUP REQUESTED: ${task.title} at ${task.zone}`,
      timestamp: new Date().toISOString(),
      relatedEntityId: task.id,
      actorName: currentUser?.name || "Volunteer"
    });
    alert("Backup request broadcasted to the Command Center!");
  };

  const handleSubmitShortage = () => {
    if (!shortageItem.trim()) return;
    reportShortage({
      id: `SHRT-${Date.now()}`,
      requestId: task.id,
      volunteerId: currentUser?.id || "",
      itemName: shortageItem,
      quantityNeeded: parseInt(shortageQty) || 1,
      status: "Open",
      createdAt: new Date().toISOString(),
    });
    setShowShortageForm(false);
    setShortageItem("");
    setShortageQty("1");
  };

  const handleComplete = () => {
    updateRequestStatus(task.id, "Completed");
    router.push("/volunteer/dashboard");
  };

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen flex flex-col pb-36">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="font-semibold text-gray-900 flex-1">Task Detail</h1>
        <StatusChip status={task.status} />
      </header>

      <div className="p-4 space-y-4">
        {/* Status / Urgency */}
        <div className="flex items-center gap-2 flex-wrap">
          <UrgencyChip level={task.urgencyLevel} />
          {checkInTime && (
            <span className="text-xs bg-green-100 text-green-700 border border-green-200 rounded-full px-2.5 py-1 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Checked in at {checkInTime}
            </span>
          )}
        </div>

        {/* Title & Desc */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{task.title}</h2>
          <p className="text-gray-600 text-sm leading-relaxed bg-white p-4 rounded-xl border border-gray-200">
            {task.description}
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-3 rounded-xl border border-gray-200">
            <MapPin className="w-5 h-5 text-blue-500 mb-1" />
            <p className="text-xs text-gray-500 font-medium">Location</p>
            <p className="text-sm font-semibold text-gray-900 truncate">{task.zone}</p>
            <p className="text-xs text-gray-400 mt-0.5 truncate">{task.address}</p>
          </div>
          <div className="bg-white p-3 rounded-xl border border-gray-200">
            <Users className="w-5 h-5 text-purple-500 mb-1" />
            <p className="text-xs text-gray-500 font-medium">People Affected</p>
            <p className="text-sm font-semibold text-gray-900">{task.peopleAffected}</p>
          </div>
        </div>

        {/* Resources */}
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-gray-400" /> Resources Needed
          </h3>
          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
            {task.requestedResources || "No resources listed for this task."}
          </p>
        </div>

        {/* Vulnerability Tags */}
        {(task.vulnerabilityTags?.length ?? 0) > 0 && (
          <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
            <p className="text-xs font-bold text-orange-700 uppercase tracking-wide mb-2">Vulnerable Groups</p>
            <div className="flex flex-wrap gap-2">
              {task.vulnerabilityTags?.map(tag => (
                <span key={tag} className="bg-orange-100 text-orange-800 text-xs px-2.5 py-1 rounded-full font-medium border border-orange-200">{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* Inline Shortage Form */}
        {showShortageForm && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-red-800 flex items-center gap-2 text-sm">
                <AlertTriangle className="w-4 h-4" /> Report Field Shortage
              </h3>
              <button onClick={() => setShowShortageForm(false)} className="text-red-400 hover:text-red-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <input
              type="text"
              placeholder="Item name (e.g. Medicine Packs)"
              value={shortageItem}
              onChange={e => setShortageItem(e.target.value)}
              className="w-full border border-red-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
            />
            <input
              type="number"
              placeholder="Quantity missing"
              min="1"
              value={shortageQty}
              onChange={e => setShortageQty(e.target.value)}
              className="w-full border border-red-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
            />
            <button
              onClick={handleSubmitShortage}
              disabled={!shortageItem.trim()}
              className="w-full bg-red-600 text-white py-2.5 rounded-lg font-bold text-sm disabled:opacity-50 active:scale-95 transition-transform"
            >
              Submit Shortage Report
            </button>
          </div>
        )}

        {/* Inline Complete Form */}
        {showCompleteForm && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-green-800 flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4" /> Complete Task
              </h3>
              <button onClick={() => setShowCompleteForm(false)} className="text-green-400 hover:text-green-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <input
              type="number"
              placeholder="Beneficiaries served (optional)"
              min="0"
              value={beneficiariesServed}
              onChange={e => setBeneficiariesServed(e.target.value)}
              className="w-full border border-green-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"
            />
            <textarea
              placeholder="Completion notes (optional)"
              rows={2}
              value={completionNote}
              onChange={e => setCompletionNote(e.target.value)}
              className="w-full border border-green-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 bg-white resize-none"
            />
            <button
              onClick={handleComplete}
              className="w-full bg-green-600 text-white py-2.5 rounded-lg font-bold text-sm active:scale-95 transition-transform"
            >
              Confirm Completion
            </button>
          </div>
        )}
      </div>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.07)]">
        
        {/* Assigned: Accept or Decline */}
        {task.status === "Assigned" && (
          <div className="flex gap-3">
            <button
              onClick={handleDecline}
              className="flex-1 border border-gray-300 text-gray-700 py-3.5 rounded-xl font-bold text-sm active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              <XCircle className="w-4 h-4" /> Decline
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 bg-primary text-white py-3.5 rounded-xl font-bold text-sm shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Accept Task
            </button>
          </div>
        )}

        {/* Accepted: Check In (I Have Arrived) */}
        {task.status === "Accepted" && (
          <button
            onClick={handleCheckIn}
            className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            <Navigation className="w-4 h-4" /> I Have Arrived — Check In
          </button>
        )}

        {/* In Progress: Report Shortage + Complete */}
        {task.status === "In Progress" && !showShortageForm && !showCompleteForm && (
          <div className="flex gap-3">
            <button
              onClick={() => setShowShortageForm(true)}
              className="px-4 bg-orange-100 text-orange-700 border border-orange-200 py-3.5 rounded-xl font-bold text-sm active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" /> Shortage
            </button>
            <button
              onClick={() => setShowCompleteForm(true)}
              className="flex-1 bg-green-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Mark Complete
            </button>
          </div>
        )}
        {/* Global Action: Request Backup (Available if not completed/declined) */}
        {(task.status === "Accepted" || task.status === "In Progress") && (
          <button
            onClick={handleBackupRequest}
            className="w-full mt-3 bg-red-50 text-red-700 border border-red-200 py-3.5 rounded-xl font-bold text-sm active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" /> Request Emergency Backup
          </button>
        )}

        {/* Terminal states */}
        {(task.status === "Completed" || task.status === "Escalated" || task.status === "Blocked" || task.status === "Declined") && (
          <button
            disabled
            className="w-full bg-gray-100 text-gray-400 py-3.5 rounded-xl font-bold text-sm cursor-not-allowed uppercase tracking-wider"
          >
            Task {task.status}
          </button>
        )}
      </div>
    </div>
  );
}
