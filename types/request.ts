import { RequestCategory, RequestStatus, UrgencyLevel, Zone } from "./common";

export interface PriorityFactors {
  urgencyScore: number;
  peopleScore: number;
  vulnerabilityScore: number;
  categoryScore: number;
  ageScore: number;
  totalScore: number;
  riskTier: "Critical" | "High Risk" | "Medium Risk" | "Low Risk";
  explanation: string;
}

export interface NeedRequest {
  id: string;
  title: string;
  description: string;
  category: RequestCategory;
  urgencyLevel: UrgencyLevel;
  peopleAffected: number;
  vulnerabilityTags: string[];
  requestedResources: string;
  address: string;
  zone: Zone;
  sourceType: string;
  status: RequestStatus;
  coordinates?: { lat: number; lng: number };
  
  priorityFactors?: PriorityFactors;
  priorityScore: number; 
  createdAt: string;
  updatedAt: string;
  assignedVolunteerId?: string;
  reporterName?: string;
  reporterContact?: string;
  
  // V3 Additions
  dueBy?: string;
  confidenceScore?: number; // AI intake confidence
  duplicateWarning?: boolean; // Flag if similar requests exist
  
  // V4 Additions
  startedAt?: string;
  completedAt?: string;
  fieldNotes?: string;
  proofCountServed?: number;
  escalationFlag?: boolean;
}
