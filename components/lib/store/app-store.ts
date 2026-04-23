import { create } from 'zustand';
import { NeedRequest } from '@/types/request';
import { User } from '@/types/user';
import { InventoryItem, ShortageReport } from '@/types/inventory';
import { ActivityLog, PartnerNGO } from '@/types/common';
import { Notification } from '@/types/notification';
import { seedRequestsV3 } from '@/data/seed-requests';
import { seedVolunteers, seedAdmin } from '@/data/seed-users';
import { seedInventory, seedShortages, seedPartners, seedActivities } from '@/data/seed-operations';

interface AppState {
  requests: NeedRequest[];
  volunteers: User[];
  inventory: InventoryItem[];
  shortages: ShortageReport[];
  partners: PartnerNGO[];
  activities: ActivityLog[];
  notifications: Notification[];
  currentUser: User | null;
  
  // Actions
  setCurrentUser: (user: User | null) => void;
  updateRequestStatus: (id: string, status: NeedRequest['status']) => void;
  updateRequest: (id: string, fields: Partial<NeedRequest>) => void;
  assignVolunteer: (requestId: string, volunteerId: string) => void;
  addRequest: (request: NeedRequest) => void;
  reportShortage: (shortage: ShortageReport) => void;
  updateShortageStatus: (id: string, status: ShortageReport['status']) => void;
  claimShortage: (shortageId: string, partnerId: string) => void;
  addInventoryItem: (item: InventoryItem) => void;
  logActivity: (activity: ActivityLog) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  requests: seedRequestsV3,
  volunteers: seedVolunteers,
  inventory: seedInventory,
  shortages: seedShortages,
  partners: seedPartners,
  activities: seedActivities,
  notifications: [
    {
      id: "NOT-001",
      userId: "ADM-001",
      type: "Urgent_Request",
      title: "🚨 Critical Request: Shelter Roof Collapse",
      message: "40 residents exposed at North Zone camp. Rain forecast in 4 hours.",
      read: false,
      createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      relatedEntityType: "Request",
      relatedEntityId: "REQ-009"
    },
    {
      id: "NOT-002",
      userId: "ADM-001",
      type: "Shortage_Alert",
      title: "⚠️ Shortage: Insulin Vials Critical",
      message: "10 vials needed at North Zone elderly home. Diabetic patients at risk.",
      read: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      relatedEntityType: "Shortage",
      relatedEntityId: "SHRT-002"
    },
    {
      id: "NOT-003",
      userId: "ADM-001",
      type: "Task_Assigned",
      title: "Anita Bose assigned to Trauma Response",
      message: "South Zone trauma response task assigned to Anita Bose successfully.",
      read: true,
      createdAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
      relatedEntityType: "Request",
      relatedEntityId: "REQ-018"
    },
    {
      id: "NOT-004",
      userId: "ADM-001",
      type: "System_Alert",
      title: "New Partner Claim",
      message: "ShelterFirst has claimed the Vehicle Shortage (SHRT-004) for West Zone.",
      read: true,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      relatedEntityType: "Shortage",
      relatedEntityId: "SHRT-004"
    }
  ],
  currentUser: seedAdmin, // Default to admin for demo
  
  setCurrentUser: (user) => set({ currentUser: user }),
  
  updateRequestStatus: (id, status) => set((state) => {
    const updated = state.requests.map(req => 
      req.id === id ? { ...req, status, updatedAt: new Date().toISOString() } : req
    );
    const reqName = state.requests.find(r => r.id === id)?.title;
    
    // Auto-log status change
    const newActivity: ActivityLog = {
      id: `ACT-${Date.now()}`,
      type: "Status_Changed",
      message: `Task "${reqName}" moved to ${status}`,
      timestamp: new Date().toISOString(),
      relatedEntityId: id,
      actorName: state.currentUser?.name || "System"
    };

    return { requests: updated, activities: [newActivity, ...state.activities] };
  }),
  
