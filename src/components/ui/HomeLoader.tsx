"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "home_loader_v2";
const DISPLAY_MS  = 2500;
const FADE_MS     = 700;

// Deterministic star positions so SSR and client match (no Math.random)
const STARS = [
	{ top: "10%",  left: "12%",  delay: "0s",     dur: "2.1s" },
	{ top: "18%",  left: "78%",  delay: "0.4s",   dur: "1.7s" },
	{ top: "72%",  left: "8%",   delay: "0.9s",   dur: "2.4s" },
	{ top: "80%",  left: "82%",  delay: "0.2s",   dur: "1.9s" },
	{ top: "35%",  left: "92%",  delay: "1.1s",   dur: "2.8s" },
	{ top: "55%",  left: "5%",   delay: "0.6s",   dur: "2.2s" },
	{ top: "8%",   left: "48%",  delay: "1.4s",   dur: "1.6s" },
	{ top: "88%",  left: "44%",  delay: "0.3s",   dur: "3.0s" },
	{ top: "45%",  left: "96%",  delay: "1.8s",   dur: "2.5s" },
	{ top: "62%",  left: "90%",  delay: "0.7s",   dur: "1.8s" },
	{ top: "25%",  left: "3%",   delay: "1.2s",   dur: "2.0s" },
	{ top: "90%",  left: "18%",  delay: "0.5s",   dur: "2.7s" },
];

export default function HomeLoader() {
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
			{/* Scattered background stars */}
			{STARS.map((s, i) => (
				<span
					key={i}
					className="absolute w-0.5 h-0.5 rounded-full bg-white"
					style={{
						top: s.top, left: s.left,
						animation: `star-blink ${s.dur} ease-in-out ${s.delay} infinite`,
					}}
				/>
			))}

			{/* Card */}
			<div className="relative flex flex-col items-center rounded-2xl border border-purple-500/25 bg-black/70 px-10 pt-8 pb-7 shadow-[0_0_80px_rgba(124,58,237,0.12)]">
				{/* HUD corners */}
				<span className="pointer-events-none absolute -top-px -left-px  w-4 h-4 border-t-2 border-l-2 rounded-tl-xl border-purple-400/60" />
				<span className="pointer-events-none absolute -top-px -right-px w-4 h-4 border-t-2 border-r-2 rounded-tr-xl border-purple-400/60" />
				<span className="pointer-events-none absolute -bottom-px -left-px  w-4 h-4 border-b-2 border-l-2 rounded-bl-xl border-purple-400/60" />
				<span className="pointer-events-none absolute -bottom-px -right-px w-4 h-4 border-b-2 border-r-2 rounded-br-xl border-purple-400/60" />

				{/* Eyebrow */}
				<p className="font-mono text-[9px] tracking-[0.45em] uppercase text-purple-400/60 mb-6">
					◇ initializing systems ◇
				</p>

				{/* ── Space animation ── */}
				<div className="relative flex items-center justify-center w-44 h-44 mb-6">

					{/* Expanding pulse rings — 3 staggered */}
					{[0, 1.2, 2.4].map((delay) => (
						<div
							key={delay}
							className="absolute w-16 h-16 rounded-full border border-purple-400/50"
							style={{ animation: `space-ring-expand 3.6s ease-out ${delay}s infinite` }}
						/>
					))}

					{/* Outer orbit track + cyan dot */}
					<div className="absolute w-40 h-40 rounded-full border border-white/5 animate-orbit-cw-lg">
						<div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.9)]" />
					</div>

					{/* Middle orbit track + purple dot */}
					<div className="absolute w-28 h-28 rounded-full border border-white/5 animate-orbit-cw-md">
						<div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-purple-300 shadow-[0_0_6px_rgba(196,181,253,0.9)]" />
					</div>

					{/* Inner orbit track + white dot (counter-clockwise) */}
					<div className="absolute w-20 h-20 rounded-full border border-white/5 animate-orbit-ccw-sm">
						<div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white shadow-[0_0_4px_rgba(255,255,255,0.9)]" />
					</div>

					{/* Center planet */}
					<div
						className="relative w-14 h-14 rounded-full animate-orb-breathe"
						style={{
							background: "radial-gradient(circle at 38% 32%, #c4b5fd 0%, #7c3aed 45%, #1e1b4b 100%)",
							boxShadow: "0 0 28px rgba(124,58,237,0.7), 0 0 60px rgba(124,58,237,0.3), 0 0 100px rgba(124,58,237,0.1)",
						}}
					>
						{/* Saturn-style equatorial ring */}
						<div
							className="absolute inset-0 -mx-4 rounded-full border-2 border-purple-400/35"
							style={{ top: "50%", transform: "translateY(-50%) rotateX(72deg)" }}
						/>
						{/* Surface highlight */}
						<div
							className="absolute w-4 h-3 rounded-full bg-white/20 blur-sm"
							style={{ top: "18%", left: "22%" }}
						/>
					</div>
				</div>

				{/* Energy bar */}
				<div className="w-48 sm:w-56 h-1 rounded-full bg-white/5 overflow-hidden">
					<div
						className="h-full rounded-full bg-gradient-to-r from-purple-600 via-cyan-400 to-purple-600"
						style={{ animation: `energy-bar ${DISPLAY_MS}ms linear forwards` }}
					/>
				</div>

				{/* Status */}
				<p className="mt-3 font-mono text-[10px] tracking-[0.35em] uppercase text-purple-300/50 animate-pulse">
					LOADING...
				</p>
			</div>

			{/* Skip hint */}
			<p className="mt-8 text-slate-700 font-mono text-[10px] tracking-widest uppercase">
				tap anywhere to skip
			</p>
		</div>
	);
}
