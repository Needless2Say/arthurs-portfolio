import { cn } from "@/utils/cn";
import type { BadgeColor } from "@/types/portfolio";

interface TechBadgeProps {
  label: string;
  color?: BadgeColor;
  size?: "sm" | "md";
}

const colorMap: Record<BadgeColor, string> = {
  nebula: "bg-purple-950/60 text-purple-300 border-purple-700/50",
  cosmic: "bg-blue-950/60 text-blue-300 border-blue-700/50",
  stellar: "bg-yellow-950/60 text-yellow-300 border-yellow-700/50",
  green: "bg-emerald-950/60 text-emerald-300 border-emerald-700/50",
  gray: "bg-slate-800/60 text-slate-300 border-slate-600/50",
  default: "bg-slate-800/60 text-slate-300 border-slate-600/50",
};

export default function TechBadge({ label, color = "default", size = "sm" }: TechBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center border rounded-full font-mono font-medium",
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
        colorMap[color]
      )}
    >
      {label}
    </span>
  );
}
