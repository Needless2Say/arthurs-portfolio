import type { BlogPost } from "@/types/portfolio";

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "building-kriegerdataforge",
    title: "Building KriegerDataForge: A Full-Stack Platform from Scratch",
    date: "2025-10-15",
    excerpt:
      "How I designed a shared backend platform to power all my personal projects — from architecture decisions and FastAPI patterns to PostgreSQL schema management with Alembic.",
    tags: ["Full Stack", "FastAPI", "PostgreSQL", "Next.js"],
    readTime: 8,
  },
  {
    slug: "data-engineering-at-schwab",
    title: "What I Learned as a Data Engineer at Charles Schwab",
    date: "2024-09-01",
    excerpt:
      "Reflections on building production Streamlit dashboards in Snowflake, working Agile at scale, and pitching AI-driven fraud detection to a financial engineering team.",
    tags: ["Data Engineering", "Snowflake", "Internship"],
    readTime: 6,
  },
  {
    slug: "michigan-cs-courses",
    title: "The Michigan CS Courses That Changed How I Think",
    date: "2025-07-20",
    excerpt:
      "A breakdown of the classes that shaped my approach to software — from EECS 281 algorithms to EECS 449 Conversational AI and DATASCI 315 Deep Learning.",
    tags: ["Education", "Computer Science", "Michigan"],
    readTime: 5,
  },
];
