"use client";

import { useEffect, useRef, useState } from "react";
import HyperdriveCanvas from "./HyperdriveCanvas";
import BlackHoleCanvas  from "./BlackHoleCanvas";
import WormholeCanvas   from "./WormholeCanvas";
import PulsarCanvas     from "./PulsarCanvas";
import NebulaCanvas     from "./NebulaCanvas";
import FalconCanvas     from "./FalconCanvas";

const STORAGE_KEY = "home_loader_v2";
const DISPLAY_MS  = 2500;
const FADE_MS     = 700;

// ── Sub-animations ────────────────────────────────────────────
// Add new entries here; probability = 1/ANIMATIONS.length automatically.

function PlanetAnimation() {
	return (
		<div className="relative flex items-center justify-center w-44 h-44">
			{/* Expanding pulse rings — 3 staggered */}
			{[0, 1.2, 2.4].map((delay) => (
				<div
					key={delay}
					className="absolute w-16 h-16 rounded-full border border-blue-400/50"
					style={{ animation: `space-ring-expand 3.6s ease-out ${delay}s infinite` }}
				/>
			))}

			{/* Outer orbit track + cyan dot */}
			<div className="absolute w-40 h-40 rounded-full border border-white/5 animate-orbit-cw-lg">
				<div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-yellow-300 shadow-[0_0_8px_rgba(253,224,71,0.9)]" />
			</div>

			{/* Middle orbit track + purple dot */}
			<div className="absolute w-28 h-28 rounded-full border border-white/5 animate-orbit-cw-md">
				<div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-300 shadow-[0_0_6px_rgba(147,197,253,0.9)]" />
			</div>

			{/* Inner orbit track + white dot (counter-clockwise) */}
			<div className="absolute w-20 h-20 rounded-full border border-white/5 animate-orbit-ccw-sm">
				<div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white shadow-[0_0_4px_rgba(255,255,255,0.9)]" />
			</div>

			{/* Center planet */}
			<div
				className="relative w-14 h-14 rounded-full animate-orb-breathe"
				style={{
					background: "radial-gradient(circle at 38% 32%, #93c5fd 0%, #2563eb 45%, #1e3a8a 100%)",
					boxShadow: "0 0 28px rgba(37,99,235,0.7), 0 0 60px rgba(37,99,235,0.3), 0 0 100px rgba(37,99,235,0.1)",
				}}
			>
				<div
					className="absolute inset-0 -mx-4 rounded-full border-2 border-blue-400/35"
					style={{ top: "50%", transform: "translateY(-50%) rotateX(72deg)" }}
				/>
				<div
					className="absolute w-4 h-3 rounded-full bg-white/20 blur-sm"
					style={{ top: "18%", left: "22%" }}
				/>
			</div>
		</div>
	);
}

function HyperdriveAnimation() {
	return <HyperdriveCanvas />;
}

// Each entry: the animation component + the eyebrow label.
// `fill` = canvas animations that paint the whole viewport; non-fill (the CSS
// PlanetAnimation) is centered and scaled up to read at full-screen size.
const ANIMATIONS: Array<{ label: string; fill: boolean; Component: () => React.JSX.Element }> = [
	{ label: "◇ initializing systems ◇",   fill: false, Component: PlanetAnimation },
	{ label: "◇ entering hyperspace ◇",    fill: true,  Component: HyperdriveAnimation },
	{ label: "◇ event horizon detected ◇", fill: true,  Component: () => <BlackHoleCanvas /> },
	{ label: "◇ wormhole opening ◇",        fill: true,  Component: () => <WormholeCanvas /> },
	{ label: "◇ pulsar signal acquired ◇",  fill: true,  Component: () => <PulsarCanvas /> },
	{ label: "◇ nebula sector ◇",           fill: true,  Component: () => <NebulaCanvas /> },
	{ label: "◇ punch it chewie ◇",         fill: true,  Component: () => <FalconCanvas /> },
];

// ── Loader ────────────────────────────────────────────────────

