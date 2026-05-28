"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";

interface RevealProps {
	children: React.ReactNode;
	delay?: number;
	className?: string;
}

export default function Reveal({ children, delay = 0, className }: RevealProps) {
	const ref = useRef<HTMLDivElement>(null);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const key = `rv_${window.location.pathname}`;

		// page was already visited this session — show instantly, no animation
		if (sessionStorage.getItem(key)) {
			setVisible(true);
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setVisible(true);
					observer.unobserve(el);
				}
			},
			{ threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
		);

		observer.observe(el);

		return () => {
			// when user navigates away, mark page as seen so animations
			// don't replay on return visits within same browser session
			observer.disconnect();
			sessionStorage.setItem(key, '1');
		};
	}, []);

	return (
		<div
			ref={ref}
			className={cn(visible ? "animate-warp-in" : "opacity-0", className)}
			style={delay > 0 ? { animationDelay: `${delay}ms` } : undefined}
		>
			{children}
		</div>
	);
}