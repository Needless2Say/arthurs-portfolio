import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ROUTES } from "@/constants/routes";
import { PERSONAL_INFO } from "@/constants/personal-info";
import TypewriterText from "@/components/ui/TypewriterText";
import HomeLoader from "@/components/ui/HomeLoader";
import MissionTimeline from "@/components/ui/MissionTimeline";
import SocialLinks from "@/components/ui/SocialLinks";
import mission_chicago from "@/../public/mission_control_chicago.jpg";

export const metadata: Metadata = {
	title: "Arthur Krieger | Software Engineer & KriegerDataForge Founder",
	description:
		"Arthur Krieger — Software/Platform Engineer at Charles Schwab, CS + Data Science from the University of Michigan (2025). Founder of KriegerDataForge. Building data pipelines, full-stack apps, ML systems, and fitness technology from Chicago, IL. Open to new opportunities.",
	alternates: { canonical: "https://needless2say.github.io/arthurs-portfolio" },
	openGraph: {
		title: "Arthur Krieger | Software Engineer & KriegerDataForge Founder",
		description:
			"Software/Platform Engineer at Charles Schwab. Founder of KriegerDataForge. Building data pipelines, full-stack apps, ML systems, and fitness technology. Based in Chicago, IL.",
		url: "https://needless2say.github.io/arthurs-portfolio",
	},
};

const STATS = [
	{ value: "3",          label: "Internships" },
	{ value: "Fortune 500", label: "Experience" },
	// { value: "3.75",       label: "GPA" },
	{ value: "UMich Eng CS",   label: "Class of '25" },
];

