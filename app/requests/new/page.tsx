"use client";

import PageHeader from "@/components/layout/page-header";
import { useState } from "react";
import { useAppStore } from "@/lib/store/app-store";
import { useRouter } from "next/navigation";
import { Wand2, AlertCircle } from "lucide-react";
import { NeedRequest } from "@/types/request";

export default function NewRequestPage() {
  const router = useRouter();
  const { addRequest } = useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [rawText, setRawText] = useState("");
  
  const [formData, setFormData] = useState<Partial<NeedRequest>>({
    title: "",
    category: "Food support",
    urgencyLevel: "Medium",
    zone: "Central Zone",
    peopleAffected: 0,
    requestedResources: "",
    vulnerabilityTags: [],
    sourceType: "Manual Entry"
  });

  const handleMagicAutofill = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setFormData({
        title: "Trapped Families need Evacuation",
        category: "Transport/logistics",
        urgencyLevel: "Critical",
        zone: "South Zone",
        peopleAffected: 12,
        requestedResources: "2 Boats, Flashlights",
        vulnerabilityTags: ["Children"],
        sourceType: "AI Extraction",
        confidenceScore: 92
      });
      setIsProcessing(false);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq: NeedRequest = {
      ...formData,
      id: `REQ-00${Math.floor(Math.random() * 1000)}`,
      description: rawText || formData.title || "",
      status: "New",
      priorityScore: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      address: "Unspecified"
    } as NeedRequest;
    
    addRequest(newReq);
    router.push("/requests");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="New Need Request" subtitle="Log a request manually or use AI to extract details from a field report." />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div className="bg-primary-soft p-5 rounded-xl border border-primary/20">
            <h3 className="font-bold text-primary flex items-center gap-2 mb-2">
              <Wand2 className="w-5 h-5" /> Smart Intake
            </h3>
            <p className="text-sm text-primary-hover mb-4">
              Paste a messy message or field report below. Our AI will automatically extract and categorize the details.
            </p>
            <textarea 
              className="w-full h-32 p-3 text-sm rounded-lg border border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., '3 families are stuck on the roof of 12 South St. Water is rising fast. They have 2 toddlers. Need a boat ASAP.'"
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
            />
            <button 
              onClick={handleMagicAutofill}
              disabled={isProcessing || !rawText}
              className="w-full mt-3 bg-primary text-white py-2 rounded-lg text-sm font-bold hover:bg-primary-hover disabled:opacity-50 transition-colors"
            >
              {isProcessing ? "Extracting Details..." : "Auto-Fill Fields"}
            </button>
          </div>

          {formData.confidenceScore && (
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-green-500 shrink-0" />
              <div>
                <p className="text-sm font-bold text-gray-900">Extracted Successfully</p>
                <p className="text-xs text-gray-500">Confidence Score: {formData.confidenceScore}%</p>
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">Request Title</label>
              <input 
                required
                type="text" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Category</label>
                <select 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value as any})}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option>Food support</option>
                  <option>Medical aid</option>
                  <option>Shelter support</option>
                  <option>Transport/logistics</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Urgency</label>
                <select 
                  value={formData.urgencyLevel}
                  onChange={e => setFormData({...formData, urgencyLevel: e.target.value as any})}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option>Critical</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Zone</label>
                <select 
                  value={formData.zone}
                  onChange={e => setFormData({...formData, zone: e.target.value as any})}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option>North Zone</option>
                  <option>South Zone</option>
                  <option>East Zone</option>
                  <option>West Zone</option>
                  <option>Central Zone</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">People Affected</label>
                <input 
                  type="number" 
                  value={formData.peopleAffected}
                  onChange={e => setFormData({...formData, peopleAffected: parseInt(e.target.value)})}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">Requested Resources</label>
              <input 
                type="text" 
                value={formData.requestedResources}
                onChange={e => setFormData({...formData, requestedResources: e.target.value})}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" 
              />
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
              <button type="button" onClick={() => router.back()} className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-lg transition-colors">
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
