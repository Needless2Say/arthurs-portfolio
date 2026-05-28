"use client";

import { usePathname } from "next/navigation";
import { useRef } from "react";

export default function PageTransition({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();

	// synchronous sessionStorage check via ref so correct class is applied on first render
	// avoids a flash of un-animated content
	const prevPathname = useRef<string | null>(null);
	const shouldAnimate = useRef(false);

	if (prevPathname.current !== pathname) {
		prevPathname.current = pathname;

		// check if we've seen this page before in sessionStorage
		// if not, mark it as seen and allow animation
		// if yes, skip animation
		if (typeof window !== "undefined") {
			const key = `pt_${pathname}`;
			const seen = !!sessionStorage.getItem(key);

		if (!seen) sessionStorage.setItem(key, "1");
			shouldAnimate.current = !seen;
		}
	}

	// key={pathname} remounts div on every navigation so CSS animation replays from start
	// shouldAnimate gates whether class is applied
	return (
		<div key={pathname} className={shouldAnimate.current ? "animate-page-enter" : undefined}>
			{children}
		</div>
	);
}