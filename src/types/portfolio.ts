export type BadgeColor =
	| "nebula"
	| "cosmic"
	| "stellar"
	| "green"
	| "gray"
	| "default";

export interface SkillGroup {
	label: string;
	color: BadgeColor;
	skills: string[];
}

export interface Experience {
	role: string;
	company: string;
	location: string;
	period: string;
	bullets: string[];
	/** Condensed bullets for the printed resume. Falls back to `bullets` when absent. */
	resumeBullets?: string[];
	tech: string[];
}

export interface Education {
	school: string;
	location: string;
	degree: string;
	minor?: string;
	gpa: string;
	period: string;
	honors?: string;
	coursework: string[];
}

export type ProjectStatus =
	| "live"
	| "pre-launch"
	| "security-review"
	| "in-development"
	| "planned";

export interface ArchitectureTier {
	label: string;
	color: BadgeColor;
	items: string[];
}

export type ProjectCategory = "professional" | "personal";

export interface Project {
	title: string;
	subtitle?: string;
	category: ProjectCategory;
	status?: ProjectStatus;
	/** One line version used by the resume. Only projects with a summary appear there. */
	summary?: string;
	description: string;
	highlights?: string[];
	techStack: string[];
	architecture?: ArchitectureTier[];
	links: {
		github?: string;
		/** The project's own website. */
		site?: string;
		youtube?: string[];
	};
	featured?: boolean;
}

export interface SpeakingVideo {
	label: string;
	/** YouTube video id. The site embeds it, the printed resume prints youtu.be/<id>. */
	id: string;
}

export interface Speaking {
	title: string;
	org: string;
	date: string;
	detail: string;
	videos?: SpeakingVideo[];
}

export interface BlogPost {
	slug: string;
	title: string;
	date: string;
	excerpt: string;
	tags: string[];
	readTime: number;
}