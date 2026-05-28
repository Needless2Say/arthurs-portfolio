import type { Metadata } from "next";
import Image from "next/image";
import me_pic from "@/../public/me_pic.jpg";
import { PERSONAL_INFO, EDUCATION, EXPERIENCE } from "@/constants/personal-info";
import { SKILL_GROUPS } from "@/constants/skills";
import SectionHeader from "@/components/ui/SectionHeader";
import TechBadge from "@/components/ui/TechBadge";
import Card from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Arthur Krieger — CS + Data Science, University of Michigan.",
};

export default function About() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* ── Hero: Photo + Bio ── */}
        <div className="flex flex-col lg:flex-row gap-10 mb-16 items-start">
          <div className="flex-shrink-0 mx-auto lg:mx-0">
            <div className="relative w-44 h-60 rounded-xl overflow-hidden border border-purple-500/20 shadow-[0_0_40px_rgba(124,58,237,0.15)]">
              <Image
                src={me_pic}
                alt="Arthur Krieger"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex-grow">
            <h1 className="text-4xl font-bold text-white glow-text mb-1">{PERSONAL_INFO.name}</h1>
            <p className="text-purple-400 font-mono text-sm mb-5">{PERSONAL_INFO.title}</p>
            <p className="text-slate-300 text-base leading-relaxed mb-6">{PERSONAL_INFO.bio}</p>

            <div className="glass-card p-4 border-white/5">
              <p className="text-slate-500 font-mono text-xs uppercase tracking-widest mb-3">
                Notable Coursework
              </p>
              <div className="flex flex-wrap gap-2">
                {EDUCATION[0].coursework.map((course) => (
                  <TechBadge key={course} label={course.split(" – ")[0]} color="nebula" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Experience Timeline ── */}
        <section className="mb-16">
          <SectionHeader title="Experience" />
          <div className="relative">
            <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-purple-600/50 via-blue-600/30 to-transparent" />
            <div className="space-y-6">
              {EXPERIENCE.map((exp, i) => (
                <div key={i} className="relative pl-12">
                  <div className="absolute left-4 top-5 w-4 h-4 rounded-full bg-[#09090f] border-2 border-purple-500 -translate-x-1/2 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  </div>
                  <Card glow="purple">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                      <div>
                        <h3 className="text-white font-bold text-base">{exp.role}</h3>
                        <p className="text-purple-300 text-sm font-medium">{exp.company}</p>
                        <p className="text-slate-500 text-xs">{exp.location}</p>
                      </div>
                      <span className="text-slate-400 font-mono text-xs mt-1 sm:mt-0 sm:text-right whitespace-nowrap">
                        {exp.period}
                      </span>
                    </div>
                    <ul className="space-y-1.5 mb-4">
                      {exp.bullets.map((bullet, j) => (
                        <li key={j} className="text-slate-400 text-sm flex gap-2">
                          <span className="text-purple-500 mt-0.5 flex-shrink-0">›</span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-1.5">
                      {exp.tech.map((t) => (
                        <TechBadge key={t} label={t} color="nebula" />
                      ))}
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Education ── */}
        <section className="mb-16">
          <SectionHeader title="Education" />
          <div className="grid gap-4">
            {EDUCATION.map((edu, i) => (
              <Card key={i} glow="blue">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                  <div>
                    <h3 className="text-white font-bold">{edu.school}</h3>
                    <p className="text-blue-300 text-sm mt-0.5">{edu.degree}</p>
                    {edu.minor && <p className="text-slate-400 text-sm">{edu.minor}</p>}
                    {edu.honors && (
                      <p className="text-yellow-400 text-sm font-medium mt-1">{edu.honors}</p>
                    )}
                  </div>
                  <div className="text-right mt-2 sm:mt-0 flex-shrink-0">
                    <p className="text-slate-400 font-mono text-xs">{edu.period}</p>
                    <p className="text-slate-500 text-xs">{edu.location}</p>
                    <p className="text-yellow-400 font-mono text-xs mt-1">GPA {edu.gpa}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* ── Skills ── */}
        <section>
          <SectionHeader title="Skills" />
          <div className="space-y-5">
            {SKILL_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="text-slate-500 font-mono text-xs uppercase tracking-widest mb-2">
                  {group.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <TechBadge key={skill} label={skill} color={group.color} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
