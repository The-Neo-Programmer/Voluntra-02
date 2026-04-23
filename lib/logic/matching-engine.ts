import { NeedRequest } from "@/types/request";
import { User } from "@/types/user";

export interface MatchResult {
  volunteer: User;
  matchScore: number;
  matchReasons: string[];
}

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return R * c; // Distance in km
}

export function matchVolunteersToRequest(request: NeedRequest, volunteers: User[]): MatchResult[] {
  const matches = volunteers.map(vol => {
    let score = 0;
    const reasons: string[] = [];

    // 1. Geo-Context Proximity Match (Replaces text-based zone match)
    if (request.coordinates && vol.lat && vol.lng) {
      const distanceKm = getDistanceFromLatLonInKm(
        request.coordinates.lat, request.coordinates.lng,
        vol.lat, vol.lng
      );

      if (distanceKm <= 5) {
        score += 35;
        reasons.push(`Very close (${distanceKm.toFixed(1)}km away)`);
      } else if (distanceKm <= (vol.maxTravelKm || 15)) {
        score += 20;
        reasons.push(`Within travel range (${distanceKm.toFixed(1)}km away)`);
      } else {
        score -= 20;
        reasons.push(`Outside preferred travel range (${distanceKm.toFixed(1)}km away)`);
      }
    } else if (vol.preferredZones?.includes(request.zone)) {
      // Fallback to text zone if coordinates missing
      score += 15;
      reasons.push("In preferred zone (Fallback)");
    }

    // 2. Skill Match (40 points max)
    const categoryToSkills: Record<string, string[]> = {
      "Medical aid": ["Medical", "Nursing", "First Aid", "Triage", "Elder Care"],
      "Food support": ["Logistics", "Heavy Lifting", "Driving"],
      "Transport/logistics": ["Driving", "Logistics"],
      "Shelter support": ["Construction", "Electrical", "Logistics"],
      "Elder care": ["Elder Care", "Medical", "Counseling"],
      "Women's safety support": ["Counseling", "Translation"],
      "Education support": ["Childcare", "Translation"]
    };

    const neededSkills = categoryToSkills[request.category] || [];
    const matchedSkills = vol.skills?.filter(s => neededSkills.includes(s)) || [];
    
    if (matchedSkills.length > 0) {
      score += Math.min(40, matchedSkills.length * 20);
      reasons.push(`Skills match: ${matchedSkills.join(", ")}`);
    } else if (neededSkills.length > 0) {
      // STRICT FILTER: If the task requires specific skills and they have none, heavily penalize
      score -= 50;
      reasons.push(`Missing critical skills for ${request.category}`);
    }

    // 3. Workload penalty (Max -20)
    const workload = vol.currentWorkload || 0;
    if (workload > 0) {
      score -= Math.min(20, workload * 10);
      reasons.push(`Has ${workload} active tasks`);
    } else {
      score += 10;
      reasons.push("Available now");
    }

    // 4. Reliability/Verification (20 points)
    if (vol.verificationLevel === "Trusted") {
      score += 20;
      reasons.push("Trusted status");
    } else if (vol.verificationLevel === "Verified") {
      score += 10;
    }
    
    if (vol.reliabilityScore && vol.reliabilityScore >= 90) {
      score += 10;
    }

    return {
      volunteer: vol,
      matchScore: Math.min(100, Math.max(0, score)),
      matchReasons: reasons
    };
  });

  // Sort by score descending and return top matches
  return matches.sort((a, b) => b.matchScore - a.matchScore);
}
