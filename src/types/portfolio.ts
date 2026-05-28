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

export interface Project {
	title: string;
	subtitle?: string;
	description: string;
	techStack: string[];
	links: {
		github?: string;
		youtube?: string[];
	};
	featured?: boolean;
}

export interface BlogPost {
	slug: string;
	title: string;
	date: string;
	excerpt: string;
	tags: string[];
	readTime: number;
}