import { cn } from "@/lib/utils";
import { RequestStatus, UrgencyLevel } from "@/types/common";

const statusStyles: Record<RequestStatus, string> = {
  New: "bg-gray-100 text-gray-700 border-gray-200",
  Triaged: "bg-blue-50 text-blue-700 border-blue-200",
  Recommended: "bg-purple-50 text-purple-700 border-purple-200",
  Assigned: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Accepted: "bg-teal-50 text-teal-700 border-teal-200",
  Declined: "bg-gray-100 text-gray-500 border-gray-200",
  "In Progress": "bg-yellow-50 text-yellow-800 border-yellow-200",
  Completed: "bg-green-50 text-green-700 border-green-200",
  Escalated: "bg-red-50 text-red-700 border-red-200",
  Blocked: "bg-orange-50 text-orange-800 border-orange-200",
};


const urgencyStyles: Record<UrgencyLevel, string> = {
  Critical: "bg-red-100 text-red-700 border-red-200",
  High: "bg-orange-100 text-orange-700 border-orange-200",
  Medium: "bg-blue-100 text-blue-700 border-blue-200",
  Low: "bg-gray-100 text-gray-700 border-gray-200",
};

export function StatusChip({ status }: { status: RequestStatus }) {
  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", statusStyles[status])}>
      {status}
    </span>
  );
}

export function UrgencyChip({ level }: { level: UrgencyLevel }) {
  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", urgencyStyles[level])}>
      {level}
    </span>
  );
}
