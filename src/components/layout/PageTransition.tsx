"use client";

import { usePathname } from "next/navigation";
import { useRef } from "react";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Synchronous sessionStorage check via ref so the correct class is applied
  // on the very first render — avoids a flash of un-animated content.
  const prevPathname = useRef<string | null>(null);
  const shouldAnimate = useRef(false);

  if (prevPathname.current !== pathname) {
    prevPathname.current = pathname;
    if (typeof window !== "undefined") {
      const key = `pt_${pathname}`;
      const seen = !!sessionStorage.getItem(key);
      if (!seen) sessionStorage.setItem(key, "1");
      shouldAnimate.current = !seen;
    }
  }

  // key={pathname} remounts the div on every navigation so the CSS animation
  // replays from the start. shouldAnimate gates whether the class is applied.
  return (
    <div key={pathname} className={shouldAnimate.current ? "animate-page-enter" : undefined}>
      {children}
    </div>
  );
}
