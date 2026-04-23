import { UserRole, Zone } from "./common";

export type VerificationLevel = "Unverified" | "Basic" | "Verified" | "Trusted";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  
  // Volunteer Specific
  skills?: string[];
  languages?: string[];
  certifications?: string[];
  verificationLevel?: VerificationLevel;
  trustStatus?: "High" | "Medium" | "Low";
  reliabilityScore?: number;
  currentWorkload?: number;
  preferredZones?: Zone[];
  
  // V4 additions
  availabilityStatus?: "Available" | "Busy" | "Offline";
  availabilitySlots?: string[];
  lat?: number;
  lng?: number;
  maxTravelKm?: number;
  transportMode?: "Walk" | "Bicycle" | "Car" | "Van";
  preferredCauses?: string[];
  experienceTags?: string[];
}
