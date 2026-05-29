import { cn } from "@/utils/cn";

type HudColor = "purple" | "cyan" | "yellow" | "emerald";

interface HudFrameProps {
	children: React.ReactNode;
	className?: string;
	color?: HudColor;
	corners?: boolean;
	label?: string;
}

const colorMap: Record<HudColor, { border: string; text: string; dot: string }> = {
	purple:  { border: "border-blue-400/70",  text: "text-blue-300",  dot: "bg-blue-400" },
	cyan:    { border: "border-yellow-400/70",    text: "text-yellow-300",    dot: "bg-yellow-400" },
	yellow:  { border: "border-yellow-400/70",  text: "text-yellow-300",  dot: "bg-yellow-400" },
	emerald: { border: "border-emerald-400/70", text: "text-emerald-300", dot: "bg-emerald-400" },
};

export default function HudFrame({
	children,
	className,
	color = "purple",
	corners = true,
	label,
}: HudFrameProps) {
	const { border, text, dot } = colorMap[color];

	return (
		<div className={cn("relative", className)}>
			{corners && (
				<>
					<span className={cn("pointer-events-none absolute -top-px -left-px w-3 h-3 border-t-2 border-l-2 rounded-tl-md", border)} />
					<span className={cn("pointer-events-none absolute -top-px -right-px w-3 h-3 border-t-2 border-r-2 rounded-tr-md", border)} />
					<span className={cn("pointer-events-none absolute -bottom-px -left-px w-3 h-3 border-b-2 border-l-2 rounded-bl-md", border)} />
					<span className={cn("pointer-events-none absolute -bottom-px -right-px w-3 h-3 border-b-2 border-r-2 rounded-br-md", border)} />
				</>
			)}

			{label && (
				<div className="pointer-events-none absolute -top-2.5 left-4 flex items-center gap-1.5 px-2 py-0.5 bg-[#09090f] z-10">
					<span className={cn("w-1 h-1 rounded-full animate-pulse", dot)} />
					<span className={cn("font-mono text-[9px] tracking-[0.25em] uppercase", text)}>
						{label}
					</span>
				</div>
			)}

			{children}
		</div>
	);
}
