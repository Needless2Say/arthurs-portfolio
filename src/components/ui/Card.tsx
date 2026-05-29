import { cn } from "@/utils/cn";

interface CardProps {
	children: React.ReactNode;
	className?: string;
	glow?: "purple" | "blue" | "gold" | "none";
}

const glowMap = {
	purple: "hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(37,99,235,0.12)]",
	blue: "hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.12)]",
	gold: "hover:border-yellow-500/40 hover:shadow-[0_0_30px_rgba(251,191,36,0.12)]",
	none: "",
};

export default function Card({ children, className, glow = "purple" }: CardProps) {
	return (
		<div
			className={cn(
				"glass-card p-6 transition-all duration-300 hover:-translate-y-1",
				glowMap[glow],
				className
			)}
		>
			{children}
		</div>
  );
}