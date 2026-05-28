import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "404 — Lost in the Void",
	description: "These coordinates aren't on the map.",
};

export default function NotFound() {
	return (
		<div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12">
			<div className="max-w-xl w-full text-center">

				{/* Distress signal indicator */}
				<div className="inline-flex items-center gap-2 glass-card px-4 py-1.5 border-white/5 mb-8 animate-fade-in">
					<span className="relative flex h-1.5 w-1.5">
						<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
						<span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
					</span>
					<span className="text-slate-400 font-mono text-[10px] tracking-[0.25em] uppercase">
						signal lost · transmission interrupted
					</span>
				</div>

				{/* Big 404 with cosmic glow */}
				<h1
					className="text-[8rem] sm:text-[10rem] leading-none font-bold gradient-text glow-text mb-4 animate-fade-in-up"
					style={{ animationDelay: "0.1s" }}
				>
					404
				</h1>

				<p
					className="text-white text-2xl sm:text-3xl font-bold mb-3 animate-fade-in-up"
					style={{ animationDelay: "0.2s" }}
				>
					Lost in the Void.
				</p>

				<p
					className="text-slate-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed mb-10 animate-fade-in-up"
					style={{ animationDelay: "0.3s" }}
				>
					These coordinates aren&apos;t on the star map. The page you&apos;re
					looking for either drifted into deep space, never existed, or has
					been quietly retired from this sector.
				</p>

				{/* Coordinates readout */}
				<div
					className="glass-card border-white/5 p-4 mb-10 max-w-sm mx-auto font-mono text-[11px] text-left animate-fade-in"
					style={{ animationDelay: "0.4s" }}
				>
					<div className="flex justify-between text-slate-500">
						<span>SECTOR:</span>
						<span className="text-slate-300">UNKNOWN</span>
					</div>
					<div className="flex justify-between text-slate-500">
						<span>STATUS:</span>
						<span className="text-red-400">NOT FOUND</span>
					</div>
					<div className="flex justify-between text-slate-500">
						<span>RECOMMENDATION:</span>
						<span className="text-emerald-400">RETURN HOME</span>
					</div>
				</div>

				{/* CTAs */}
				<div
					className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up"
					style={{ animationDelay: "0.5s" }}
				>
					<Link
						href="/"
						className="px-7 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-all duration-300 hover:shadow-[0_0_24px_rgba(124,58,237,0.5)] w-full sm:w-auto text-center text-sm"
					>
						↩ Return to Home Base
					</Link>
					<Link
						href="/projects"
						className="px-7 py-3 rounded-full border border-white/15 hover:border-white/35 text-slate-300 hover:text-white font-semibold transition-all duration-300 w-full sm:w-auto text-center text-sm"
					>
						Browse Projects
					</Link>
				</div>

			</div>
		</div>
	);
}
