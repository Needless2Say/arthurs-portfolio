import type { Metadata } from "next";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import TechBadge from "@/components/ui/TechBadge";
import Reveal from "@/components/ui/Reveal";
import ForgeLink from "@/components/ui/ForgeLink";
import { PERSONAL_INFO, EDUCATION, EXPERIENCE, CERTIFICATIONS, SPEAKING } from "@/constants/personal-info";
import { SKILL_GROUPS } from "@/constants/skills";
import { PROJECTS } from "@/constants/projects";
import { OG_IMAGE } from "@/constants/seo";

export const metadata: Metadata = {
	title: "Resume",
	description:
		"Arthur Krieger's resume — Software/Platform Engineer at Charles Schwab, Data Engineer intern at Revantage (Blackstone), UMich CS + Data Science 2025. Skills: Python, TypeScript, React, Next.js, Snowflake, SQL, GCP, Terraform, and more.",
	alternates: { canonical: "https://needless2say.github.io/arthurs-portfolio/resume" },
	openGraph: {
		title: "Resume | Arthur Krieger",
		description:
			"Software/Platform Engineer at Charles Schwab. UMich CS + Data Science 2025. Experience in data pipelines, DevOps, dashboards, and full-stack development.",
		url: "https://needless2say.github.io/arthurs-portfolio/resume",
		images: [OG_IMAGE],
	},
};

