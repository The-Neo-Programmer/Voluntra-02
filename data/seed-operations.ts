import { InventoryItem, ShortageReport } from "../types/inventory";
import { ActivityLog, PartnerNGO } from "../types/common";

const now = new Date();
const h = (hours: number) => new Date(now.getTime() - hours * 60 * 60 * 1000).toISOString();

export const seedInventory: InventoryItem[] = [
  { id: "INV-001", name: "Baby Formula (Stage 1)", category: "Food", stock: 0, unit: "boxes", lowStockThreshold: 20, zone: "South Zone", lastUpdated: h(4) },
  { id: "INV-002", name: "Standard First Aid Kits", category: "Medical", stock: 145, unit: "kits", lowStockThreshold: 50, zone: "Central Warehouse", lastUpdated: h(12) },
  { id: "INV-003", name: "Bottled Water (1L)", category: "Food", stock: 50, unit: "bottles", lowStockThreshold: 100, zone: "East Zone", lastUpdated: h(8) },
  { id: "INV-004", name: "Emergency Blankets", category: "Shelter", stock: 12, unit: "units", lowStockThreshold: 30, zone: "North Zone", lastUpdated: h(6) },
  { id: "INV-005", name: "Insulin Vials (Rapid-Acting)", category: "Medical", stock: 8, unit: "vials", lowStockThreshold: 15, zone: "North Zone", lastUpdated: h(2) },
  { id: "INV-006", name: "Hygiene Kits (Adult)", category: "Hygiene", stock: 220, unit: "kits", lowStockThreshold: 50, zone: "Central Warehouse", lastUpdated: h(24) },
  { id: "INV-007", name: "Hot Meal Packs (Ready to Eat)", category: "Food", stock: 380, unit: "packs", lowStockThreshold: 100, zone: "Central Warehouse", lastUpdated: h(3) },
  { id: "INV-008", name: "Metformin 500mg", category: "Medical", stock: 0, unit: "strips", lowStockThreshold: 10, zone: "North Zone", lastUpdated: h(2) },
  { id: "INV-009", name: "Tarpaulin Sheets (Large)", category: "Shelter", stock: 4, unit: "sheets", lowStockThreshold: 10, zone: "Central Warehouse", lastUpdated: h(1) },
  { id: "INV-010", name: "Volunteer Transport Slots (Car)", category: "Transport", stock: 3, unit: "slots", lowStockThreshold: 2, zone: "West Zone", lastUpdated: h(6) },
  { id: "INV-011", name: "Stationery Kit (Children)", category: "Education", stock: 60, unit: "kits", lowStockThreshold: 30, zone: "East Zone", lastUpdated: h(36) },
  { id: "INV-012", name: "Sanitary Pads (Pack of 10)", category: "Hygiene", stock: 85, unit: "packs", lowStockThreshold: 40, zone: "South Zone", lastUpdated: h(12) },
  { id: "INV-013", name: "Wheelchair (Foldable)", category: "Medical", stock: 2, unit: "units", lowStockThreshold: 1, zone: "Central Warehouse", lastUpdated: h(48) },
  { id: "INV-014", name: "Portable Water Filter", category: "Hygiene", stock: 15, unit: "units", lowStockThreshold: 5, zone: "East Zone", lastUpdated: h(10) },
  { id: "INV-015", name: "Mosquito Nets", category: "Shelter", stock: 110, unit: "nets", lowStockThreshold: 20, zone: "South Zone", lastUpdated: h(24) },
];

export const seedShortages: ShortageReport[] = [
  {
    id: "SHRT-001",
    requestId: "REQ-004",
    volunteerId: "VOL-001",
    itemName: "Baby Formula (Stage 1)",
    quantityNeeded: 20,
    severity: "Critical",
    description: "Infants at South Camp with no formula. Mothers unable to breastfeed.",
    zone: "South Zone",
    status: "Open",
    createdAt: h(4)
  },
  {
    id: "SHRT-002",
    requestId: "REQ-001",
    volunteerId: "VOL-003",
    itemName: "Insulin Vials",
    quantityNeeded: 10,
    severity: "Critical",
    description: "Diabetic elderly residents without insulin for 6+ hours.",
    zone: "North Zone",
    status: "Open",
    createdAt: h(2)
  },
  {
    id: "SHRT-003",
    requestId: "REQ-009",
    volunteerId: "VOL-004",
    itemName: "Tarpaulin Sheets",
    quantityNeeded: 2,
    severity: "High",
    description: "Shelter roof torn. Rain forecast in 4 hours.",
    zone: "North Zone",
    status: "Acknowledged",
    createdAt: h(1)
  },
  {
    id: "SHRT-004",
    requestId: "REQ-003",
    volunteerId: "VOL-002",
    itemName: "Vehicle / Transport Slot",
    quantityNeeded: 1,
    severity: "High",
    description: "No transport available for clinic run. Pregnant women waiting.",
    zone: "West Zone",
    status: "Claimed",
    createdAt: h(6),
    claimedByPartnerId: "NGO-002"
  },
  {
    id: "SHRT-005",
    requestId: "REQ-016",
    volunteerId: "VOL-005",
    itemName: "Metformin 500mg",
    quantityNeeded: 30,
    severity: "Critical",
    description: "Diabetic patients out of medication. Medical emergency risk.",
    zone: "North Zone",
    status: "Open",
    createdAt: h(1.5)
  },
  {
    id: "SHRT-006",
    requestId: "REQ-008",
    volunteerId: "VOL-006",
    itemName: "Hygiene Kits",
    quantityNeeded: 80,
    severity: "Medium",
    description: "Partial hygiene kit shortage at central school. 80 children still waiting.",
    zone: "Central Zone",
    status: "Resolved",
    createdAt: h(18)
  },
];

