import type { Metadata } from "next";
import TechBadge from "@/components/ui/TechBadge";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";
import HudFrame from "@/components/ui/HudFrame";
import { PROJECTS } from "@/constants/projects";

export const metadata: Metadata = {
	title: "Projects",
	description:
		"Projects built by Arthur Krieger — full-stack web apps, data pipelines, ML systems, and fitness technology under the KriegerDataForge brand. Built with Next.js, React, TypeScript, FastAPI, Python, PostgreSQL, and more.",
	alternates: { canonical: "https://needless2say.github.io/arthurs-portfolio/projects" },
	openGraph: {
		title: "Projects | Arthur Krieger & KriegerDataForge",
		description:
			"Full-stack apps, data pipelines, ML systems, and fitness technology built by Arthur Krieger under the KriegerDataForge brand.",
		url: "https://needless2say.github.io/arthurs-portfolio/projects",
	},
};

export default function Projects() {
	const featured = PROJECTS.filter((p) => p.featured);
	const rest = PROJECTS.filter((p) => !p.featured);

	return (
		<div className="min-h-screen pt-24 pb-16 px-4">
			<div className="max-w-4xl mx-auto">
				<Reveal>
					<SectionHeader title="Projects" subtitle="Things I've built and am building." />
				</Reveal>

				{/* Featured */}
				{featured.map((project) => (
					<Reveal key={project.title} className="mb-12" delay={80}>
						<HudFrame color="yellow" label="featured payload" className="mb-4">
						<Card glow="blue" className="p-5 sm:p-8">
							{/* Header */}
							<div className="flex items-center gap-3 mb-2">
								<span className="text-blue-400 font-mono text-xs uppercase tracking-widest">
									{project.subtitle}
								</span>
								<span className="text-xs text-yellow-400 border border-yellow-400/30 rounded-full px-2 py-0.5 font-mono">
									Featured
								</span>
							</div>

							<h2 className="text-3xl font-bold text-white mb-3">
								{project.title}
							</h2>
							<p className="text-slate-300 text-base leading-relaxed mb-6">
								{project.description}
							</p>

							{/* Architecture breakdown */}
							<div className="grid sm:grid-cols-3 gap-3 mb-6">
								{[
									{
										label: "Frontend",
										color: "nebula" as const,
										labelColor: "text-blue-400",
										items: ["Next.js", "React", "TypeScript", "TailwindCSS"],
									},
									{
										label: "Backend",
										color: "cosmic" as const,
										labelColor: "text-blue-400",
										items: ["FastAPI", "Python"],
									},
									{
										label: "Database",
										color: "green" as const,
										labelColor: "text-emerald-400",
										items: ["PostgreSQL", "Alembic"],
									},
									].map((tier) => (
									<div key={tier.label} className="glass-card p-3 border-white/5">
										<p className={`font-mono text-xs uppercase tracking-wider mb-2 ${tier.labelColor}`}>
											{tier.label}
										</p>

										<div className="flex flex-wrap gap-1">
											{tier.items.map((t) => (
												<TechBadge key={t} label={t} color={tier.color} />
											))}
										</div>
									</div>
								))}
							</div>

							{project.links.github && (
								<a
									href={project.links.github}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors font-mono"
								>
									↗ View on GitHub
								</a>
							)}
						</Card>
						</HudFrame>

						{/* YouTube embeds */}
						{project.links.youtube && (
						<div className="mt-4 grid sm:grid-cols-2 gap-4">
							{project.links.youtube.map((url, i) => (
								<div key={i} className="glass-card overflow-hidden border-white/5 rounded-xl">
									<iframe
										src={url}
										title={`${project.title} demo ${i + 1}`}
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
										referrerPolicy="strict-origin-when-cross-origin"
										allowFullScreen
										className="w-full aspect-video"
									/>
								</div>
							))}
						</div>
						)}
					</Reveal>
				))}

				{/* Other projects */}
				{rest.length > 0 && (
				<div>
					<Reveal>
						<p className="text-slate-600 font-mono text-sm mb-4">{"// more projects"}</p>
					</Reveal>

					<div className="grid sm:grid-cols-2 gap-4">
						{rest.map((project, i) => {
							const [primaryLabel, ecosystemLabel] = (project.subtitle ?? "").split(" · ");
							return (
							<Reveal key={project.title} delay={i * 80}>
								<Card glow="blue">
									<div className="flex flex-wrap items-center gap-2 mb-1">
										<p className="text-blue-400 font-mono text-xs uppercase tracking-wider">
											{primaryLabel}
										</p>
										{ecosystemLabel && (
											<span className="text-xs text-yellow-400/80 border border-yellow-400/25 rounded-full px-2 py-0.5 font-mono">
												{ecosystemLabel}
											</span>
										)}
									</div>

									<h3 className="text-white font-bold text-lg mb-2">
										{project.title}
									</h3>
									<p className="text-slate-400 text-sm leading-relaxed mb-4">
										{project.description}
									</p>

									<div className="flex flex-wrap gap-1.5">
										{project.techStack.map((t) => (
											<TechBadge key={t} label={t} />
										))}
									</div>
								</Card>
							</Reveal>
							);
						})}

						{/* Placeholder */}
						<Reveal delay={rest.length * 80}>
							<div className="glass-card p-6 border border-dashed border-white/10 opacity-50">
								<p className="text-slate-500 font-mono text-xs uppercase tracking-wider mb-1">
									In Progress
								</p>
								<h3 className="text-slate-400 font-bold text-lg mb-2">
									Coming Soon
								</h3>
								<p className="text-slate-500 text-sm">
									Always building something new.
								</p>
							</div>
						</Reveal>
					</div>
				</div>
				)}
			</div>
		</div>
	);
}