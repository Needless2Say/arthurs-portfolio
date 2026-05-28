import type { SkillGroup } from "@/types/portfolio";

export const SKILL_GROUPS: SkillGroup[] = [
  {
    label: "Languages",
    color: "nebula",
    skills: ["Python", "TypeScript", "JavaScript", "C/C++", "SQL", "R", "HTML/CSS"],
  },
  {
    label: "Frontend",
    color: "cosmic",
    skills: ["Next.js", "React", "Tailwind CSS", "Jinja"],
  },
  {
    label: "Backend",
    color: "green",
    skills: ["FastAPI", "REST APIs", "Alembic"],
  },
  {
    label: "Data & Cloud",
    color: "stellar",
    skills: [
      "Snowflake",
      "Databricks",
      "Azure",
      "AWS",
      "Streamlit",
      "Pandas",
      "PyTorch",
      "TensorFlow",
      "PostgreSQL",
    ],
  },
  {
    label: "Tools",
    color: "gray",
    skills: ["Git / GitHub", "Jira", "Confluence", "Docker", "Power BI", "Excel"],
  },
];
