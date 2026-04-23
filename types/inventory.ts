import { Zone } from "./common";

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  lowStockThreshold: number;
  zone: Zone | "Central Warehouse";
  lastUpdated?: string;
  sourceOrg?: string;
}

export interface ShortageReport {
  id: string;
  requestId: string;
  volunteerId: string;
  itemName: string;
  quantityNeeded: number;
  severity?: "Low" | "Medium" | "High" | "Critical";
  description?: string;
  zone?: Zone;
  reportedBy?: string;
  status: "Open" | "Acknowledged" | "Claimed" | "Resolved";
  createdAt: string;
  claimedByPartnerId?: string;
}
