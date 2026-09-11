import { cn } from "@/utils/cn";
import type { ProjectStatus } from "@/types/portfolio";

interface ProjectStatusBadgeProps {
	status: ProjectStatus;
}

const statusMap: Record<ProjectStatus, { label: string; className: string; live: boolean }> = {
	"live":            { label: "live",            className: "border-emerald-400/40 text-emerald-300", live: true  },
	"pre-launch":      { label: "pre-launch",      className: "border-yellow-400/40 text-yellow-300",   live: true  },
	"security-review": { label: "security review", className: "border-orange-400/40 text-orange-300",   live: true  },
	"in-development":  { label: "in development",  className: "border-blue-400/40 text-blue-300",       live: false },
	"planned":         { label: "planned",         className: "border-slate-500/40 text-slate-400",     live: false },
};

export default function ProjectStatusBadge({ status }: ProjectStatusBadgeProps) {
	const meta = statusMap[status];

	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest",
				meta.className
			)}
		>
			<span className="relative flex h-1.5 w-1.5">
				{meta.live && (
					<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-70" />
				)}
				<span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
			</span>
			{meta.label}
		</span>
	);
}
