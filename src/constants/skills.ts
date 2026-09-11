import type { SkillGroup } from "@/types/portfolio";

export const SKILL_GROUPS: SkillGroup[] = [
	{
		label: "Languages",
		color: "nebula",
		skills: [
			"Python",
			"TypeScript",
			"JavaScript",
			"C/C++",
			"SQL",
			"R",
			"HTML/CSS"
		],
	},
	{
		label: "Frontend",
		color: "cosmic",
		skills: [
			"Next.js",
			"React",
			"Tailwind CSS",
			"Zod",
			"Jinja"
		],
	},
	{
		label: "Backend",
		color: "green",
		skills: [
			"FastAPI",
			"REST APIs",
			"SQLModel",
			"SQLAlchemy",
			"Pydantic",
			"Alembic"
		],
	},
	{
		label: "Auth & Security",
		color: "nebula",
		skills: [
			"OAuth 2.0",
			"OIDC",
			"JWT / JWKS",
			"PKCE",
			"argon2id",
			"OWASP",
			"Bandit"
		],
	},
	{
		label: "Data & Cloud",
		color: "stellar",
		skills: [
			"Snowflake",
			"Databricks",
			"PostgreSQL",
			"GCP",
			"Azure",
			"AWS",
			"Vercel",
			"Streamlit",
			"Pandas",
			"PyTorch",
			"TensorFlow",
		],
	},
	{
		label: "DevOps & Infrastructure",
		color: "green",
		skills: [
			"Terraform",
			"GitHub Actions",
			"Docker",
			"CI/CD",
			"Bitbucket",
			"Bamboo"
		],
	},
	{
		label: "Testing & Quality",
		color: "cosmic",
		skills: [
			"pytest",
			"Playwright",
			"Ruff",
			"mypy",
			"ESLint",
			"CodeQL"
		],
	},
	{
		label: "Tools",
		color: "gray",
		skills: [
			"Git / GitHub",
			"Jira",
			"Confluence",
			"Agile / Scrum",
			"Power BI",
			"Excel"
		],
	},
];
