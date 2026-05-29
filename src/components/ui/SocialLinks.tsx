"use client";

import { useState } from "react";

interface SocialLinksProps {
	github: string;
	linkedin: string;
	email: string;
}

interface TooltipState {
	copied: boolean;
}

const CLOSE_MS = 700;

export default function SocialLinks({ github, linkedin, email }: SocialLinksProps) {
	const [emailOpen, setEmailOpen] = useState(false);
	const [emailClosing, setEmailClosing] = useState(false);
	const [tooltip, setTooltip] = useState<TooltipState>({ copied: false });

	function closeEmail() {
		setEmailClosing(true);
		setTimeout(() => {
			setEmailOpen(false);
			setEmailClosing(false);
		}, CLOSE_MS);
	}

	function handleCopy() {
		navigator.clipboard.writeText(email).then(() => {
			setTooltip({ copied: true });
			setTimeout(() => setTooltip({ copied: false }), 2000);
		});
	}

	return (
		<>
			<div className="flex items-center justify-center gap-5">
				{/* GitHub */}
				<a
					href={github}
					target="_blank"
					rel="noopener noreferrer"
					aria-label="GitHub"
					className="group relative flex flex-col items-center gap-2"
				>
					<div className="relative w-12 h-12 rounded-2xl glass-card border-white/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-slate-400/50 group-hover:shadow-[0_0_22px_rgba(148,163,184,0.25)]">
						{/* Orbit ring */}
						<span className="absolute inset-0 rounded-2xl border border-slate-500/0 group-hover:border-slate-400/30 transition-all duration-300 scale-100 group-hover:scale-110 opacity-0 group-hover:opacity-100" />
						<svg className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors duration-200" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
							<path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
						</svg>
					</div>
					<span className="text-slate-600 group-hover:text-slate-400 font-mono text-[9px] tracking-widest uppercase transition-colors duration-200">
						GitHub
					</span>
				</a>

				{/* LinkedIn */}
				<a
					href={linkedin}
					target="_blank"
					rel="noopener noreferrer"
					aria-label="LinkedIn"
					className="group relative flex flex-col items-center gap-2"
				>
					<div className="relative w-12 h-12 rounded-2xl glass-card border-white/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-blue-400/50 group-hover:shadow-[0_0_22px_rgba(59,130,246,0.3)]">
						<span className="absolute inset-0 rounded-2xl border border-blue-500/0 group-hover:border-blue-400/30 transition-all duration-300 scale-100 group-hover:scale-110 opacity-0 group-hover:opacity-100" />
						<svg className="w-5 h-5 text-slate-400 group-hover:text-blue-300 transition-colors duration-200" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
							<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
						</svg>
					</div>
					<span className="text-slate-600 group-hover:text-blue-400 font-mono text-[9px] tracking-widest uppercase transition-colors duration-200">
						LinkedIn
					</span>
				</a>

				{/* Email — opens popup instead of mailto */}
				<button
					onClick={() => setEmailOpen(true)}
					aria-label="Email"
					className="group relative flex flex-col items-center gap-2 cursor-pointer"
				>
					<div className="relative w-12 h-12 rounded-2xl glass-card border-white/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-blue-400/50 group-hover:shadow-[0_0_22px_rgba(59,130,246,0.3)]">
						<span className="absolute inset-0 rounded-2xl border border-blue-500/0 group-hover:border-blue-400/30 transition-all duration-300 scale-100 group-hover:scale-110 opacity-0 group-hover:opacity-100" />
						{/* Animated ping for "active" feel */}
						<span className="absolute top-1.5 right-1.5 flex h-1.5 w-1.5">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-50" />
							<span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500" />
						</span>
						<svg className="w-5 h-5 text-slate-400 group-hover:text-blue-300 transition-colors duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
							<rect x="2" y="4" width="20" height="16" rx="2" />
							<path d="m2 7 10 7 10-7" />
						</svg>
					</div>
					<span className="text-slate-600 group-hover:text-blue-400 font-mono text-[9px] tracking-widest uppercase transition-colors duration-200">
						Email
					</span>
				</button>

			</div>

			{/* Email popup modal */}
			{emailOpen && (
				<div
					className="fixed inset-0 z-[150] flex items-center justify-center px-4"
					onClick={closeEmail}
				>
					{/* Backdrop */}
					<div className={`absolute inset-0 bg-black/75 backdrop-blur-md ${emailClosing ? "animate-backdrop-collapse" : ""}`} />

					{/* Shockwave rings + spark particles */}
					{emailClosing && (
						<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
							{/* Three rings at staggered timings */}
							<div className="absolute w-80 h-80 rounded-full border-2 border-blue-400/80 animate-collapse-shockwave" />
							<div className="absolute w-72 h-72 rounded-full border border-blue-400/60 animate-collapse-shockwave-2" />
							<div className="absolute w-64 h-64 rounded-full border border-white/35 animate-collapse-shockwave-3" />

							{/* Eight spark particles radiating outward */}
							<div className="relative w-0 h-0">
								{([
									[0,   "bg-yellow-300", "0 0 6px rgba(253,224,71,0.9)"],
									[45,  "bg-white",      "0 0 6px rgba(255,255,255,0.9)"],
									[90,  "bg-blue-300",   "0 0 6px rgba(147,197,253,0.9)"],
									[135, "bg-yellow-200", "0 0 6px rgba(254,240,138,0.9)"],
									[180, "bg-yellow-300", "0 0 6px rgba(253,224,71,0.9)"],
									[225, "bg-white",      "0 0 6px rgba(255,255,255,0.9)"],
									[270, "bg-blue-300",   "0 0 6px rgba(147,197,253,0.9)"],
									[315, "bg-yellow-200", "0 0 6px rgba(254,240,138,0.9)"],
								] as [number, string, string][]).map(([angle, color, glow]) => (
									<div
										key={angle}
										className="absolute top-0 left-0"
										style={{ transform: `rotate(${angle}deg)` }}
									>
										<div
											className={`animate-spark-fly w-2 h-2 rounded-full ${color}`}
											style={{ boxShadow: glow }}
										/>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Nova bloom — radial purple flash at supernova peak */}
					{emailClosing && (
						<div
							className="absolute inset-0 animate-nova-flash pointer-events-none"
							style={{
								background: "radial-gradient(ellipse at center, rgba(250,204,21,0.45) 0%, rgba(37,99,235,0.15) 42%, transparent 68%)",
								mixBlendMode: "screen",
							}}
						/>
					)}

					{/* Dialog */}
					<div
						className={`relative glass-card border-blue-500/25 p-5 sm:p-7 w-full max-w-sm text-center ${emailClosing ? "animate-stellar-collapse" : "shadow-[0_0_60px_rgba(37,99,235,0.2)] animate-fade-in-up"}`}
						onClick={(e) => e.stopPropagation()}
					>
						{/* HUD corners */}
						<span className="pointer-events-none absolute -top-px -left-px w-3 h-3 border-t-2 border-l-2 rounded-tl-md border-blue-400/70" />
						<span className="pointer-events-none absolute -top-px -right-px w-3 h-3 border-t-2 border-r-2 rounded-tr-md border-blue-400/70" />
						<span className="pointer-events-none absolute -bottom-px -left-px w-3 h-3 border-b-2 border-l-2 rounded-bl-md border-blue-400/70" />
						<span className="pointer-events-none absolute -bottom-px -right-px w-3 h-3 border-b-2 border-r-2 rounded-br-md border-blue-400/70" />

						{/* Icon */}
						<div className="mx-auto mb-4 w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
							<svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
								<rect x="2" y="4" width="20" height="16" rx="2" />
								<path d="m2 7 10 7 10-7" />
							</svg>
						</div>

						<p className="text-slate-500 font-mono text-[10px] tracking-[0.3em] uppercase mb-2">
							transmission address
						</p>
						<p className="text-white font-mono text-base font-medium mb-5 break-all">
							{email}
						</p>

						{/* Copy button */}
						<button
							onClick={handleCopy}
							className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all duration-200 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] mb-3 flex items-center justify-center gap-2"
						>
							{tooltip.copied ? (
								<>
									<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
										<path d="m5 13 4 4L19 7" />
									</svg>
									Copied!
								</>
							) : (
								<>
									<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
										<rect x="9" y="9" width="13" height="13" rx="2" />
										<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
									</svg>
									Copy Email
								</>
							)}
						</button>

						<a
							href={`mailto:${email}`}
							className="block text-slate-500 hover:text-slate-300 font-mono text-xs transition-colors duration-200"
						>
							open in mail app →
						</a>

						{/* Close */}
						<button
							onClick={closeEmail}
							aria-label="Close"
							className="absolute top-3 right-3 text-slate-600 hover:text-slate-300 transition-colors duration-200"
						>
							<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<path d="m18 6-12 12M6 6l12 12" />
							</svg>
						</button>
					</div>
				</div>
			)}
		</>
	);
}