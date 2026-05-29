import type { Metadata } from "next";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import TechBadge from "@/components/ui/TechBadge";
import Reveal from "@/components/ui/Reveal";
import { PERSONAL_INFO, EDUCATION, EXPERIENCE, CERTIFICATIONS } from "@/constants/personal-info";
import { SKILL_GROUPS } from "@/constants/skills";

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
						<p className="text-purple-400 font-mono text-sm mt-1">{PERSONAL_INFO.title}</p>
					</div>
					<a
						href={PERSONAL_INFO.resumePdf}
						download="Arthur_Krieger_Resume.pdf"
						className="flex-shrink-0 ml-4 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-all duration-300 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]"
					>
						Download PDF
					</a>
				</Reveal>

				{/* Objective */}
				<section className="mb-12">
					<Reveal>
						<SectionHeader title="Objective" />
					</Reveal>
					<Reveal delay={60}>
						<p className="text-slate-300 leading-relaxed text-sm">{PERSONAL_INFO.objective}</p>
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
								<Card glow="purple">
									<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
										<div>
											<h3 className="text-white font-bold text-sm">
												{exp.role}
											</h3>
											<p className="text-purple-300 text-xs">
												{exp.company} · {exp.location}
											</p>
										</div>

										<span className="text-slate-500 font-mono text-xs mt-1 sm:mt-0 whitespace-nowrap">
											{exp.period}
										</span>
									</div>

									<ul className="space-y-1 mb-3">
										{exp.bullets.map((b, j) => (
											<li key={j} className="text-slate-400 text-xs flex gap-2">
												<span className="text-purple-500 mt-0.5 flex-shrink-0">
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
											<h3 className="text-white font-bold text-sm">
												{edu.school}
											</h3>
											<p className="text-blue-300 text-xs">
												{edu.degree}
											</p>
											{edu.minor && (
												<p className="text-slate-400 text-xs">
													{edu.minor}
												</p>
											)}
											{edu.honors && (
												<p className="text-yellow-400 text-xs font-medium">
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
				<section>
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

			</div>
		</div>
	);
}