export default function Resume() {
	return (
		<div className="min-h-screen pt-24 pb-16 px-4">
			<div className="max-w-3xl mx-auto">

				{/* Header */}
				<Reveal className="flex items-start justify-between mb-10">
					<div>
						<h1 className="text-4xl font-bold text-white glow-text pb-2">{PERSONAL_INFO.name}</h1>
						<p className="text-blue-400 font-mono text-sm mt-1">{PERSONAL_INFO.title}</p>
					</div>
					<a
						href={PERSONAL_INFO.resumePdf}
						download="Arthur_Krieger_Resume.pdf"
						/* py-3 clears 44px. At py-2 this measured 36 and was fiddly on a phone. */
						className="flex-shrink-0 ml-4 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all duration-300 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
					>
						Download PDF
					</a>
				</Reveal>

				{/* Summary */}
				<section className="mb-12">
					<Reveal>
						<SectionHeader title="Summary" />
					</Reveal>
					<Reveal delay={60}>
						<p className="text-slate-300 leading-relaxed text-base mb-4">{PERSONAL_INFO.summary}</p>
						<ForgeLink href={PERSONAL_INFO.links.kriegerdataforge} size="sm">
							Visit KriegerDataForge
						</ForgeLink>
					</Reveal>
				</section>

				{/* Experience */}
				<section className="mb-12">
					<Reveal>
						<SectionHeader title="Experience" />
					</Reveal>

					<div className="space-y-4">
						{EXPERIENCE.map((exp, i) => (
							<Reveal key={i} delay={i * 80}>
								<Card glow="blue">
									<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
										<div>
											<h3 className="text-white font-bold text-lg">
												{exp.role}
											</h3>
											<p className="text-blue-300 text-sm">
												{exp.company} · {exp.location}
											</p>
										</div>

										<span className="text-slate-500 font-mono text-xs mt-1 sm:mt-0 whitespace-nowrap">
											{exp.period}
										</span>
									</div>

									<ul className="space-y-1 mb-3">
										{exp.bullets.map((b, j) => (
											<li key={j} className="text-slate-400 text-sm flex gap-2">
												<span className="text-blue-500 mt-0.5 flex-shrink-0">
													›
												</span>
												{b}
											</li>
										))}
									</ul>

									<div className="flex flex-wrap gap-1.5">
										{exp.tech.map((t) => (
											<TechBadge key={t} label={t} color="nebula" />
										))}
									</div>
								</Card>
							</Reveal>
						))}
					</div>
				</section>

				{/* Projects */}
				<section className="mb-12">
					<Reveal>
						<SectionHeader title="Projects" />
					</Reveal>

					<div className="space-y-4">
						{PROJECTS.filter((p) => p.summary).map((project, i) => (
							<Reveal key={project.title} delay={i * 80}>
								<Card glow="blue">
									<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
										<div>
											<h3 className="text-white font-bold text-lg">
												{project.title}
											</h3>
											<p className="text-blue-300 text-sm">
												{project.subtitle}
											</p>
										</div>
									</div>

									<p className="text-slate-400 text-sm leading-relaxed mb-3">
										{project.summary}
									</p>

									<div className="flex flex-wrap gap-1.5">
										{project.techStack.map((t) => (
											<TechBadge key={t} label={t} color="cosmic" />
										))}
									</div>
								</Card>
							</Reveal>
						))}
					</div>
				</section>

				{/* Education */}
				<section className="mb-12">
					<Reveal>
						<SectionHeader title="Education" />
					</Reveal>

					<div className="space-y-4">
						{EDUCATION.map((edu, i) => (
							<Reveal key={i} delay={i * 80}>
								<Card glow="blue">
									<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
										<div>
											<h3 className="text-white font-bold text-lg">
												{edu.school}
											</h3>
											<p className="text-blue-300 text-sm">
												{edu.degree}
											</p>
											{edu.minor && (
												<p className="text-slate-400 text-sm">
													{edu.minor}
												</p>
											)}
											{edu.honors && (
												<p className="text-yellow-400 text-sm font-medium">
													{edu.honors}
												</p>
											)}
										</div>

										<div className="text-right mt-2 sm:mt-0 flex-shrink-0">
											<p className="text-slate-400 font-mono text-xs">
												{edu.period}
											</p>
											<p className="text-slate-500 text-xs">
												{edu.location}
											</p>
											<p className="text-yellow-400 font-mono text-xs mt-1">
												GPA {edu.gpa}
											</p>
										</div>
									</div>
								</Card>
							</Reveal>
						))}
					</div>
				</section>

				{/* Skills */}
				<section className="mb-12">
					<Reveal>
						<SectionHeader title="Skills" />
					</Reveal>

					<div className="space-y-5">
						{SKILL_GROUPS.map((group, i) => (
							<Reveal key={group.label} delay={i * 60}>
								<div>
									<p className="text-slate-500 font-mono text-xs uppercase tracking-widest mb-2">
										{group.label}
									</p>
									<div className="flex flex-wrap gap-2">
										{group.skills.map((skill) => (
											<TechBadge key={skill} label={skill} color={group.color} />
										))}
									</div>
								</div>
							</Reveal>
						))}
					</div>
				</section>

				{/* Certifications */}
				<section className="mb-12">
					<Reveal>
						<SectionHeader title="Certifications" />
					</Reveal>

					<ul className="space-y-2">
						{CERTIFICATIONS.map((cert, i) => (
							<Reveal key={i} delay={i * 80}>
								<li className="text-slate-300 text-sm flex gap-2 items-start">
									<span className="text-yellow-400 mt-0.5 flex-shrink-0">
										✦
									</span>
									{cert}
								</li>
							</Reveal>
						))}
					</ul>
				</section>

				{/* Speaking */}
				<section>
					<Reveal>
						<SectionHeader title="Speaking" />
					</Reveal>

					<div className="space-y-4">
						{SPEAKING.map((item, i) => (
							<Reveal key={item.title} delay={i * 80}>
								<Card glow="blue">
									<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
										<div>
											<h3 className="text-white font-bold text-lg">
												{item.title}
											</h3>
											<p className="text-blue-300 text-sm">
												{item.org}
											</p>
										</div>

										<span className="text-slate-500 font-mono text-xs mt-1 sm:mt-0 whitespace-nowrap">
											{item.date}
										</span>
									</div>

									<p className="text-slate-400 text-sm leading-relaxed">
										{item.detail}
									</p>

									{item.videos && (
										<div className="mt-4 grid sm:grid-cols-2 gap-4">
											{item.videos.map((video) => (
												<div key={video.id}>
													<p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mb-1.5">
														{video.label}
													</p>
													<div className="glass-card overflow-hidden border-white/5 rounded-xl">
														<iframe
															src={`https://www.youtube.com/embed/${video.id}`}
															title={`${item.title} — ${video.label}`}
															allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
															referrerPolicy="strict-origin-when-cross-origin"
															allowFullScreen
															className="w-full aspect-video"
														/>
													</div>
												</div>
											))}
										</div>
									)}
								</Card>
							</Reveal>
						))}
					</div>
				</section>

			</div>
		</div>
	);
}