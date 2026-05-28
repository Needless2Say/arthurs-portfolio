import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { PERSONAL_INFO } from "@/constants/personal-info";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-8">
      <div className="text-center max-w-3xl mx-auto">
        {/* Eyebrow */}
        <p
          className="text-purple-400 font-mono text-xs tracking-[0.25em] uppercase mb-6 animate-fade-in"
          style={{ animationDelay: "0s" }}
        >
          Software Engineer · Ann Arbor → Chicago
        </p>

        {/* Name */}
        <h1
          className="text-6xl sm:text-7xl md:text-8xl font-bold text-white glow-text leading-tight mb-2 animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          Arthur
        </h1>
        <h1
          className="text-6xl sm:text-7xl md:text-8xl font-bold gradient-text leading-tight mb-8 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          Krieger
        </h1>

        {/* Tagline */}
        <p
          className="text-slate-300 text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-10 animate-fade-in-up"
          style={{ animationDelay: "0.35s" }}
        >
          {PERSONAL_INFO.tagline}
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-fade-in-up"
          style={{ animationDelay: "0.5s" }}
        >
          <Link
            href={ROUTES.PROJECTS}
            className="px-8 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-all duration-300 hover:shadow-[0_0_24px_rgba(124,58,237,0.5)] w-full sm:w-auto text-center text-sm"
          >
            View My Work
          </Link>
          <Link
            href={ROUTES.ABOUT}
            className="px-8 py-3 rounded-full border border-white/15 hover:border-white/35 text-slate-300 hover:text-white font-semibold transition-all duration-300 w-full sm:w-auto text-center text-sm"
          >
            About Me
          </Link>
        </div>

        {/* Scroll indicator */}
        <div
          className="flex flex-col items-center gap-2 animate-fade-in"
          style={{ animationDelay: "0.8s" }}
        >
          <span className="text-slate-600 font-mono text-xs tracking-widest">scroll</span>
          <div className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center pt-1.5 animate-pulse-glow">
            <div className="w-0.5 h-1.5 rounded-full bg-purple-500 animate-float" />
          </div>
        </div>
      </div>
    </div>
  );
}
