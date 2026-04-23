import { CheckCircle2, Shield, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface EntityAvatarProps {
  name: string;
  verificationLevel?: "Unverified" | "Basic" | "Verified" | "Trusted";
  size?: "sm" | "md" | "lg";
}

export function EntityAvatar({ name, verificationLevel, size = "md" }: EntityAvatarProps) {
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base"
  };

  const badgeSize = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };

  return (
    <div className="relative inline-block">
      <div className={cn("rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold", sizeClasses[size])}>
        {initials}
      </div>
      
      {verificationLevel === "Trusted" && (
        <ShieldCheck className={cn("absolute -bottom-1 -right-1 text-green-600 bg-white rounded-full", badgeSize[size])} />
      )}
      {verificationLevel === "Verified" && (
        <CheckCircle2 className={cn("absolute -bottom-1 -right-1 text-blue-500 bg-white rounded-full", badgeSize[size])} />
      )}
      {verificationLevel === "Basic" && (
        <Shield className={cn("absolute -bottom-1 -right-1 text-gray-400 bg-white rounded-full", badgeSize[size])} />
      )}
    </div>
  );
}
