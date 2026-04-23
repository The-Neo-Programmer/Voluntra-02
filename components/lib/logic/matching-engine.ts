import { NeedRequest } from "@/types/request";
import { User } from "@/types/user";

export interface MatchResult {
  volunteer: User;
  matchScore: number;
  matchReasons: string[];
}

export function matchVolunteersToRequest(request: NeedRequest, volunteers: User[]): MatchResult[] {
  const matches = volunteers.map(vol => {
    let score = 0;
    const reasons: string[] = [];

    // 1. Zone Match (30 points)
    if (vol.preferredZones?.includes(request.zone)) {
      score += 30;
      reasons.push("In preferred zone");
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
