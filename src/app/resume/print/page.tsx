import type { Metadata } from "next";
import {
	PERSONAL_INFO,
	EDUCATION,
	EXPERIENCE,
	CERTIFICATIONS,
	SPEAKING,
} from "@/constants/personal-info";
import { SKILL_GROUPS } from "@/constants/skills";
import { PROJECTS } from "@/constants/projects";

export const metadata: Metadata = {
	title: "Resume (print)",
	robots: { index: false, follow: false },
};

/**
 * Print-only resume. This page is the single source the PDF in `public/` is
 * generated from, so the site and the downloadable resume can never drift.
 *
 * Regenerate with `make resume-pdf` (see the Makefile).
 */
export default function ResumePrint() {
	const resumeProjects = PROJECTS.filter((p) => p.summary);

	return (
		<>
			{/* Strip the site chrome and the dark theme for print. */}
			<style>{`
				body > *:not(main) { display: none !important; }
				body { background: #ffffff !important; }
				main { position: static !important; z-index: auto !important; }
				main > * { opacity: 1 !important; transform: none !important; animation: none !important; }
				@page { size: Letter; margin: 0.5in; }
				@media print {
					.rp { padding: 0 !important; }
					.rp-section { break-inside: auto; }
					.rp-entry { break-inside: avoid; }
					/* A section heading must never be the last thing on a page. */
					.rp-section > h2 { break-after: avoid; }
					.rp-section > h2 + div > .rp-entry:first-child { break-before: avoid; }
					/*
					  globals.css sets min-height 100vh and overflow-x hidden on body for
					  the site. Neither belongs in paged media, where they can add stray
					  height past the last page boundary.
					*/
					html, body {
						height: auto !important;
						min-height: 0 !important;
						overflow: visible !important;
					}
					main { min-height: 0 !important; }
					.rp > *:last-child { margin-bottom: 0 !important; padding-bottom: 0 !important; }
				}
			`}</style>

			<div className="rp mx-auto max-w-[7.5in] bg-white px-8 py-8 text-[9.5pt] leading-[1.3] text-neutral-900">

				{/* ===== Header ===== */}
				<header className="border-b-2 border-neutral-800 pb-2">
					<h1 className="text-[19pt] font-bold tracking-tight">{PERSONAL_INFO.name}</h1>
					<p className="mt-0.5 text-[10pt] text-neutral-700">{PERSONAL_INFO.title}</p>
					<p className="mt-1 text-[8.5pt] text-neutral-600">
						{PERSONAL_INFO.email}
						{" · "}Chicago, IL
						{" · "}linkedin.com/in/arthur-krieger-3b986220a
						{" · "}github.com/Needless2Say
						{" · "}needless2say.github.io/arthurs-portfolio
					</p>
				</header>

				{/* ===== Summary ===== */}
				<section className="rp-section mt-2.5">
					<h2 className="mb-1 border-b border-neutral-300 pb-0.5 text-[10pt] font-bold uppercase tracking-wide">
						Summary
					</h2>
					<p className="text-[9pt] text-neutral-800">{PERSONAL_INFO.summary}</p>
				</section>

				{/* ===== Experience ===== */}
				<section className="rp-section mt-2.5">
					<h2 className="mb-1.5 border-b border-neutral-300 pb-0.5 text-[10pt] font-bold uppercase tracking-wide">
						Experience
					</h2>

					<div className="space-y-2">
						{EXPERIENCE.map((exp) => (
							<div key={`${exp.company}-${exp.period}`} className="rp-entry">
								<div className="flex items-baseline justify-between gap-4">
									<p className="font-bold">
										{exp.role}
										<span className="font-normal text-neutral-700">{" — "}{exp.company}</span>
									</p>
									<p className="whitespace-nowrap text-[9pt] text-neutral-600">{exp.period}</p>
								</div>
								<p className="text-[9pt] italic text-neutral-600">{exp.location}</p>

								<ul className="mt-1 space-y-0.5">
									{(exp.resumeBullets ?? exp.bullets).map((b) => (
										<li key={b} className="flex gap-1.5 text-[9pt]">
											<span className="text-neutral-500">•</span>
											<span>{b}</span>
										</li>
									))}
								</ul>

								<p className="mt-1 text-[8.5pt] text-neutral-600">
									<span className="font-semibold">Technologies. </span>
									{exp.tech.join(", ")}
								</p>
							</div>
						))}
					</div>
				</section>

				{/* ===== Projects ===== */}
				<section className="rp-section mt-2.5">
					<h2 className="mb-1.5 border-b border-neutral-300 pb-0.5 text-[10pt] font-bold uppercase tracking-wide">
						Projects
					</h2>

					<div className="space-y-2">
						{resumeProjects.map((project) => (
							<div key={project.title} className="rp-entry">
								<p className="font-bold">
									{project.title}
									{project.subtitle && (
										<span className="font-normal text-neutral-700">{" — "}{project.subtitle}</span>
									)}
								</p>
								<p className="text-[9pt] text-neutral-800">{project.summary}</p>
								<p className="mt-0.5 text-[8.5pt] text-neutral-600">
									<span className="font-semibold">Technologies. </span>
									{project.techStack.join(", ")}
								</p>
							</div>
						))}
					</div>
				</section>

				{/* ===== Education ===== */}
				<section className="rp-section mt-2.5">
					<h2 className="mb-1.5 border-b border-neutral-300 pb-0.5 text-[10pt] font-bold uppercase tracking-wide">
						Education
					</h2>

					<div className="space-y-2">
						{EDUCATION.map((edu) => (
							<div key={edu.school} className="rp-entry">
								<div className="flex items-baseline justify-between gap-4">
									<p className="font-bold">{edu.school}</p>
									<p className="whitespace-nowrap text-[9pt] text-neutral-600">{edu.period}</p>
								</div>
								<p className="text-[9pt]">
									{edu.degree}
									{edu.minor && `, ${edu.minor}`}
									{edu.honors && `, ${edu.honors}`}
									{" — GPA "}{edu.gpa}
									<span className="text-neutral-600">{" · "}{edu.location}</span>
								</p>
								{edu.coursework.length > 0 && (
									<p className="text-[8.5pt] text-neutral-600">
										<span className="font-semibold">Coursework. </span>
										{edu.coursework.join(", ")}
									</p>
								)}
							</div>
						))}
					</div>
				</section>

				{/* ===== Skills ===== */}
				<section className="rp-section mt-2.5">
					<h2 className="mb-1.5 border-b border-neutral-300 pb-0.5 text-[10pt] font-bold uppercase tracking-wide">
						Skills
					</h2>

					<div className="grid grid-cols-2 gap-x-6">
						{SKILL_GROUPS.map((group) => (
							<p key={group.label} className="text-[9pt]">
								<span className="font-semibold">{group.label}. </span>
								{group.skills.join(", ")}
							</p>
						))}
					</div>
				</section>

				{/* ===== Certifications ===== */}
				<section className="rp-section mt-2.5">
					<h2 className="mb-1.5 border-b border-neutral-300 pb-0.5 text-[10pt] font-bold uppercase tracking-wide">
						Certifications
					</h2>

					<ul className="grid grid-cols-2 gap-x-6">
						{CERTIFICATIONS.map((cert) => (
							<li key={cert} className="flex gap-1.5 text-[9pt]">
								<span className="text-neutral-500">•</span>
								<span>{cert}</span>
							</li>
						))}
					</ul>
				</section>

				{/* ===== Speaking ===== */}
				<section className="rp-section mt-2.5">
					<h2 className="mb-1.5 border-b border-neutral-300 pb-0.5 text-[10pt] font-bold uppercase tracking-wide">
						Speaking
					</h2>

					{SPEAKING.map((item) => (
						<div key={item.title} className="rp-entry">
							<div className="flex items-baseline justify-between gap-4">
								<p className="font-bold">{item.title}</p>
								<p className="whitespace-nowrap text-[9pt] text-neutral-600">{item.date}</p>
							</div>
							<p className="text-[8.5pt] italic text-neutral-600">{item.org}</p>
							<p className="text-[9pt] text-neutral-800">{item.detail}</p>
							{item.videos && (
								<p className="mt-0.5 text-[8.5pt] text-neutral-600">
									{item.videos.map((v, i) => (
										<span key={v.id}>
											{i > 0 && " · "}
											<span className="font-semibold">{v.label}. </span>
											youtu.be/{v.id}
										</span>
									))}
								</p>
							)}
						</div>
					))}
				</section>

			</div>
		</>
	);
}
