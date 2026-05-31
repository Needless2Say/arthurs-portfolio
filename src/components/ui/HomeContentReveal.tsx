"use client";

import { useEffect, useState } from "react";

// must match STORAGE_KEY + DISPLAY_MS + FADE_MS in HomeLoader.tsx
const STORAGE_KEY  = "home_loader_v2";
const REVEAL_MS    = 2500 + 700 + 0; // DISPLAY_MS + FADE_MS + 0.05s gap

export default function HomeContentReveal({ children }: { children: React.ReactNode }) {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		if (sessionStorage.getItem(STORAGE_KEY)) {
			setVisible(true);
			return;
		}

		// Fallback timer in case the event never fires
		const t = setTimeout(() => setVisible(true), REVEAL_MS);

		// Reveal immediately when loader signals done (natural end or skip click)
		const onDone = () => {
			clearTimeout(t);
			setVisible(true);
		};
		window.addEventListener("loader-done", onDone);

		return () => {
			clearTimeout(t);
			window.removeEventListener("loader-done", onDone);
		};
	}, []);

	return (
		<div className={`transition-opacity duration-700 ${visible ? "opacity-100" : "opacity-0"}`}>
			{children}
		</div>
	);
}