export default function Home() {
	return (
		<>
		<HomeLoader />

		<div className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-8">
			<div className="text-center max-w-3xl mx-auto">

				{/* Eyebrow */}
				<p
					className="text-purple-400 font-mono text-xs tracking-[0.25em] uppercase mb-6 animate-fade-in"
					style={{ animationDelay: "0s" }}
				>
					Ann Arbor → Chicago
				</p>

				{/* Name */}
				<h1
					className="text-6xl sm:text-7xl md:text-8xl font-bold text-white glow-text leading-tight mb-2 pb-2 animate-fade-in-up"
					style={{ animationDelay: "0.1s" }}
				>
					Arthur
				</h1>
				<h1
					className="text-6xl sm:text-7xl md:text-8xl font-bold gradient-text leading-tight mb-5 pb-2 animate-fade-in-up"
					style={{ animationDelay: "0.2s" }}
				>
					Krieger
				</h1>

				{/* Typewriter role */}
				<p
					className="text-purple-300 font-mono text-sm tracking-wider mb-4 h-5 animate-fade-in"
					style={{ animationDelay: "0.25s" }}
				>
					<TypewriterText />
				</p>

				{/* Tagline */}
				<p
					className="text-slate-300 text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-7 animate-fade-in-up"
					style={{ animationDelay: "0.35s" }}
				>
					{PERSONAL_INFO.tagline}
				</p>

				{/* Stats chips */}
				<div
					className="flex flex-wrap items-center justify-center gap-2 mb-5 animate-fade-in"
					style={{ animationDelay: "0.45s" }}
				>
					{STATS.map((stat) => (
						<div
							key={stat.label}
							className="glass-card px-4 py-1.5 border-white/5 flex items-center gap-1.5"
						>
							<span className="text-white font-bold text-sm font-mono">{stat.value}</span>
							<span className="text-slate-400 text-xs">{stat.label}</span>
						</div>
					))}
				</div>

				{/* Currently at badge */}
				<div
					className="flex items-center justify-center gap-2 mb-9 animate-fade-in"
					style={{ animationDelay: "0.5s" }}
				>
					<span className="relative flex h-2 w-2">
						<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
						<span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
					</span>
					<span className="text-slate-400 text-xs font-mono">
						Currently @ Charles Schwab — Chicago, IL
					</span>
				</div>

				{/* CTAs */}
				<div
					className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-7 animate-fade-in-up"
					style={{ animationDelay: "0.55s" }}
				>
					<Link
						href={ROUTES.PROJECTS}
						className="px-8 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-all duration-300 hover:shadow-[0_0_24px_rgba(124,58,237,0.5)] w-full sm:w-auto text-center text-sm"
					>
						View My Work
					</Link>
					<Link
						href={ROUTES.ABOUT}
						className="px-8 py-3 rounded-full border border-white/15 hover:border-white/35 text-slate-300 hover:text-white font-semibold transition-all duration-300 w-full sm:w-auto text-center text-sm"
					>
						About Me
					</Link>
				</div>

				{/* Social icon links */}
				<div
					className="mb-16 animate-fade-in"
					style={{ animationDelay: "0.65s" }}
				>
					<SocialLinks
						github={PERSONAL_INFO.links.github}
						linkedin={PERSONAL_INFO.links.linkedin}
						email={PERSONAL_INFO.email}
					/>
				</div>

				{/* Scroll indicator */}
				<div
					className="flex flex-col items-center gap-2 animate-fade-in"
					style={{ animationDelay: "0.8s" }}
				>
					<span className="text-slate-600 font-mono text-xs tracking-widest">
						scroll
					</span>
					<div className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center pt-1.5 animate-pulse-glow">
						<div className="w-0.5 h-1.5 rounded-full bg-purple-500 animate-float" />
					</div>
				</div>

			</div>
		</div>

		{/* ===== Mission Timeline (below the fold) ===== */}
		<div className="pb-16 pt-8">
			<MissionTimeline />
		</div>

		{/* ===== Chicago HQ ===== */}
		<div className="pb-28 pt-4">
			<section className="relative w-full max-w-3xl mx-auto px-4">
				<div className="text-center mb-8">
					<p className="text-cyan-400 font-mono text-[10px] tracking-[0.4em] uppercase mb-2">
						◇ base of operations ◇
					</p>
					<h2 className="text-3xl sm:text-4xl font-bold gradient-text glow-text mb-5 pb-2">
						Chicago HQ
					</h2>
					<p className="text-slate-500 text-sm font-mono">
						{"// where the code ships from"}
					</p>
				</div>

				<div className="relative group rounded-xl overflow-hidden border border-cyan-500/20 shadow-[0_0_60px_rgba(6,182,212,0.08)] bg-black/40 transition-all duration-300 hover:border-cyan-400/40 hover:shadow-[0_0_80px_rgba(6,182,212,0.15)] max-w-2xl mx-auto">
					{/* HUD corners */}
					<span className="pointer-events-none absolute top-2 left-2  z-10 w-4 h-4 border-t-2 border-l-2 border-cyan-400/70 rounded-tl-sm transition-all duration-300 group-hover:border-cyan-300" />
					<span className="pointer-events-none absolute top-2 right-2 z-10 w-4 h-4 border-t-2 border-r-2 border-cyan-400/70 rounded-tr-sm transition-all duration-300 group-hover:border-cyan-300" />
					<span className="pointer-events-none absolute bottom-[2.75rem] left-2  z-10 w-4 h-4 border-b-2 border-l-2 border-cyan-400/70 rounded-bl-sm transition-all duration-300 group-hover:border-cyan-300" />
					<span className="pointer-events-none absolute bottom-[2.75rem] right-2 z-10 w-4 h-4 border-b-2 border-r-2 border-cyan-400/70 rounded-br-sm transition-all duration-300 group-hover:border-cyan-300" />

					{/* Image */}
					<div className="relative w-full aspect-video">
						<Image
							src={mission_chicago}
							alt="Chicago HQ — Arthur Krieger's workspace"
							fill
							className="object-cover"
							sizes="(max-width: 640px) 100vw, 672px"
						/>
						{/* Scanline overlay */}
						<div
							className="absolute inset-0 pointer-events-none z-[1]"
							style={{ background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 3px)" }}
						/>
						{/* Vignette */}
						<div
							className="absolute inset-0 pointer-events-none z-[1]"
							style={{ background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.55) 100%)" }}
						/>
					</div>

					{/* Status bar */}
					<div className="flex items-center justify-between px-4 py-2.5 bg-black/65 border-t border-cyan-500/10">
						<div className="flex items-center gap-2">
							<span className="relative flex h-1.5 w-1.5">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
								<span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
							</span>
							<span className="font-mono text-[10px] tracking-[0.35em] text-cyan-400/80 uppercase">
								CHICAGO HQ
							</span>
						</div>
						<span className="font-mono text-[10px] tracking-wider text-slate-500">
							Downtown Chicago, IL
						</span>
					</div>
				</div>
			</section>
		</div>
		</>
	);
}