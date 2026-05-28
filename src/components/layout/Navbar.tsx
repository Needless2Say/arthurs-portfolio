"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_LINKS } from "@/constants/routes";
import { cn } from "@/utils/cn";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
      {/* ── Desktop ── */}
      <div className="hidden sm:flex items-center gap-0.5 rounded-2xl bg-slate-900/85 backdrop-blur-xl border border-slate-600/40 px-2 py-1.5 shadow-xl shadow-black/30">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.name}
            href={link.path}
            className={cn(
              "relative px-4 py-1.5 text-sm font-semibold rounded-full select-none",
              "transition-all duration-200 ease-out",
              "hover:scale-105 active:scale-95",
              isActive(link.path)
                ? [
                    "text-yellow-300 bg-purple-600/30",
                    "border border-purple-500/40",
                    "shadow-[0_0_12px_rgba(124,58,237,0.35)]",
                    "hover:bg-purple-600/40 hover:shadow-[0_0_18px_rgba(124,58,237,0.5)]",
                  ].join(" ")
                : [
                    "text-slate-200 border border-transparent",
                    "hover:text-white hover:bg-white/10 hover:border-white/10",
                  ].join(" ")
            )}
          >
            {link.name}
            {isActive(link.path) && (
              <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.8)]" />
            )}
          </Link>
        ))}
      </div>

      {/* ── Mobile ── */}
      <div className="sm:hidden w-full">
        <div className="flex items-center justify-between rounded-xl bg-slate-900/85 backdrop-blur-xl border border-slate-600/40 px-4 py-3 shadow-xl shadow-black/30">
          <span className="text-white font-bold font-mono text-sm tracking-widest">AK</span>
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
            aria-expanded={open}
            className="flex flex-col gap-1 p-1 text-slate-200 hover:text-white transition-colors duration-200"
          >
            <span
              className={cn(
                "block w-5 h-0.5 bg-current transition-all duration-300 origin-center",
                open && "rotate-45 translate-y-1.5"
              )}
            />
            <span
              className={cn(
                "block w-5 h-0.5 bg-current transition-all duration-300",
                open && "opacity-0 scale-x-0"
              )}
            />
            <span
              className={cn(
                "block w-5 h-0.5 bg-current transition-all duration-300 origin-center",
                open && "-rotate-45 -translate-y-1.5"
              )}
            />
          </button>
        </div>

        {open && (
          <div className="mt-1 rounded-xl bg-slate-900/90 backdrop-blur-xl border border-slate-600/40 py-2 shadow-xl shadow-black/30">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                onClick={() => setOpen(false)}
                className={cn(
                  "block px-4 py-2.5 text-sm font-semibold select-none",
                  "transition-all duration-200 ease-out active:scale-95",
                  isActive(link.path)
                    ? "text-yellow-300 bg-purple-600/25"
                    : "text-slate-200 hover:text-white hover:bg-white/8"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
