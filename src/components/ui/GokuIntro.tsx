"use client";

import { useEffect, useRef, useState } from "react";
import GokuCanvas, { LOOP_MS as GOKU_LOOP_MS } from "./GokuCanvas";

const STORAGE_KEY = "goku_intro_played";
const DISPLAY_MS  = GOKU_LOOP_MS; // matches GokuCanvas loop duration
const FADE_MS     = 700;

export default function GokuIntro() {
	const [phase, setPhase] = useState<"hidden" | "visible" | "fading">("hidden");
	const fadeIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const hideIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		if (sessionStorage.getItem(STORAGE_KEY)) return;
		setPhase("visible");

		fadeIdRef.current = setTimeout(() => setPhase("fading"), DISPLAY_MS);
		hideIdRef.current = setTimeout(() => {
			setPhase("hidden");
			sessionStorage.setItem(STORAGE_KEY, "1");
		}, DISPLAY_MS + FADE_MS);

		return () => {
			if (fadeIdRef.current) clearTimeout(fadeIdRef.current);
			if (hideIdRef.current) clearTimeout(hideIdRef.current);
		};
	}, []);

	function dismiss() {
		if (fadeIdRef.current) clearTimeout(fadeIdRef.current);
		if (hideIdRef.current) clearTimeout(hideIdRef.current);
		setPhase("fading");
		hideIdRef.current = setTimeout(() => {
			setPhase("hidden");
			sessionStorage.setItem(STORAGE_KEY, "1");
		}, FADE_MS);
	}

	if (phase === "hidden") return null;

	return (
		<div
			onClick={dismiss}
			className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black cursor-pointer select-none transition-opacity duration-700 ${
				phase === "fading" ? "opacity-0" : "opacity-100"
			}`}
		>
			<GokuCanvas />
			<p className="text-slate-600 font-mono text-xs mt-4 animate-pulse tracking-widest">
				tap anywhere to skip
			</p>
		</div>
	);
}
