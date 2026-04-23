import Link from "next/link";
import { NeedRequest } from "@/types/request";
import { StatusChip, UrgencyChip } from "@/components/shared/status-chip";
import { Users, MapPin, Clock } from "lucide-react";

export default function RequestList({ requests }: { requests: NeedRequest[] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Score</th>
              <th className="px-6 py-4">Title & Category</th>
              <th className="px-6 py-4">Zone</th>
              <th className="px-6 py-4">Affected</th>
              <th className="px-6 py-4">Urgency</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {requests.map((req) => (
              <tr key={req.id} className="hover:bg-gray-50 transition-colors group cursor-pointer">
                <td className="px-6 py-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-900 border border-gray-200">
                    {req.priorityScore}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Link href={`/requests/${req.id}`} className="block">
                    <div className="font-semibold text-gray-900 mb-1">{req.title}</div>
                    <div className="text-gray-500 text-xs flex items-center gap-2">
                      <span>{req.category}</span>
                      <span className="text-gray-300">•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {req.zone}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Users className="w-4 h-4 text-gray-400" />
                    {req.peopleAffected}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <UrgencyChip level={req.urgencyLevel} />
                </td>
                <td className="px-6 py-4">
                  <StatusChip status={req.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {requests.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            No requests found.
          </div>
        )}
      </div>
    </div>
  );
}
