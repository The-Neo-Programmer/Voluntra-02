"use client";

import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store/app-store";
import { ShieldAlert, User } from "lucide-react";
import { seedAdmin, seedVolunteers } from "@/data/seed-users";

export default function AuthPage() {
  const router = useRouter();
  const { setCurrentUser } = useAppStore();

  const handleLogin = (role: "admin" | "volunteer") => {
    if (role === "admin") {
      setCurrentUser(seedAdmin);
      router.push("/dashboard");
    } else {
      // Login as Sarah (VOL-001) for the demo
      setCurrentUser(seedVolunteers[0]);
      router.push("/volunteer/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-primary px-6 py-10 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <span className="text-2xl font-bold text-white">VL</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Voluntra</h1>
          <p className="text-primary-soft mt-2 text-sm">Demo Environment Selection</p>
        </div>
        
        <div className="p-6 space-y-4">
          <button 
            onClick={() => handleLogin("admin")}
            className="w-full flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left group"
          >
            <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center mr-4 group-hover:bg-primary group-hover:text-white transition-colors">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Admin Coordinator</h3>
              <p className="text-sm text-gray-500">Access full operations dashboard</p>
            </div>
          </button>
          
          <button 
            onClick={() => handleLogin("volunteer")}
            className="w-full flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left group"
          >
            <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mr-4 group-hover:bg-primary group-hover:text-white transition-colors">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Field Volunteer</h3>
              <p className="text-sm text-gray-500">Access mobile task interface (Sarah)</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