export const seedPartners: PartnerNGO[] = [
  {
    id: "NGO-001",
    name: "Global Care Initiative",
    focusAreas: ["Medical aid", "Food support"],
    zonesActive: ["North Zone", "South Zone"],
    contactPerson: "Dr. Alistair Webb",
    contactEmail: "a.webb@globalcare.org",
    activeCollaborations: 2
  },
  {
    id: "NGO-002",
    name: "ShelterFirst",
    focusAreas: ["Shelter support", "Transport/logistics"],
    zonesActive: ["East Zone", "West Zone"],
    contactPerson: "Maria Santos",
    contactEmail: "maria@shelterfirst.org",
    activeCollaborations: 1
  },
  {
    id: "NGO-003",
    name: "Prayas Community Foundation",
    focusAreas: ["Education support", "Women's safety support"],
    zonesActive: ["Central Zone", "South Zone"],
    contactPerson: "Rekha Nair",
    contactEmail: "rekha@prayas.org",
    activeCollaborations: 3
  },
  {
    id: "NGO-004",
    name: "Aahar Food Network",
    focusAreas: ["Food support", "Sanitation/hygiene"],
    zonesActive: ["North Zone", "East Zone", "Central Zone"],
    contactPerson: "Suresh Pillai",
    contactEmail: "suresh@aahar.org",
    activeCollaborations: 2
  }
];

export const seedActivities: ActivityLog[] = [
  {
    id: "ACT-001",
    type: "Shortage_Reported",
    message: "Critical: 10x Insulin Vials missing at North Zone elderly home",
    timestamp: h(2),
    relatedEntityId: "REQ-001",
    actorName: "Arun Menon"
  },
  {
    id: "ACT-002",
    type: "Task_Assigned",
    message: "Divya Krishnan assigned to Domestic Violence Counselling",
    timestamp: h(3),
    relatedEntityId: "REQ-006",
    actorName: "Coordinator Priya"
  },
  {
    id: "ACT-003",
    type: "Shortage_Reported",
    message: "Critical: 20x Baby Formula depleted at South Camp",
    timestamp: h(4),
    relatedEntityId: "REQ-004",
    actorName: "Sarah Jenkins"
  },
  {
    id: "ACT-004",
    type: "Status_Changed",
    message: "Road Clearing task moved to In Progress",
    timestamp: h(6),
    relatedEntityId: "REQ-005",
    actorName: "Operations Admin"
  },
  {
    id: "ACT-005",
    type: "Task_Assigned",
    message: "Kiran Patel assigned to South Zone midnight food distribution",
    timestamp: h(7),
    relatedEntityId: "REQ-012",
    actorName: "Coordinator Rajan"
  },
  {
    id: "ACT-006",
    type: "Escalation",
    message: "REQ-013 escalated: Sanitation hazard at North Camp — 300 affected",
    timestamp: h(7.5),
    relatedEntityId: "REQ-013",
    actorName: "System"
  },
  {
    id: "ACT-007",
    type: "Shortage_Resolved",
    message: "Hygiene Kits shortage resolved by volunteer restocking",
    timestamp: h(10),
    relatedEntityId: "SHRT-006",
    actorName: "Meena Sharma"
  },
  {
    id: "ACT-008",
    type: "Status_Changed",
    message: "Night Watch — West Shelter task marked Completed",
    timestamp: h(24),
    relatedEntityId: "REQ-017",
    actorName: "Rohan Gupta"
  },
  {
    id: "ACT-009",
    type: "Request_Created",
    message: "New request: Blanket Distribution — 150 residents, North Zone",
    timestamp: h(9),
    relatedEntityId: "REQ-020",
    actorName: "Field Officer Kavitha"
  },
  {
    id: "ACT-010",
    type: "Task_Assigned",
    message: "Anita Bose assigned to Trauma Response — South Zone",
    timestamp: h(2.5),
    relatedEntityId: "REQ-018",
    actorName: "Coordinator Priya"
  }
];
