"use client";

import PageHeader from "@/components/layout/page-header";
import { MetricCard } from "@/components/shared/metric-card";
import { useAppStore } from "@/lib/store/app-store";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Clock, CheckSquare, Users, AlertTriangle, TrendingUp, Package } from "lucide-react";
import { useMemo } from "react";

export default function AnalyticsPage() {
  const { requests, volunteers, shortages } = useAppStore();

  // Live KPIs from store
  const completedRequests = requests.filter(r => r.status === "Completed");
  const totalRequests = requests.length;
  const completionRate = totalRequests > 0 ? Math.round((completedRequests.length / totalRequests) * 100) : 0;
  const totalBeneficiaries = completedRequests.reduce((sum, r) => sum + (r.peopleAffected || 0), 0);
  const openShortages = shortages.filter(s => s.status === "Open").length;
  const activeTasks = requests.filter(r => r.status === "In Progress" || r.status === "Assigned").length;

  // Category breakdown from live data
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    requests.forEach(r => {
      const cat = r.category?.split("/")[0]?.trim().split(" ")[0] || "Other";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [requests]);

  // Zone demand from live data
  const zoneData = useMemo(() => {
    const counts: Record<string, number> = {};
    requests.filter(r => r.status !== "Completed").forEach(r => {
      if (r.zone) counts[r.zone] = (counts[r.zone] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name: name.replace(" Zone", ""), value }))
      .sort((a, b) => b.value - a.value);
  }, [requests]);

  // Volunteer task count
  const volunteerData = useMemo(() => {
    return volunteers
      .filter(v => (v.currentWorkload || 0) > 0 || v.availabilityStatus === "Available")
      .slice(0, 8)
      .map(v => ({
        name: v.name.split(" ")[0],
        tasks: v.currentWorkload || 0,
        reliability: v.reliabilityScore || 0
      }));
  }, [volunteers]);

  // Status distribution (simulated trend — requests grouped into time buckets)
  const statusTrend = useMemo(() => {
    const slots = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];
    const total = requests.length;
    return slots.map((time, i) => ({
      time,
      active: Math.round(activeTasks * (1 - i * 0.12)),
      completed: Math.min(completedRequests.length, Math.round((completedRequests.length / 5) * (i + 1)))
    }));
  }, [requests, activeTasks, completedRequests.length]);

  return (
    <div>
      <PageHeader title="Analytics & Impact" subtitle="Measure operational efficiency and community impact." />

      {/* KPI Strip — Live Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Task Completion Rate"
          value={`${completionRate}%`}
          icon={<CheckSquare className="w-5 h-5 text-green-500" />}
          trend={{ value: completionRate, isPositive: true }}
        />
        <MetricCard
          title="Beneficiaries Served"
          value={totalBeneficiaries.toLocaleString()}
          icon={<Users className="w-5 h-5 text-purple-500" />}
        />
        <MetricCard
          title="Open Shortages"
          value={openShortages}
          icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
          highlightClass="text-red-600"
        />
        <MetricCard
          title="Active Tasks Now"
          value={activeTasks}
          icon={<TrendingUp className="w-5 h-5 text-blue-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Task Velocity Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6">Task Velocity (Today)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={statusTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="completed" name="Completed" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorCompleted)" />
                <Area type="monotone" dataKey="active" name="Active Tasks" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorActive)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Requests by Category */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6">Requests by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#4b5563', fontWeight: 500 }} width={70} />
                <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                <Bar dataKey="value" name="Requests" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Zone Demand */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6">Active Demand by Zone</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zoneData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                <Bar dataKey="value" name="Active Requests" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Volunteer Load */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6">Volunteer Workload</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volunteerData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                <Bar dataKey="tasks" name="Active Tasks" fill="#0f766e" radius={[4, 4, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
