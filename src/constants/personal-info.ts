import type { Experience, Education, Speaking } from "@/types/portfolio";

export const PERSONAL_INFO = {
	name: "Arthur Krieger",
	title: "Software/Platform Engineer · CS + Data Science",
	tagline: "Building at the intersection of Data and Software.",
	email: "kriegear@umich.edu",
	resumePdf: "/arthurs-portfolio/Arthur_Krieger_Resume.pdf",
	links: {
		linkedin: "https://www.linkedin.com/in/arthur-krieger-3b986220a/",
		github: "https://github.com/Needless2Say",
		instagram: "https://www.instagram.com/needless2say_dbfan/",
		kriegerdataforge: "https://needless2say.github.io/kriegerdataforge-portfolio",
	},
	bio: "I graduated from the University of Michigan College of Engineering in 2025 with a Bachelor of Science in Computer Science and a minor in Data Science. I currently work as a Software/Platform Engineer at Charles Schwab on the Wealth Asset Management Engineering Team, building dashboards, GitHub devops, and data pipelines. Outside of work I design and build KriegerDataForge, a personal platform spanning 18 repositories that I use to ship my own apps faster, with its own OAuth 2.0 and OIDC identity provider, a shared Python SDK every app backend installs, a Terraform control plane, and the apps built on top of it.",
	summary:
		"Software and platform engineer at Charles Schwab, on a team building the shared infrastructure other engineers build on. My main focus has been the metadata preservation system, which I designed and built end to end so warehouse governance metadata survives schema deployments, along with the Streamlit dashboards and dashboard template the data governance and tenant teams depend on. Outside work I design and operate KriegerDataForge, a personal platform I use to ship my own apps faster, with its own OIDC identity provider, shared SDK, and Terraform control plane. I build systems that are idempotent, observable, and safe to re-run.",
};

export const EDUCATION: Education[] = [
	{
		school: "University of Michigan College of Engineering",
		location: "Ann Arbor, MI",
		degree: "B.S. Computer Science Engineering",
		minor: "Data Science Minor",
		gpa: "3.75 / 4.0",
		period: "Sep 2022 - May 2025",
		coursework: [
			"EECS 281 - Data Structures & Algorithms",
			"EECS 370 - Computer Architecture",
			"EECS 442 - Computer Vision",
			"EECS 445 - Intro to ML",
			"EECS 449 - Conversational AI",
			"EECS 481 - Software Development",
			"EECS 485 - Web Systems",
			"EECS 492 - Intro to AI",
			"DATASCI 315 - Deep Learning",
		],
	},
	{
		school: "Michigan State University College of Engineering",
		location: "East Lansing, MI",
		degree: "B.S. Computer Science (transferred)",
		gpa: "3.93 / 4.0",
		period: "Sep 2021 - May 2022",
		honors: "Honors College",
		coursework: [],
	},
];

