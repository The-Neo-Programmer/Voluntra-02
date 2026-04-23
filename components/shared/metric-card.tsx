import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  highlightClass?: string;
}

export function MetricCard({ title, value, icon, trend, highlightClass }: MetricCardProps) {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-start mb-2">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      
      <div className="flex items-baseline gap-3 mt-2">
        <p className={cn("text-3xl font-bold text-gray-900", highlightClass)}>{value}</p>
        
        {trend && (
          <p className={cn("text-sm font-medium", trend.isPositive ? "text-green-600" : "text-red-600")}>
            {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
          </p>
        )}
      </div>
    </div>
  );
}
