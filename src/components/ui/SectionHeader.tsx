import { cn } from "@/utils/cn";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
}

export default function SectionHeader({
  title,
  subtitle,
  className,
  align = "left",
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-10", align === "center" && "text-center", className)}>
      <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-1">{title}</h2>
      {subtitle && <p className="text-slate-400 text-base mt-2">{subtitle}</p>}
      <div
        className={cn(
          "h-px mt-4 bg-gradient-to-r from-purple-600 via-blue-500 to-transparent",
          align === "center" && "mx-auto w-28"
        )}
      />
    </div>
  );
}
