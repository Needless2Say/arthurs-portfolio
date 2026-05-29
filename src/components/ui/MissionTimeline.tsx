import { cn } from "@/utils/cn";

type PhaseStatus = "complete" | "online" | "standby";

interface Phase {
	id: string;
	title: string;
	subtitle: string;
	period: string;
	status: PhaseStatus;
}

const PHASES: Phase[] = [
	{
		id: "01",
		title: "Foundation Sequence",
		subtitle: "CS + Data Science · University of Michigan",
		period: "2021 — 2025",
		status: "complete",
	},
	{
		id: "02",
		title: "Field Recon",
		subtitle: "Internships · Schwab · Revantage (Blackstone) · Wayne State",
		period: "2021 — 2024",
		status: "complete",
	},
	{
		id: "03",
		title: "Active Deployment",
		subtitle: "Software/Platform Engineer · Charles Schwab · Chicago",
		period: "2025 — Present",
		status: "online",
	},
	{
		id: "04",
		title: "Trajectory Open",
		subtitle: "Next mission · open to opportunities and conversations",
		period: "2026 →",
		status: "standby",
	},
];

const statusStyles: Record<PhaseStatus, { dot: string; ring: string; label: string; text: string; border: string }> = {
	complete: {
		dot: "bg-emerald-500",
		ring: "bg-emerald-400",
		label: "complete",
		text: "text-emerald-300",
		border: "border-emerald-500/30",
	},
	online: {
		dot: "bg-purple-500",
		ring: "bg-purple-400",
		label: "online",
		text: "text-purple-300",
		border: "border-purple-500/40",
	},
	standby: {
		dot: "bg-yellow-500",
		ring: "bg-yellow-400",
		label: "standby",
		text: "text-yellow-300",
		border: "border-yellow-500/30",
	},
};

export default function MissionTimeline() {
	return (
		<section className="relative w-full max-w-3xl mx-auto px-4">
			{/* Section header */}
			<div className="text-center mb-10">
				<p className="text-purple-400 font-mono text-[10px] tracking-[0.4em] uppercase mb-2">
					◇ mission control ◇
				</p>
				<h2 className="text-3xl sm:text-4xl font-bold gradient-text glow-text mb-2 pb-2">
					Career Trajectory
				</h2>
				<p className="text-slate-500 text-sm font-mono">
					{"// flight log, recent missions"}
				</p>
			</div>

			{/* Timeline */}
			<div className="relative">
				{/* Vertical trail */}
				<div
					className="absolute left-3 top-3 bottom-3 w-px"
					style={{
						background:
							"linear-gradient(to bottom, rgba(16,185,129,0.5) 0%, rgba(124,58,237,0.5) 50%, rgba(250,204,21,0.35) 100%)",
					}}
				/>

				<div className="space-y-4">
					{PHASES.map((phase) => {
						const s = statusStyles[phase.status];
						const live = phase.status === "online";
						return (
							<div key={phase.id} className="relative pl-12">
								{/* Status node */}
								<div className="absolute left-3 top-5 -translate-x-1/2 w-4 h-4 flex items-center justify-center">
									{live && (
										<span className={cn("absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping", s.ring)} />
									)}
									<span className={cn("relative inline-flex rounded-full h-2.5 w-2.5 border-2 border-[#09090f]", s.dot)} />
								</div>

								{/* Phase card */}
								<div
									className={cn(
										"glass-card border-white/5 px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/15",
										live && "shadow-[0_0_24px_rgba(124,58,237,0.12)]"
									)}
								>
									<div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1 mb-1.5">
										<div className="flex items-center gap-3">
											<span className="text-slate-600 font-mono text-[10px] tracking-widest">
												PHASE {phase.id}
											</span>
											<span
												className={cn(
													"inline-flex items-center gap-1 px-2 py-0.5 rounded-full border font-mono text-[9px] uppercase tracking-widest",
													s.border,
													s.text
												)}
											>
												<span className={cn("w-1 h-1 rounded-full", s.dot)} />
												{s.label}
											</span>
										</div>
										<span className="text-slate-500 font-mono text-[10px] whitespace-nowrap mt-0.5 shrink-0">
											{phase.period}
										</span>
									</div>

									<h3 className="text-white font-bold text-base mb-0.5">
										{phase.title}
									</h3>
									<p className="text-slate-400 text-sm leading-relaxed">
										{phase.subtitle}
									</p>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
