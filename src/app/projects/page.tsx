import type { Metadata } from "next";
import TechBadge from "@/components/ui/TechBadge";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";
import HudFrame from "@/components/ui/HudFrame";
import ProjectStatusBadge from "@/components/ui/ProjectStatusBadge";
import { PROJECTS } from "@/constants/projects";
import type { Project, ProjectCategory } from "@/types/portfolio";

export const metadata: Metadata = {
	title: "Projects",
	description:
		"Projects built by Arthur Krieger — professional data platform engineering work, plus KriegerDataForge, a multi-tenant data platform with its own OAuth 2.0 / OIDC identity provider, a shared Python SDK, a Terraform control plane, an e-commerce storefront, and a free nutrition tracker. Built with Next.js, React, TypeScript, FastAPI, Python, PostgreSQL, Snowflake, Terraform, and more.",
	alternates: { canonical: "https://needless2say.github.io/arthurs-portfolio/projects" },
	openGraph: {
		title: "Projects | Arthur Krieger & KriegerDataForge",
		description:
			"Professional data platform engineering, plus a multi-tenant data platform with its own OIDC identity provider, shared Python SDK, Terraform control plane, e-commerce storefront, and nutrition tracker.",
		url: "https://needless2say.github.io/arthurs-portfolio/projects",
	},
};

const CATEGORY_META: Record<ProjectCategory, { chip: string; chipClass: string; frame: string }> = {
	professional: {
		chip: "Professional",
		chipClass: "text-emerald-300 border-emerald-400/30",
		frame: "production system",
	},
	personal: {
		chip: "Personal",
		chipClass: "text-blue-300 border-blue-400/30",
		frame: "featured payload",
	},
};

function CategoryChip({ category }: { category: ProjectCategory }) {
	const meta = CATEGORY_META[category];
	return (
		<span className={`text-[10px] border rounded-full px-2 py-0.5 font-mono uppercase tracking-widest ${meta.chipClass}`}>
			{meta.chip}
		</span>
	);
}

function FeaturedProject({ project }: { project: Project }) {
	return (
		<Reveal className="mb-12" delay={80}>
			<HudFrame
				color={project.category === "professional" ? "emerald" : "yellow"}
				label={CATEGORY_META[project.category].frame}
				corners={false}
				className="mb-4"
			>
				<Card glow="blue" className="p-5 sm:p-8">
					{/* Header */}
					<div className="flex flex-wrap items-center gap-3 mb-2">
						<span className="text-blue-400 font-mono text-xs uppercase tracking-widest">
							{project.subtitle}
						</span>
						<CategoryChip category={project.category} />
						{project.status && <ProjectStatusBadge status={project.status} />}
					</div>

					<h2 className="text-3xl font-bold text-white mb-3">
						{project.title}
					</h2>
					<p className="text-slate-300 text-base leading-relaxed mb-6">
						{project.description}
					</p>

					{/* Highlights */}
					{project.highlights && (
						<ul className="space-y-1.5 mb-6">
							{project.highlights.map((highlight) => (
								<li key={highlight} className="text-slate-400 text-sm flex gap-2">
									<span className="text-blue-500 mt-0.5 flex-shrink-0">›</span>
									{highlight}
								</li>
							))}
						</ul>
					)}

					{/* Architecture breakdown */}
					{project.architecture && (
						<div className="grid sm:grid-cols-3 gap-3 mb-6">
							{project.architecture.map((tier) => (
								<div key={tier.label} className="glass-card p-3 border-white/5">
									<p className="font-mono text-xs uppercase tracking-wider mb-2 text-blue-400">
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
					)}

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
	);
}

function ProjectGridCard({ project, index }: { project: Project; index: number }) {
	const [primaryLabel, ecosystemLabel] = (project.subtitle ?? "").split(" · ");

	return (
		<Reveal delay={index * 80}>
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

				<div className="flex flex-wrap items-center gap-2 mb-2">
					<h3 className="text-white font-bold text-lg">
						{project.title}
					</h3>
					{project.status && <ProjectStatusBadge status={project.status} />}
				</div>

				<p className="text-slate-400 text-sm leading-relaxed mb-4">
					{project.description}
				</p>

				{project.highlights && (
					<ul className="space-y-1.5 mb-4">
						{project.highlights.map((highlight) => (
							<li key={highlight} className="text-slate-500 text-xs flex gap-2">
								<span className="text-blue-500 mt-0.5 flex-shrink-0">›</span>
								{highlight}
							</li>
						))}
					</ul>
				)}

				<div className="flex flex-wrap gap-1.5">
					{project.techStack.map((t) => (
						<TechBadge key={t} label={t} />
					))}
				</div>
			</Card>
		</Reveal>
	);
}

function ProjectSection({
	title,
	subtitle,
	projects,
	gridLabel,
}: {
	title: string;
	subtitle: string;
	projects: Project[];
	/** Caption above the non-featured grid. Differs per section. */
	gridLabel: string;
}) {
	if (projects.length === 0) return null;

	const featured = projects.filter((p) => p.featured);
	const rest = projects.filter((p) => !p.featured);

	return (
		<section className="mb-20">
			<Reveal>
				<SectionHeader title={title} subtitle={subtitle} />
			</Reveal>

			{featured.map((project) => (
				<FeaturedProject key={project.title} project={project} />
			))}

			{rest.length > 0 && (
				<div>
					<Reveal>
						<p className="text-slate-600 font-mono text-sm mb-4">{gridLabel}</p>
					</Reveal>

					<div className="grid sm:grid-cols-2 gap-4">
						{rest.map((project, i) => (
							<ProjectGridCard key={project.title} project={project} index={i} />
						))}
					</div>
				</div>
			)}
		</section>
	);
}

export default function Projects() {
	const professional = PROJECTS.filter((p) => p.category === "professional");
	const personal = PROJECTS.filter((p) => p.category === "personal");

	return (
		<div className="min-h-screen pt-24 pb-16 px-4">
			<div className="max-w-4xl mx-auto">
				<Reveal className="mb-12">
					<h1 className="text-4xl font-bold text-white glow-text mb-3 pb-2">Projects</h1>
					<p className="text-slate-400 text-base">
						Split into two. What I build at work, and what I build on my own.
					</p>
					<div className="h-px mt-4 animate-gradient-line" />
				</Reveal>

				<ProjectSection
					title="Professional Work"
					subtitle="Production systems built on the job, running in a Fortune 500 data platform. Described without internal names or proprietary detail."
					projects={professional}
					gridLabel="// also shipped on the job"
				/>

				<ProjectSection
					title="Personal Work"
					subtitle="KriegerDataForge, the multi-tenant data platform I design, build, and operate on my own, and the products running on it."
					projects={personal}
					gridLabel="// more from this ecosystem"
				/>
			</div>
		</div>
	);
}
