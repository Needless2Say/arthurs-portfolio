import { cn } from "@/utils/cn";

interface SectionHeaderProps {
	title: string;
	subtitle?: string;
	className?: string;
	align?: "left" | "center";
	/**
	 * Heading level. Defaults to h2 for a section inside a page, but a page
	 * whose title IS this header passes "h1", otherwise that page ships with no
	 * h1 at all. /blog and /contact were both doing exactly that.
	 */
	as?: "h1" | "h2";
}

export default function SectionHeader({
	title,
	subtitle,
	className,
	align = "left",
	as: Heading = "h2",
}: SectionHeaderProps) {
	return (
		<div className={cn("mb-10", align === "center" && "text-center", className)}>
			<Heading className="text-3xl md:text-4xl font-bold gradient-text mb-3 pb-2">
				{title}
			</Heading>
			{subtitle && <p className="text-slate-400 text-base mt-2">{subtitle}</p>}
			<div
				className={cn(
					"h-px mt-4 animate-gradient-line",
					align === "center" && "mx-auto w-28"
				)}
			/>
		</div>
	);
}