  assignVolunteer: (requestId, volunteerId) => set((state) => {
    const req = state.requests.find(r => r.id === requestId);
    const vol = state.volunteers.find(v => v.id === volunteerId);
    
    const requests = state.requests.map(r => 
      r.id === requestId 
        ? { ...r, assignedVolunteerId: volunteerId, status: "Assigned" as const, updatedAt: new Date().toISOString() } 
        : r
    );
    
    const volunteers = state.volunteers.map(v => 
      v.id === volunteerId 
        ? { ...v, currentWorkload: (v.currentWorkload || 0) + 1 } 
        : v
    );

    const newActivity: ActivityLog = {
      id: `ACT-${Date.now()}`,
      type: "Task_Assigned",
      message: `${vol?.name} assigned to "${req?.title}"`,
      timestamp: new Date().toISOString(),
      relatedEntityId: requestId,
      actorName: state.currentUser?.name || "System"
    };

    const newNotification: Notification = {
      id: `NOT-${Date.now()}`,
      userId: state.currentUser?.id || "ADM-001",
      type: "Task_Assigned",
      title: "Volunteer Assigned",
      message: `${vol?.name} was assigned to a task.`,
      read: false,
      createdAt: new Date().toISOString(),
      relatedEntityType: "Task",
      relatedEntityId: requestId
    };
    
    return { 
      requests, 
      volunteers, 
      activities: [newActivity, ...state.activities],
      notifications: [newNotification, ...state.notifications]
    };
  }),
  
  addRequest: (request) => set((state) => {
    const newActivity: ActivityLog = {
      id: `ACT-${Date.now()}`,
      type: "Request_Created",
      message: `New request: ${request.title}`,
      timestamp: new Date().toISOString(),
      relatedEntityId: request.id,
      actorName: state.currentUser?.name || "System"
    };
    const newNotification: Notification = {
      id: `NOT-${Date.now()}`,
      userId: state.currentUser?.id || "ADM-001",
      type: "Urgent_Request",
      title: "New Request Filed",
      message: request.title,
      read: false,
      createdAt: new Date().toISOString(),
      relatedEntityType: "Request",
      relatedEntityId: request.id
    };
    return { 
      requests: [request, ...state.requests],
      activities: [newActivity, ...state.activities],
      notifications: [newNotification, ...state.notifications]
    };
  }),

  reportShortage: (shortage) => set((state) => {
    const newActivity: ActivityLog = {
      id: `ACT-${Date.now()}`,
      type: "Shortage_Reported",
      message: `Critical shortage reported: ${shortage.quantityNeeded}x ${shortage.itemName}`,
      timestamp: new Date().toISOString(),
      relatedEntityId: shortage.requestId,
      actorName: state.currentUser?.name || "System"
    };
    const newNotification: Notification = {
      id: `NOT-${Date.now()}`,
      userId: state.currentUser?.id || "ADM-001",
      type: "Shortage_Alert",
      title: "Critical Shortage Reported",
      message: `${shortage.quantityNeeded}x ${shortage.itemName} missing.`,
      read: false,
      createdAt: new Date().toISOString(),
      relatedEntityType: "Shortage",
      relatedEntityId: shortage.id
    };
    return { 
      shortages: [shortage, ...state.shortages],
      activities: [newActivity, ...state.activities],
      notifications: [newNotification, ...state.notifications]
    };
  }),

  claimShortage: (shortageId, partnerId) => set((state) => {
    const partner = state.partners.find(p => p.id === partnerId);
    const shortages = state.shortages.map(s => 
      s.id === shortageId ? { ...s, status: "Claimed" as const, claimedByPartnerId: partnerId } : s
    );

    const newActivity: ActivityLog = {
      id: `ACT-${Date.now()}`,
      type: "Shortage_Resolved",
      message: `${partner?.name} claimed shortage supply`,
      timestamp: new Date().toISOString(),
      relatedEntityId: shortageId,
      actorName: "System"
    };
    return { shortages, activities: [newActivity, ...state.activities] };
  }),

  logActivity: (activity) => set((state) => ({
    activities: [activity, ...state.activities]
  })),

  updateRequest: (id, fields) => set((state) => ({
    requests: state.requests.map(r => r.id === id ? { ...r, ...fields, updatedAt: new Date().toISOString() } : r)
  })),

  updateShortageStatus: (id, status) => set((state) => {
    const shortage = state.shortages.find(s => s.id === id);
    const newActivity: ActivityLog = {
      id: `ACT-${Date.now()}`,
      type: "Status_Changed",
      message: `Shortage "${shortage?.itemName}" marked as ${status}`,
      timestamp: new Date().toISOString(),
      relatedEntityId: id,
      actorName: state.currentUser?.name || "Admin"
    };
    return {
      shortages: state.shortages.map(s => s.id === id ? { ...s, status } : s),
      activities: [newActivity, ...state.activities]
    };
  }),

  addInventoryItem: (item) => set((state) => ({
    inventory: [item, ...state.inventory]
  })),

  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),

  markAllNotificationsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  }))
}));
