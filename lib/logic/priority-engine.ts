import { NeedRequest, PriorityFactors } from "@/types/request";

const urgencyWeights = {
  "Critical": 40,
  "High": 30,
  "Medium": 15,
  "Low": 5
};

const categoryWeights: Record<string, number> = {
  "Medical aid": 20,
  "Food support": 15,
  "Shelter support": 15,
  "Transport/logistics": 10,
  "Women's safety support": 15,
  "Elder care": 10,
  "Sanitation/hygiene": 10,
  "Education support": 5,
  "Documentation/admin help": 2
};

export function calculatePriorityScore(request: NeedRequest): PriorityFactors {
  const urgencyScore = urgencyWeights[request.urgencyLevel] || 0;
  
  // People affected score (cap at 20)
  const peopleScore = Math.min(20, Math.floor(request.peopleAffected / 5));
  
  // Vulnerability score (5 points per tag, cap at 20)
  const vulnerabilityScore = Math.min(20, request.vulnerabilityTags.length * 5);
  
  // Category score
  const categoryScore = categoryWeights[request.category] || 5;
  
  // Age score (older = higher priority, up to 10 points based on hours)
  const hoursOld = (new Date().getTime() - new Date(request.createdAt).getTime()) / (1000 * 60 * 60);
  const ageScore = Math.min(10, Math.floor(hoursOld / 4));
  
  // Compute total (out of 100 approx)
  const totalScore = Math.min(100, urgencyScore + peopleScore + vulnerabilityScore + categoryScore + ageScore);
  
  let riskTier: "High Risk" | "Medium Risk" | "Low Risk" = "Low Risk";
  if (totalScore >= 75) riskTier = "High Risk";
  else if (totalScore >= 50) riskTier = "Medium Risk";
  
  let explanation = `Scored ${totalScore}/100. `;
  if (urgencyScore >= 30) explanation += `Critical urgency (+${urgencyScore}). `;
  if (vulnerabilityScore > 0) explanation += `Vulnerable groups identified (+${vulnerabilityScore}). `;
  if (ageScore >= 5) explanation += `Pending for ${Math.floor(hoursOld)}h (+${ageScore}). `;
  
  return {
    urgencyScore,
    peopleScore,
    vulnerabilityScore,
    categoryScore,
    ageScore,
    totalScore,
    riskTier,
    explanation: explanation.trim()
  };
}

export function enhanceRequestsWithPriority(requests: NeedRequest[]): NeedRequest[] {
  return requests.map(req => {
    if (req.priorityFactors) return req;
    const factors = calculatePriorityScore(req);
    return {
      ...req,
      priorityFactors: factors,
      priorityScore: factors.totalScore
    };
  }).sort((a, b) => b.priorityScore - a.priorityScore);
}
