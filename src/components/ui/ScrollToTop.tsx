"use client";

import { useEffect, useState } from "react";

export default function ScrollToTop() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const check = () => setVisible(window.scrollY > 400);
		window.addEventListener("scroll", check, { passive: true });
		return () => window.removeEventListener("scroll", check);
	}, []);

	if (!visible) return null;

	return (
		<button
			onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
			aria-label="Scroll to top"
			className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full glass-card flex items-center justify-center text-slate-400 hover:text-white border border-blue-500/20 hover:border-blue-400/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:-translate-y-0.5 animate-fade-in"
		>
			<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
				<path d="M18 15l-6-6-6 6" />
			</svg>
		</button>
	);
}
