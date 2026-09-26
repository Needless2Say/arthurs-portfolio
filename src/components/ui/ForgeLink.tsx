import { cn } from "@/utils/cn";

interface ForgeLinkProps {
	href: string;
	children: React.ReactNode;
	size?: "sm" | "md";
	className?: string;
}

/**
 * A KriegerDataForge outbound link, styled to look like a doorway into that
 * site's own dark-industrial/amber-forge theme rather than blending into this
 * site's blue/space palette. The idle ember glow (not just on hover) is
 * deliberate — this is the one external link the owner wants noticed.
 */
export default function ForgeLink({ href, children, size = "md", className }: ForgeLinkProps) {
	return (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className={cn(
				"tap-pad group relative inline-flex items-center gap-2 rounded-full border border-amber-400/40",
				"bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15",
				"font-mono uppercase tracking-widest transition-all duration-300 animate-ember-glow",
				"hover:border-amber-300/70 hover:-translate-y-0.5 hover:from-amber-500/25 hover:via-orange-500/20 hover:to-amber-500/25",
				size === "sm" ? "px-3 py-1 text-[10px]" : "px-4 py-1.5 text-xs",
				className
			)}
		>
			{/* The anvil, from the KDF favicon — same mark on both sides of the link */}
			<svg
				className="w-3.5 h-3.5 text-amber-400 group-hover:text-amber-300 transition-colors duration-200 shrink-0"
				viewBox="3.5 4 56 56"
				fill="currentColor"
				aria-hidden="true"
			>
				<path d="M5 18.5C10 16.6 14.5 15 20 15H58V25H47C43.5 25 41 28 41 32C41 36 44.5 39 52 40.5V49H39.5C39.5 46.8 37.5 46 35 46C32.5 46 30.5 46.8 30.5 49H18V40.5C25.5 39 29 36 29 32C29 28 26.5 25 23 25C16 24.5 10 22 5 18.5Z" />
			</svg>
			<span className="text-amber-200 group-hover:text-amber-100 transition-colors duration-200">
				{children}
			</span>
			<span aria-hidden="true" className="text-amber-300 group-hover:translate-x-0.5 transition-transform duration-200">
				→
			</span>
		</a>
	);
}
