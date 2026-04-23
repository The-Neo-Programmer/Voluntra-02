"use client";

import PageHeader from "@/components/layout/page-header";
import RequestList from "@/components/requests/request-list";
import { useAppStore } from "@/lib/store/app-store";
import { enhanceRequestsWithPriority } from "@/lib/logic/priority-engine";
import Link from "next/link";
import { Plus, Search, Filter } from "lucide-react";
import { useState, useMemo } from "react";

const statusFilters = ["All", "New", "Triaged", "Assigned", "In Progress", "Completed", "Escalated"];
const categoryFilters = ["All Categories", "Medical aid", "Food support", "Shelter support", "Transport/logistics", "Elder care", "Women's safety support", "Sanitation/hygiene", "Education support"];

export default function RequestsPage() {
  const { requests } = useAppStore();
  const prioritizedRequests = enhanceRequestsWithPriority(requests);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");

  const filtered = useMemo(() => {
    return prioritizedRequests.filter(r => {
      const matchSearch = !searchQuery ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.zone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.category?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === "All" || r.status === statusFilter;
      const matchCategory = categoryFilter === "All Categories" || r.category === categoryFilter;
      return matchSearch && matchStatus && matchCategory;
    });
  }, [prioritizedRequests, searchQuery, statusFilter, categoryFilter]);

  return (
    <div>
      <PageHeader title="Need Requests" subtitle="Manage and triage incoming community requests.">
        <Link 
          href="/requests/new"
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Request
        </Link>
      </PageHeader>

      {/* Search + Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-4 space-y-3">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by title, zone, or category..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {categoryFilters.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Status Quick Filter Chips */}
        <div className="flex flex-wrap gap-2">
          {statusFilters.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                statusFilter === s
                  ? "bg-primary text-white border-primary"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
            >
              {s}
              {s !== "All" && (
                <span className="ml-1 opacity-70">
                  ({prioritizedRequests.filter(r => r.status === s).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      <RequestList requests={filtered} />

      {filtered.length === 0 && (
        <div className="mt-2 p-8 text-center bg-white rounded-xl border-2 border-dashed border-gray-300">
          <Filter className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-600 font-medium">No requests match your filters.</p>
          <button
            onClick={() => { setSearchQuery(""); setStatusFilter("All"); setCategoryFilter("All Categories"); }}
            className="mt-2 text-sm text-primary hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
