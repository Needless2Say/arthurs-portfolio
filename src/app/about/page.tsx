import type { Metadata } from "next";
import Image from "next/image";
import me_pic from "@/../public/me_pic.jpg";
import { PERSONAL_INFO, EDUCATION, EXPERIENCE } from "@/constants/personal-info";
import { SKILL_GROUPS } from "@/constants/skills";
import SectionHeader from "@/components/ui/SectionHeader";
import TechBadge from "@/components/ui/TechBadge";
import Card from "@/components/ui/Card";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
	title: "About",
	description: "Learn about Arthur Krieger — CS + Data Science, University of Michigan.",
};

interface GitHubUser {
	public_repos: number;
	followers: number;
	following: number;
	created_at: string;
}

interface GitHubStats {
	user: GitHubUser;
	totalCommits: number;
	totalPRs: number;
}

async function getGitHubStats(): Promise<GitHubStats | null> {
	try {
		const headers = { Accept: "application/vnd.github.v3+json" };
		const [userRes, commitsRes, prsRes] = await Promise.all([
			fetch("https://api.github.com/users/Needless2Say", { headers }),
			fetch("https://api.github.com/search/commits?q=author:Needless2Say", { headers }),
			fetch("https://api.github.com/search/issues?q=author:Needless2Say+type:pr", { headers }),
		]);
		if (!userRes.ok) return null;
		const user = (await userRes.json()) as GitHubUser;
		const commitsData = commitsRes.ok
			? ((await commitsRes.json()) as { total_count: number })
			: null;
		const prsData = prsRes.ok
			? ((await prsRes.json()) as { total_count: number })
			: null;
		return {
			user,
			totalCommits: commitsData?.total_count ?? 0,
			totalPRs: prsData?.total_count ?? 0,
		};
	} catch {
		return null;
	}
}

export default async function About() {
	const gh = await getGitHubStats();
	return (
		<div className="min-h-screen pt-24 pb-16 px-4">
			<div className="max-w-4xl mx-auto">

				{/* ===== Hero: Photo + Bio ===== */}
				<Reveal className="flex flex-col lg:flex-row gap-10 mb-16 items-start">
					<div className="flex-shrink-0 mx-auto lg:mx-0">
						<div className="relative w-44 h-60 rounded-xl overflow-hidden border border-purple-500/20 shadow-[0_0_40px_rgba(124,58,237,0.15)]">
							<Image src={me_pic} alt="Arthur Krieger" fill className="object-cover" />
						</div>
					</div>

					<div className="flex-grow">
						<h1 className="text-4xl font-bold text-white glow-text mb-1">
							{PERSONAL_INFO.name}
						</h1>
						<p className="text-purple-400 font-mono text-sm mb-5">
							{PERSONAL_INFO.title}
						</p>
						<p className="text-slate-300 text-base leading-relaxed mb-6">
							{PERSONAL_INFO.bio}
						</p>

						<div className="glass-card p-4 border-white/5">
							<p className="text-slate-500 font-mono text-xs uppercase tracking-widest mb-3">
								Notable Coursework
							</p>
							<div className="flex flex-wrap gap-2">
								{EDUCATION[0].coursework.map((course) => (
									<TechBadge key={course} label={course.split(" – ")[0]} color="nebula" />
								))}
							</div>
						</div>
					</div>
				</Reveal>

				{/* ===== Experience Timeline ===== */}
				<section className="mb-16">
					<Reveal>
						<SectionHeader title="Experience" />
					</Reveal>

					<div className="relative">
						<div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-purple-600/50 via-blue-600/30 to-transparent" />
						<div className="space-y-6">
							{EXPERIENCE.map((exp, i) => (
								<Reveal key={i} className="relative pl-12" delay={i * 90}>
									<div className="absolute left-4 top-5 w-4 h-4 rounded-full bg-[#09090f] border-2 border-purple-500 -translate-x-1/2 flex items-center justify-center">
										<div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
									</div>

									<Card glow="purple">
										<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
											<div>
												<h3 className="text-white font-bold text-base">
													{exp.role}
												</h3>
												<p className="text-purple-300 text-sm font-medium">
													{exp.company}
												</p>
												<p className="text-slate-500 text-xs">
													{exp.location}
												</p>
											</div>

											<span className="text-slate-400 font-mono text-xs mt-1 sm:mt-0 sm:text-right whitespace-nowrap">
												{exp.period}
											</span>
										</div>

										<ul className="space-y-1.5 mb-4">
											{exp.bullets.map((bullet, j) => (
												<li key={j} className="text-slate-400 text-sm flex gap-2">
													<span className="text-purple-500 mt-0.5 flex-shrink-0">
														›
													</span>
													{bullet}
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
					</div>
				</section>

				{/* ===== Education ===== */}
				<section className="mb-16">
					<Reveal>
						<SectionHeader title="Education" />
					</Reveal>

					<div className="grid gap-4">
						{EDUCATION.map((edu, i) => (
							<Reveal key={i} delay={i * 90}>
								<Card glow="blue">
									<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
										<div>
											<h3 className="text-white font-bold">{edu.school}</h3>
											<p className="text-blue-300 text-sm mt-0.5">{edu.degree}</p>
											{edu.minor && (
												<p className="text-slate-400 text-sm">
													{edu.minor}
												</p>
											)}
											{edu.honors && (
												<p className="text-yellow-400 text-sm font-medium mt-1">{edu.honors}</p>
											)}
										</div>

										<div className="text-left sm:text-right mt-2 sm:mt-0 flex-shrink-0">
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

				{/* ===== Skills ===== */}
				<section className="mb-16">
					<Reveal>
						<SectionHeader title="Skills" />
					</Reveal>

					<div className="space-y-5">
						{SKILL_GROUPS.map((group, i) => (
							<Reveal key={group.label} delay={i * 70}>
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

				{/* ===== GitHub Activity ===== */}
				<section>
					<Reveal>
						<SectionHeader title="GitHub" />
					</Reveal>
					<Reveal delay={60}>
						<div className="glass-card p-6 border-white/5 flex flex-col sm:flex-row gap-6 items-start">
							<div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
								<svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
									<path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
								</svg>
							</div>

							<div className="flex-grow">
								<p className="text-white font-bold text-lg mb-0.5">Needless2Say</p>
								<p className="text-slate-400 text-sm mb-4 leading-relaxed">
									Building full-stack apps, data pipelines, and ML experiments on the KriegerDataForge platform.
								</p>

								{gh && (
									<div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-4 mb-4">
										{[
											{ value: gh.user.public_repos, label: "Public Repos" },
											{ value: gh.totalCommits,      label: "Commits" },
											{ value: gh.totalPRs,          label: "Pull Requests" },
											{ value: gh.user.followers,    label: "Followers" },
											{ value: gh.user.following,    label: "Following" },
											{ value: new Date(gh.user.created_at).getFullYear(), label: "Member Since" },
										].map((stat) => (
											<div key={stat.label}>
												<p className="text-white font-bold font-mono text-lg leading-none">{stat.value}</p>
												<p className="text-slate-500 text-xs mt-0.5">{stat.label}</p>
											</div>
										))}
									</div>
								)}

								<a
									href={PERSONAL_INFO.links.github}
									target="_blank"
									rel="noopener noreferrer"
									className="text-sm text-slate-400 hover:text-white transition-colors font-mono"
								>
									View Profile →
								</a>
							</div>
						</div>
					</Reveal>
				</section>

			</div>
		</div>
	);
}