"use client";

import PageHeader from "@/components/layout/page-header";
import { useAppStore } from "@/lib/store/app-store";
import { Briefcase, MapPin, Handshake, CheckCircle2, Mail, Phone, AlertTriangle } from "lucide-react";
import { EntityAvatar } from "@/components/shared/entity-avatar";

export default function PartnersPage() {
  const { partners, shortages, claimShortage } = useAppStore();
  const openShortages = shortages.filter(s => s.status === "Open");

  return (
    <div>
      <PageHeader 
        title="Partner NGO Network" 
        subtitle="Coordinate resources and shortages with allied organizations."
      >
        <div className="flex gap-3 text-sm">
          <span className="bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1.5 rounded-lg font-semibold">{partners.length} Partners</span>
          {openShortages.length > 0 && (
            <span className="bg-orange-50 border border-orange-200 text-orange-700 px-3 py-1.5 rounded-lg font-semibold">{openShortages.length} Open Shortage{openShortages.length > 1 ? 's' : ''}</span>
          )}
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Partner Cards */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Active Partners</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {partners.map(partner => (
              <div key={partner.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:border-primary hover:shadow-md transition-all flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-5 flex items-start gap-4 border-b border-gray-100">
                  <EntityAvatar size="md" name={partner.name} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 leading-tight">{partner.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{partner.contactPerson}</p>
                    <a href={`mailto:${partner.contactEmail}`} className="text-xs text-primary hover:underline mt-0.5 block truncate">
                      {partner.contactEmail}
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-full text-xs font-bold shrink-0">
                    <Handshake className="w-3.5 h-3.5" />
                    {partner.activeCollaborations}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 space-y-3">
                  <div>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase mb-1.5">Focus Areas</p>
                    <div className="flex flex-wrap gap-1.5">
                      {partner.focusAreas.map(area => (
                        <span key={area} className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded font-semibold">{area}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4 text-gray-300 shrink-0" />
                    <span>{partner.zonesActive.join(" • ")}</span>
                  </div>
                </div>

                {/* Action */}
                <div className="px-5 pb-4">
                  <button className="w-full py-2 bg-gray-50 hover:bg-primary hover:text-white text-gray-700 rounded-lg text-sm font-semibold transition-colors border border-gray-200 hover:border-primary">
                    Request Support
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shortage Coordination Panel */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${openShortages.length > 0 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
              {openShortages.length}
            </span>
            Open Shortage Requests
          </h2>
          
          <div className="space-y-4">
            {openShortages.map(shortage => (
              <div key={shortage.id} className="bg-white rounded-xl border border-orange-200 shadow-sm overflow-hidden">
                <div className="bg-orange-50 px-4 py-3 border-b border-orange-100 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate">{shortage.quantityNeeded}x {shortage.itemName}</p>
                    {shortage.severity && (
                      <p className="text-xs text-orange-700 font-medium">Severity: {shortage.severity}</p>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  {shortage.description && (
                    <p className="text-xs text-gray-600 mb-3 italic">"{shortage.description}"</p>
                  )}
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">Claim This Shortage</p>
                  <div className="space-y-1.5">
                    {partners.map(p => (
                      <button
                        key={p.id}
                        onClick={() => claimShortage(shortage.id, p.id)}
                        className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-orange-50 hover:border-orange-300 border border-gray-200 rounded-lg transition-colors group"
                      >
                        <span className="text-sm font-medium text-gray-700 group-hover:text-orange-700 truncate">{p.name}</span>
                        <span className="text-xs text-orange-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">Claim →</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {openShortages.length === 0 && (
              <div className="bg-white p-8 rounded-xl border border-gray-200 text-center shadow-sm">
                <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-3" />
                <p className="text-sm font-semibold text-gray-900">All clear!</p>
                <p className="text-xs text-gray-500 mt-1">No pending shortage requests for partners.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
