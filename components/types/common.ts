export type UrgencyLevel = "Critical" | "High" | "Medium" | "Low";

export type RequestStatus = 
  | "New" 
  | "Triaged" 
  | "Recommended"
  | "Assigned"
  | "Accepted"
  | "Declined"
  | "In Progress" 
  | "Completed" 
  | "Escalated"
  | "Blocked";

export type RequestCategory = 
  | "Food support" 
  | "Medical aid" 
  | "Shelter support" 
  | "Transport/logistics" 
  | "Elder care" 
  | "Women's safety support" 
  | "Education support" 
  | "Sanitation/hygiene" 
  | "Documentation/admin help";

export type UserRole = "Admin" | "Coordinator" | "Volunteer" | "Partner";

export type Zone = "North Zone" | "South Zone" | "East Zone" | "West Zone" | "Central Zone";

export interface ActivityLog {
  id: string;
  type: "Request_Created" | "Task_Assigned" | "Status_Changed" | "Shortage_Reported" | "Shortage_Resolved" | "Escalation";
  message: string;
  timestamp: string;
  relatedEntityId?: string; // requestId or shortageId
  actorName: string;
}

export interface PartnerNGO {
  id: string;
  name: string;
  focusAreas: string[];
  zonesActive: Zone[];
  contactPerson: string;
  contactEmail: string;
  activeCollaborations: number;
}
