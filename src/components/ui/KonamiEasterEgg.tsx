"use client";

import { useEffect, useRef, useState } from "react";
import GokuCanvas, { LOOP_MS as GOKU_LOOP_MS } from "./GokuCanvas";

const KONAMI = [
	"ArrowUp", "ArrowUp",
	"ArrowDown", "ArrowDown",
	"ArrowLeft", "ArrowRight",
	"ArrowLeft", "ArrowRight",
	"b", "a",
] as const;

const FADE_MS = 700;

export default function KonamiEasterEgg() {
	const [visible, setVisible] = useState(false);
	const [fading, setFading] = useState(false);
	const bufferRef = useRef<string[]>([]);
	const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		function clearTimers() {
			if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
			if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
		}

		function trigger() {
			clearTimers();
			setFading(false);
			setVisible(true);
			fadeTimerRef.current = setTimeout(() => setFading(true), GOKU_LOOP_MS);
			hideTimerRef.current = setTimeout(() => {
				setVisible(false);
				setFading(false);
			}, GOKU_LOOP_MS + FADE_MS);
		}

		function onKey(e: KeyboardEvent) {
			// Skip if typing in an input
			const target = e.target as HTMLElement | null;
			if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;

			const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
			bufferRef.current.push(key);
			if (bufferRef.current.length > KONAMI.length) {
				bufferRef.current.shift();
			}

			if (bufferRef.current.length === KONAMI.length) {
				const matches = bufferRef.current.every((k, i) => k === KONAMI[i]);
				if (matches) {
					bufferRef.current = [];
					trigger();
				}
			}
		}

		window.addEventListener("keydown", onKey);
		return () => {
			window.removeEventListener("keydown", onKey);
			clearTimers();
		};
	}, []);

	function dismiss() {
		if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
		if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
		setFading(true);
		hideTimerRef.current = setTimeout(() => {
			setVisible(false);
			setFading(false);
		}, FADE_MS);
	}

	if (!visible) return null;

	return (
		<div
			onClick={dismiss}
			className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black cursor-pointer select-none transition-opacity duration-700 ${
				fading ? "opacity-0" : "opacity-100"
			}`}
		>
			{/* Achievement banner */}
			<div className="mb-6 text-center">
				<p className="text-yellow-400 font-mono text-[10px] tracking-[0.4em] uppercase mb-1 animate-pulse">
					✦ achievement unlocked ✦
				</p>
				<p className="text-white font-bold text-xl glow-text">
					POWER LEVEL: OVER 9000
				</p>
			</div>

			<GokuCanvas />

			<p className="text-slate-600 font-mono text-xs mt-6 animate-pulse tracking-widest">
				tap anywhere to dismiss
			</p>
		</div>
	);
}
