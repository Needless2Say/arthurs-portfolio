import type { Experience, Education } from "@/types/portfolio";

export const PERSONAL_INFO = {
	name: "Arthur Krieger",
	title: "Software/Platform Engineer · CS + Data Science",
	tagline: "Building at the intersection of data and software.",
	email: "kriegear@umich.edu",
	resumePdf: "/arthurs-portfolio/Arthur_Krieger_Resume.pdf",
	links: {
		linkedin: "https://www.linkedin.com/in/arthur-krieger-3b986220a/",
		github: "https://github.com/Needless2Say",
		instagram: "https://www.instagram.com/needless2say_dbfan/",
	},
	bio: "I graduated from the University of Michigan College of Engineering in 2025 with a Bachelor of Science in Computer Science and a minor in Data Science. I currently work as a Software/Platform Engineer at Charles Schwab on the Wealth Asset Management Engineering Team, building dashboards, GitHub devops, and data pipelines. Outside of work I'm always building something, from full stack web apps to exploring ML and AI.",
	objective:
		"Forward thinking individual with strong interpersonal and multitasking skills, seeking a role in software development, data engineering, full stack development, or machine learning and artificial intelligence to leverage my passion for high tech computing technologies to drive innovation and contribute to the company's growth while expanding my expertise in these areas.",
};

export const EDUCATION: Education[] = [
	{
		school: "University of Michigan College of Engineering",
		location: "Ann Arbor, MI",
		degree: "B.S. Computer Science Engineering",
		minor: "Data Science Minor",
		gpa: "3.75 / 4.0",
		period: "Sep 2022 - Sep 2025",
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
			"Wealth Asset Management Engineering Team",
			"Building data pipelines that ingest data from various sources and transform it for data scientists and analysts",
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
		company: "Deptartment of Obstetrics and Gynecology — Wayne State University",
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
	"Microsoft Certified: Azure Fundamentals - August 2023",
	"Academy Accreditation: Databricks Lakehouse Fundamentals - August 2023",
];