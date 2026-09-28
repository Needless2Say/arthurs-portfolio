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
		kriegerdataforge: "https://kriegerdataforge.com",
	},
	bio: "I graduated from the University of Michigan College of Engineering in 2025 with a Bachelor of Science in Computer Science and a minor in Data Science. I work as a Software/Platform Engineer at Charles Schwab on the Wealth Asset Management Engineering Team, building dashboards, GitHub DevOps tooling, and data pipelines. I also design and build KriegerDataForge, a personal platform I use for my own apps. It spans 18 repositories. The apps share single sign on through its OAuth 2.0 and OIDC identity provider, common code lives in shared Python and npm packages, and Terraform and a CI/CD library keep every repository built and deployed the same way.",
	summary:
		"Software and platform engineer at Charles Schwab, on a team that builds shared infrastructure for other engineers. My main focus has been a metadata preservation system I designed and built so warehouse governance metadata survives schema deployments, along with the Streamlit dashboards and dashboard template that the data governance and tenant teams use. I also design and build KriegerDataForge, a personal platform for my own apps, with an OIDC identity provider for single sign on, shared Python and npm packages, and Terraform infrastructure. I try to build systems that are safe to re-run and easy to observe.",
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
			"Designed and built a declarative metadata reconciliation system between mid April and the end of August 2026, taking it from the first conversation to production. It stops schema deployments from silently removing Snowflake data governance metadata, and it cut recovery of thousands of metadata rows from three to four hours of manual rework to seconds",
			"Built it to be safe to re-run, so a failure leaves data as it was instead of corrupting it, and recovery is a replay rather than a rebuild. It has handled 20+ schema deployments since go-live without anyone stepping in",
			"Made it work across warehouse object types and both standard and custom metadata, with each team onboarding itself and managing its own metadata. Non-engineers edit metadata in the spreadsheets they already use, without writing YAML or waiting on an engineer",
			"Build and maintain data pipelines that ingest, transform, and deliver financial data to analysts and data scientists on the Wealth Asset Management Engineering Team",
			"Develop GitHub Actions CI/CD workflows and DevOps automation for the engineering team",
			"Create Streamlit dashboards for internal data observability, pipeline monitoring, and ad-hoc analytics on Snowflake",
			"Provision and manage cloud infrastructure with Terraform on GCP",
		],
		resumeBullets: [
			"Designed and built a declarative metadata reconciliation system between mid April and the end of August 2026 that stops schema deployments from silently removing warehouse governance metadata. It cut recovery of thousands of metadata rows from three to four hours of manual rework to seconds, and has handled 20+ schema deployments since go-live without anyone stepping in",
			"Built it to be safe to re-run, so a failure leaves data as it was instead of corrupting it and recovery is a replay",
			"Made it work across object types and teams, so each team onboards itself and manages its own metadata, and non-engineers edit metadata in the spreadsheets they already use without writing YAML",
			"Took over two dashboard repositories after their original developers left, rebuilt one on a feature based architecture, and turned it into a template other tenant teams can start from",
			"Cut the execution time of the dashboard's main Snowflake queries roughly in half and removed disk spill, for a dashboard with 100+ daily users",
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
		company: "Department of Obstetrics and Gynecology, Wayne State University",
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
			"Invited by Professor Westley Weimer to give one of the course's four yearly guest lectures, which go to alumni within six months of graduating. Talked with 100+ students about going from university to industry, which coursework carried over most directly, and how to find internships, followed by a Q&A. Also joined Professor Weimer's lunch with Master's and PhD students to talk about research and industry practice.",
		videos: [
			{ label: "Lecture", id: "3r0xsfJqhnw" },
			{ label: "Q&A", id: "bcbiZgvfEPM" },
		],
	},
];