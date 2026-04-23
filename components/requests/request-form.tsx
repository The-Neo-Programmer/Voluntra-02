"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RequestCategory, UrgencyLevel } from "@/types/common";

const categories: RequestCategory[] = [
  "Food support", "Medical aid", "Shelter support", "Transport/logistics", 
  "Elder care", "Women's safety support", "Education support", 
  "Sanitation/hygiene", "Documentation/admin help"
];

const urgencyLevels: UrgencyLevel[] = ["Critical", "High", "Medium", "Low"];

const vulnerabilityOptions = ["Elderly", "Children", "Disabled", "Women", "Medical Condition", "Displaced"];

export default function RequestForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    category: "Food support" as RequestCategory,
    description: "",
    urgencyLevel: "Medium" as UrgencyLevel,
    peopleAffected: 1,
    vulnerabilityTags: [] as string[],
    requestedResources: "",
    address: "",
    zone: "Central Zone",
    sourceType: "Manual Entry"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For V1, we'll just redirect to the requests list to simulate creation
    router.push("/requests");
  };

  const handleVulnerabilityToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      vulnerabilityTags: prev.vulnerabilityTags.includes(tag)
        ? prev.vulnerabilityTags.filter(t => t !== tag)
        : [...prev.vulnerabilityTags, tag]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 md:p-8 space-y-8">
        
        {/* Section 1: Basic Info */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Request Title</label>
              <input 
                required
                type="text" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="Brief summary of the need..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value as RequestCategory})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source Type</label>
              <select 
                value={formData.sourceType}
                onChange={e => setFormData({...formData, sourceType: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              >
                <option>Manual Entry</option>
                <option>Paper Survey</option>
                <option>Field Report</option>
                <option>Partner NGO</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Details & Vulnerability */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Details & Vulnerability</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                required
                rows={3}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="Provide detailed information about the situation..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">People Affected</label>
              <input 
                type="number"
                min="1"
                value={formData.peopleAffected}
                onChange={e => setFormData({...formData, peopleAffected: parseInt(e.target.value) || 1})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Urgency Level</label>
              <select 
                value={formData.urgencyLevel}
                onChange={e => setFormData({...formData, urgencyLevel: e.target.value as UrgencyLevel})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              >
                {urgencyLevels.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Vulnerable Groups</label>
              <div className="flex flex-wrap gap-2">
                {vulnerabilityOptions.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleVulnerabilityToggle(tag)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                      formData.vulnerabilityTags.includes(tag) 
                        ? "bg-primary-soft text-primary-hover border-primary-soft" 
                        : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Location & Resources */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Location & Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Zone</label>
              <select 
                value={formData.zone}
                onChange={e => setFormData({...formData, zone: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              >
                <option>North Zone</option>
                <option>South Zone</option>
                <option>East Zone</option>
                <option>West Zone</option>
                <option>Central Zone</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input 
                type="text" 
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="Specific location..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Requested Resources</label>
              <input 
                type="text" 
                value={formData.requestedResources}
                onChange={e => setFormData({...formData, requestedResources: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="e.g. 50 Water bottles, 2 Medical Kits..."
              />
            </div>
          </div>
        </div>

      </div>

      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
        <button 
          type="button" 
          onClick={() => router.back()}
          className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button 
          type="submit"
          className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors shadow-sm"
        >
          Save Request
        </button>
      </div>
    </form>
  );
}
