import { NeedRequest } from "@/types/request";
import { seedRequestsV3 } from "@/data/seed-requests";

// In V1, this uses seed data and mock logic.
// In V2, this will connect to the database.

class RequestsService {
  private requests: NeedRequest[] = [...seedRequestsV3];

  async getRequests(): Promise<NeedRequest[]> {
    return this.requests;
  }

  async getRequestById(id: string): Promise<NeedRequest | undefined> {
    return this.requests.find(r => r.id === id);
  }

  async createRequest(data: Omit<NeedRequest, "id" | "createdAt" | "priorityScore" | "status">): Promise<NeedRequest> {
    const newRequest: NeedRequest = {
      ...data,
      id: `REQ-${String(this.requests.length + 1).padStart(3, '0')}`,
      status: "New",
      priorityScore: 50, // Mock score for V1
      createdAt: new Date().toISOString()
    };
    
    this.requests.push(newRequest);
    return newRequest;
  }
}

export const requestsService = new RequestsService();