export const EXPERIENCE: Experience[] = [
	{
		role: "Software/Platform Engineer",
		company: "Charles Schwab",
		location: "Chicago, IL",
		period: "June 2025 - Present",
		bullets: [
			"Architected and implemented a declarative metadata reconciliation system, mid April to end of August 2026, from the first conversation to working end to end in production, eliminating silent loss of Snowflake data governance metadata during schema deployments and cutting recovery of thousands of metadata rows from three to four hours of manual rework to seconds, saving an estimated tens to hundreds of hours of manual management",
			"Engineered that system to be provably recoverable and safe to re-run, so any failure mode results in inaction rather than data corruption, and recovery is always a replay rather than a rebuild. 20+ schema deployments absorbed since go-live with no human involvement",
			"Designed that system to be object type agnostic and multi-tenant, governing any warehouse object type across both standard and fully custom metadata categories, with any number of teams onboarding themselves and managing their own metadata independently. Non-engineers author metadata from the tool they already use, with no YAML to write and no engineering dependency to wait on",
			"Build and maintain data pipelines that ingest, transform, and deliver financial data to analysts and data scientists on the Wealth Asset Management Engineering Team",
			"Develop GitHub Actions CI/CD workflows and DevOps automation tooling to streamline engineering team processes across GitHub and GitHub Actions",
			"Create Streamlit dashboards for internal data observability, pipeline monitoring, and ad-hoc analytics on Snowflake",
			"Provision and manage cloud infrastructure with Terraform on GCP",
		],
		resumeBullets: [
			"Architected and implemented a declarative metadata reconciliation system, mid April to end of August 2026, eliminating silent loss of warehouse governance metadata during schema deployments. Cut recovery of thousands of metadata rows from three to four hours of manual rework to seconds, with 20+ schema deployments absorbed since go-live and no human involvement in any of them",
			"Engineered it to be provably recoverable and safe to re-run, so any failure mode is inaction rather than data corruption and recovery is always a replay",
			"Made it object type agnostic and multi-tenant, so any team onboards itself and manages its own metadata independently, and non-engineers author metadata from the tool they already use with no YAML and no engineering dependency",
			"Took sole ownership of two business critical dashboard repositories after the original developers departed, rebuilt one on a feature based architecture, and published it as a template any tenant team can start from",
			"Optimized the dashboard's core Snowflake queries to roughly half the execution time with disk spill eliminated, serving 100+ daily users",
			"Build and maintain data pipelines delivering financial data to analysts and data scientists, develop GitHub Actions CI/CD workflows and DevOps automation, and provision GCP infrastructure with Terraform across five environments",
		],
		tech: ["Python", "Snowflake", "SQL", "GCP Cloud Services", "GitHub Actions", "Streamlit", "Terraform", "BitBucket", "Bamboo"],
	},
	{
		role: "Data Engineer Intern",
		company: "Charles Schwab",
		location: "Lone Tree, CO",
		period: "June 2024 - August 2024",
		bullets: [
			"Part of a scrum team using Agile methodology. Built dashboards for data observability and monitoring of data pipelines using Streamlit and Snowflake",
			"Delivered Streamlit dashboards displaying pipeline operations and data profiling metrics using Snowflake",
			"Presented a research plan on using generative AI to synthesize data and improve fraud protection",
		],
		tech: ["Python", "Streamlit", "Snowflake", "SQL"],
	},
	{
		role: "Data Engineer Intern",
		company: "Revantage (Blackstone Portfolio Co.)",
		location: "Chicago, IL",
		period: "June 2023 - August 2023",
		bullets: [
			"Integrated Azure DevOps REST API in Databricks using Python and SQL to track software changes",
			"Researched and implemented External Tables in Snowflake to reduce costs and bypass unnecessary data transfers",
			"Presented to stakeholders at the end of each 3-week sprint",
		],
		tech: ["Python", "SQL", "Databricks", "Azure"],
	},
	{
		role: "Research Assistant",
		company: "Department of Obstetrics and Gynecology — Wayne State University",
		location: "Detroit, MI",
		period: "September 2021 - August 2022",
		bullets: [
			"Used R to analyze gene expression rates and auto generate visualizations for a published preeclampsia research paper",
			"Built an R Shiny app for researchers to query an SQL database and generate plots interactively",
		],
		tech: ["R", "SQL", "ggplot2", "RShiny"],
	},
];

export const CERTIFICATIONS = [
	"Snowflake SnowPro Core - October 2025",
	"Google Cloud Certified: Associate Cloud Engineer - August 2025",
	"Microsoft Certified: Azure Fundamentals - August 2023",
	"Academy Accreditation: Databricks Lakehouse Fundamentals - August 2023",
];

export const SPEAKING: Speaking[] = [
	{
		title: "Guest Lecturer, EECS 481 Software Engineering",
		org: "University of Michigan, College of Engineering · Prof. Westley Weimer",
		date: "November 2025",
		detail:
			"Invited by Professor Westley Weimer to return to the University of Michigan and deliver one of four annual guest lectures, selected from a pool of alumni within six months of graduating. Presented to 100+ students on the path from university to industry, which coursework translates most directly to industry skills, and how to secure internships, followed by an extended Q&A. Also joined Professor Weimer's lunch with Master's and PhD students to discuss research and industry practice.",
		videos: [
			{ label: "Lecture", id: "3r0xsfJqhnw" },
			{ label: "Q&A", id: "bcbiZgvfEPM" },
		],
	},
];