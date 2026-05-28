"use client";

import { useEffect, useRef } from "react";

export default function ScrollProgress() {
	const barRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const update = () => {
			if (!barRef.current) return;
			const total = document.documentElement.scrollHeight - window.innerHeight;
			const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
			barRef.current.style.width = `${pct}%`;
		};
		window.addEventListener("scroll", update, { passive: true });
		update();
		return () => window.removeEventListener("scroll", update);
	}, []);

	return (
		<div className="fixed top-0 left-0 right-0 h-[2px] z-[60] bg-transparent pointer-events-none">
			<div
				ref={barRef}
				className="h-full bg-gradient-to-r from-purple-600 via-blue-400 to-purple-500"
				style={{ width: "0%" }}
			/>
		</div>
	);
}
