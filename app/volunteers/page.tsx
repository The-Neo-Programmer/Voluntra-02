"use client";

import PageHeader from "@/components/layout/page-header";
import { useAppStore } from "@/lib/store/app-store";
import { Search, ShieldCheck, MapPin, Briefcase, Car, AlertTriangle, Plus } from "lucide-react";
import { EntityAvatar } from "@/components/shared/entity-avatar";
import Link from "next/link";
import { useState, useMemo } from "react";
import { Zone } from "@/types/common";

export default function VolunteersPage() {
  const { volunteers } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [zoneFilter, setZoneFilter] = useState("All");

  const allZones = Array.from(new Set(volunteers.flatMap(v => v.preferredZones || []))).sort();

  const filtered = useMemo(() => {
    return volunteers.filter(v => {
      const matchSearch = !searchQuery || 
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.skills?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        v.preferredZones?.some(z => z.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchStatus = statusFilter === "All" || v.availabilityStatus === statusFilter;
      const matchZone = zoneFilter === "All" || (v.preferredZones as string[])?.includes(zoneFilter);
      return matchSearch && matchStatus && matchZone;
    });
  }, [volunteers, searchQuery, statusFilter, zoneFilter]);

  return (
    <div>
      <PageHeader title="Volunteer Directory" subtitle="Search, manage, and coordinate your field force.">
        <Link
          href="/volunteers/new"
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Volunteer
        </Link>
      </PageHeader>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, skill, or zone..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="All">All Statuses</option>
          <option value="Available">Available</option>
          <option value="Busy">Busy</option>
          <option value="Offline">Offline</option>
        </select>
        <select
          value={zoneFilter}
          onChange={e => setZoneFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="All">All Zones</option>
          {allZones.map(z => <option key={z}>{z}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No volunteers match your search.</p>
          <button onClick={() => { setSearchQuery(""); setStatusFilter("All"); setZoneFilter("All"); }} className="mt-2 text-sm text-primary hover:underline">Clear filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(volunteer => (
            <div key={volunteer.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:border-primary transition-colors group">
              <div className="p-5 border-b border-gray-100 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <EntityAvatar size="md" name={volunteer.name} verificationLevel={volunteer.verificationLevel} />
                  <div>
                    <h3 className="font-bold text-gray-900">{volunteer.name}</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      {volunteer.availabilityStatus === "Available" && <span className="w-2 h-2 rounded-full bg-green-500" />}
                      {volunteer.availabilityStatus === "Busy" && <span className="w-2 h-2 rounded-full bg-orange-500" />}
                      {volunteer.availabilityStatus === "Offline" && <span className="w-2 h-2 rounded-full bg-gray-400" />}
                      <span className="text-xs text-gray-500">{volunteer.availabilityStatus}</span>
                    </div>
                  </div>
                </div>
                {volunteer.trustStatus === "High" && <ShieldCheck className="w-5 h-5 text-green-500 shrink-0" />}
                {volunteer.trustStatus === "Low" && <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />}
              </div>

              <div className="p-5 flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-500 font-semibold mb-1">Workload</p>
                    <p className="font-medium text-gray-900">{volunteer.currentWorkload} Active Task(s)</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold mb-1">Reliability</p>
                    <p className="font-medium text-gray-900">{volunteer.reliabilityScore}%</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 font-semibold mb-1 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Zones</p>
                    <p className="font-medium text-gray-900">{volunteer.preferredZones?.join(", ")}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 font-semibold mb-1 flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> Top Skills</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {volunteer.skills?.slice(0, 3).map(skill => (
                        <span key={skill} className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded font-medium">{skill}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <Car className="w-4 h-4" />
                  <span>{volunteer.transportMode} • Max {volunteer.maxTravelKm}km</span>
                </div>
                <Link
                  href={`/volunteers/${volunteer.id}`}
                  className="text-primary hover:text-primary-hover font-semibold text-sm"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
