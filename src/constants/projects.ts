import type { Project } from "@/types/portfolio";

export const PROJECTS: Project[] = [
  {
    title: "KriegerDataForge",
    subtitle: "Full-Stack Platform",
    description:
      "A personal full-stack platform that powers all the applications I build. A shared FastAPI backend and PostgreSQL database serve data to multiple front-end apps — including a Calorie Tracker and a Video Game Database — with a single, unified API layer.",
    techStack: [
      "Next.js",
      "React",
      "TypeScript",
      "TailwindCSS",
      "FastAPI",
      "Python",
      "PostgreSQL",
      "Alembic",
    ],
    links: {
      github: "https://github.com/Needless2Say",
      youtube: [
        "https://www.youtube.com/embed/emxHI2ybPJ4?si=MjbDHFItsyvVzN-y",
        "https://www.youtube.com/embed/j3F10BulHSs?si=Dq08f0ymaPxngzs5",
      ],
    },
    featured: true,
  },
  {
    title: "Calorie Tracker",
    subtitle: "Web Application",
    description:
      "A nutrition tracking app built on the KriegerDataForge platform. Log meals, track macros, set daily goals, and visualize your progress — all powered by the shared FastAPI backend.",
    techStack: ["Next.js", "React", "FastAPI", "PostgreSQL"],
    links: {
      youtube: ["https://www.youtube.com/embed/j3F10BulHSs?si=Dq08f0ymaPxngzs5"],
    },
    featured: false,
  },
];