// Deterministic star positions so SSR and client match (no Math.random at module level)
const STARS = [
	{ top: "10%", left: "12%", delay: "0s",   dur: "2.1s" },
	{ top: "18%", left: "78%", delay: "0.4s", dur: "1.7s" },
	{ top: "72%", left: "8%",  delay: "0.9s", dur: "2.4s" },
	{ top: "80%", left: "82%", delay: "0.2s", dur: "1.9s" },
	{ top: "35%", left: "92%", delay: "1.1s", dur: "2.8s" },
	{ top: "55%", left: "5%",  delay: "0.6s", dur: "2.2s" },
	{ top: "8%",  left: "48%", delay: "1.4s", dur: "1.6s" },
	{ top: "88%", left: "44%", delay: "0.3s", dur: "3.0s" },
	{ top: "45%", left: "96%", delay: "1.8s", dur: "2.5s" },
	{ top: "62%", left: "90%", delay: "0.7s", dur: "1.8s" },
	{ top: "25%", left: "3%",  delay: "1.2s", dur: "2.0s" },
	{ top: "90%", left: "18%", delay: "0.5s", dur: "2.7s" },
];

export default function HomeLoader() {
	const [phase, setPhase]         = useState<"hidden" | "visible" | "fading">("hidden");
	const [animIndex, setAnimIndex] = useState(0);
	const fadeIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const hideIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		if (sessionStorage.getItem(STORAGE_KEY)) return;

		// Pick animation randomly — equal probability for each entry
		setAnimIndex(Math.floor(Math.random() * ANIMATIONS.length));
		setPhase("visible");

		fadeIdRef.current = setTimeout(() => setPhase("fading"), DISPLAY_MS);
		hideIdRef.current = setTimeout(() => {
			setPhase("hidden");
			sessionStorage.setItem(STORAGE_KEY, "1");
			window.dispatchEvent(new CustomEvent("loader-done"));
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
		window.dispatchEvent(new CustomEvent("loader-done"));
		hideIdRef.current = setTimeout(() => {
			setPhase("hidden");
			sessionStorage.setItem(STORAGE_KEY, "1");
		}, FADE_MS);
	}

	if (phase === "hidden") return null;

	const { label, fill, Component } = ANIMATIONS[animIndex];

	return (
		<div
			onClick={dismiss}
			className={`fixed inset-0 z-[200] overflow-hidden bg-black cursor-pointer select-none transition-opacity duration-700 ${
				phase === "fading" ? "opacity-0" : "opacity-100"
			}`}
		>
			{/* Full-screen animation layer */}
			{fill ? (
				<div className="absolute inset-0">
					<Component />
				</div>
			) : (
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="scale-[2.6] sm:scale-[3.6]">
						<Component />
					</div>
				</div>
			)}

			{/* Scattered ambient stars (subtle, over the animation) */}
			{STARS.map((s, i) => (
				<span
					key={i}
					className="absolute z-[5] w-0.5 h-0.5 rounded-full bg-white"
					style={{
						top: s.top, left: s.left,
						animation: `star-blink ${s.dur} ease-in-out ${s.delay} infinite`,
					}}
				/>
			))}

			{/* Top loading bar — thick, full width, fills over the load duration */}
			<div
				className="absolute top-0 left-0 right-0 z-10 h-1.5"
				style={{
					background: "linear-gradient(90deg, #2563eb 0%, #facc15 100%)",
					boxShadow: "0 0 14px rgba(37,99,235,0.55)",
				}}
			>
				{/* Dark mask shrinks right→left, revealing the gradient */}
				<div
					className="absolute right-0 top-0 h-full bg-black"
					style={{ animation: `energy-bar-mask ${DISPLAY_MS}ms linear forwards` }}
				/>
			</div>

			{/* Eyebrow — changes per animation */}
			<p className="absolute top-7 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] sm:text-xs tracking-[0.45em] uppercase text-blue-300/80 [text-shadow:0_0_12px_rgba(0,0,0,0.95)]">
				{label}
			</p>

			{/* Status + skip hint */}
			<div className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-center">
				<p className="font-mono text-[10px] tracking-[0.35em] uppercase text-blue-300/70 animate-pulse [text-shadow:0_0_12px_rgba(0,0,0,0.95)]">
					LOADING...
				</p>
				<p className="font-mono text-[10px] tracking-widest uppercase text-slate-500 [text-shadow:0_0_12px_rgba(0,0,0,0.95)]">
					tap anywhere to skip
				</p>
			</div>
		</div>
	);
}
