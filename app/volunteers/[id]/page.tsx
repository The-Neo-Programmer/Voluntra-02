"use client";

import { useAppStore } from "@/lib/store/app-store";
import { useParams, useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Phone, Mail, Car, ShieldCheck, ShieldAlert, Star, Briefcase, Languages, Zap } from "lucide-react";
import { EntityAvatar } from "@/components/shared/entity-avatar";
import { StatusChip } from "@/components/shared/status-chip";
import Link from "next/link";

export default function VolunteerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { volunteers, requests } = useAppStore();

  const volunteer = volunteers.find(v => v.id === params.id);
  if (!volunteer) return notFound();

  const assignedTasks = requests.filter(r => r.assignedVolunteerId === volunteer.id);
  const activeTasks = assignedTasks.filter(r => r.status === "Assigned" || r.status === "In Progress");
  const completedTasks = assignedTasks.filter(r => r.status === "Completed");

  const trustColor = volunteer.trustStatus === "High" ? "text-green-600 bg-green-50 border-green-200"
    : volunteer.trustStatus === "Low" ? "text-red-600 bg-red-50 border-red-200"
    : "text-amber-600 bg-amber-50 border-amber-200";

  const availColor = volunteer.availabilityStatus === "Available" ? "bg-green-500"
    : volunteer.availabilityStatus === "Busy" ? "bg-orange-500" : "bg-gray-400";

  return (
    <div>
      {/* Back nav */}
      <div className="mb-6">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Volunteers
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Profile Card */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
            <div className="flex justify-center mb-4">
              <EntityAvatar size="lg" name={volunteer.name} verificationLevel={volunteer.verificationLevel} />
            </div>
            <h1 className="text-xl font-bold text-gray-900">{volunteer.name}</h1>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className={`w-2 h-2 rounded-full ${availColor}`} />
              <span className="text-sm text-gray-500">{volunteer.availabilityStatus}</span>
            </div>

            <div className="mt-4 flex justify-center">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${trustColor} flex items-center gap-1`}>
                {volunteer.trustStatus === "High" ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                Trust: {volunteer.trustStatus}
              </span>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-lg font-bold text-gray-900">{volunteer.reliabilityScore}%</p>
                <p className="text-xs text-gray-500">Reliability</p>
              </div>
              <div className="border-x border-gray-100">
                <p className="text-lg font-bold text-gray-900">{completedTasks.length}</p>
                <p className="text-xs text-gray-500">Completed</p>
              </div>
              <div>
                <p className="text-lg font-bold text-orange-500">{volunteer.currentWorkload}</p>
                <p className="text-xs text-gray-500">Active</p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Contact</h3>
            {volunteer.email && (
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="truncate">{volunteer.email}</span>
              </div>
            )}
            {volunteer.phone && (
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                <span>{volunteer.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <Car className="w-4 h-4 text-gray-400 shrink-0" />
              <span>{volunteer.transportMode} • Max {volunteer.maxTravelKm}km</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
              <span>{volunteer.preferredZones?.join(", ")}</span>
            </div>
          </div>
        </div>

        {/* Right Details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Skills */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-gray-400" /> Skills & Certifications
            </h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {volunteer.skills?.map(skill => (
                <span key={skill} className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-3 py-1 rounded-full font-medium">{skill}</span>
              ))}
            </div>
            {(volunteer.certifications?.length ?? 0) > 0 && (
              <div className="flex flex-wrap gap-2">
                {volunteer.certifications?.map(cert => (
                  <span key={cert} className="bg-green-50 text-green-700 border border-green-200 text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
                    <Star className="w-3 h-3" />{cert}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Languages */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
              <Languages className="w-4 h-4 text-gray-400" /> Languages
            </h3>
            <div className="flex flex-wrap gap-2">
              {volunteer.languages?.map(lang => (
                <span key={lang} className="bg-purple-50 text-purple-700 border border-purple-200 text-xs px-3 py-1 rounded-full font-medium">{lang}</span>
              ))}
            </div>
          </div>

          {/* Preferred Causes */}
          {(volunteer.preferredCauses?.length ?? 0) > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-gray-400" /> Preferred Causes
              </h3>
              <div className="flex flex-wrap gap-2">
                {volunteer.preferredCauses?.map(cause => (
                  <span key={cause} className="bg-amber-50 text-amber-700 border border-amber-200 text-xs px-3 py-1 rounded-full font-medium">{cause}</span>
                ))}
              </div>
            </div>
          )}

          {/* Active Tasks */}
          {activeTasks.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">Active Assignments ({activeTasks.length})</h3>
              <div className="space-y-2">
                {activeTasks.map(task => (
                  <Link key={task.id} href={`/requests/${task.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{task.title}</p>
                      <p className="text-xs text-gray-500">{task.zone} • {task.category}</p>
                    </div>
                    <StatusChip status={task.status} />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">Completed Tasks ({completedTasks.length})</h3>
              <div className="space-y-2">
                {completedTasks.slice(0, 5).map(task => (
                  <Link key={task.id} href={`/requests/${task.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-700">{task.title}</p>
                      <p className="text-xs text-gray-400">{task.zone}</p>
                    </div>
                    <StatusChip status="Completed" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
