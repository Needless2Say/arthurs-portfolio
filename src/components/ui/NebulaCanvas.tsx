"use client";
import { useEffect, useRef } from "react";
import { setupFullscreenCanvas } from "@/utils/fullscreenCanvas";

interface Cloud { x: number; y: number; r: number; hue: number; sat: number; lum: number; base: number; px: number; py: number }

export default function NebulaCanvas() {
	const ref = useRef<HTMLCanvasElement>(null);
	useEffect(() => {
		const cv = ref.current; if (!cv) return;
		const ctx = cv.getContext("2d"); if (!ctx) return;
		const c = ctx;
		const { dims, cleanup } = setupFullscreenCanvas(cv);

		const W0 = dims.w, H0 = dims.h;
		const S = Math.max(W0 / 320, H0 / 200);
		const rnd = () => Math.random();

		const cloudCount = Math.round(16 * Math.min(3, S));
		const CLOUDS: Cloud[] = Array.from({ length: cloudCount }, () => ({
			x: rnd() * W0, y: rnd() * H0, r: (35 + rnd() * 75) * S,
			hue: 210 + rnd() * 150, sat: 55 + rnd() * 35, lum: 38 + rnd() * 28,
			base: 0.03 + rnd() * 0.09,
			px: (rnd() - 0.5) * 5, py: (rnd() - 0.5) * 4,
		}));

		const starCount = Math.round(Math.min(900, (W0 * H0) / 3200));
		const STARS: [number, number, number, number][] = Array.from({ length: starCount }, () => [
			rnd() * W0, rnd() * H0, 0.25 + rnd() * 0.75, rnd() * Math.PI * 2,
		]);

		const CLUSTERS: [number, number, number][] = [
			[W0 * 0.28, H0 * 0.32, 0],
			[W0 * 0.62, H0 * 0.58, 1.1],
			[W0 * 0.52, H0 * 0.22, 2.3],
			[W0 * 0.75, H0 * 0.38, 0.7],
		];

		let last: number | null = null, time = 0, id: number;

		function frame(ts: number) {
			if (last === null) last = ts;
			const dt = Math.min((ts - last) / 1000, 0.05); last = ts;
			time += dt;
			const W = dims.w, H = dims.h;

			c.fillStyle = "#00000e"; c.fillRect(0, 0, W, H);

			// Gas clouds — multiple layered radial gradients with slow drift
			for (const cl of CLOUDS) {
				const ox = Math.sin(time * 0.11 + cl.px) * 14 * S;
				const oy = Math.cos(time * 0.085 + cl.py) * 10 * S;
				// Secondary hue shift for depth
				const hShift = Math.sin(time * 0.06 + cl.base * 10) * 18;

				const g = c.createRadialGradient(cl.x + ox, cl.y + oy, 0, cl.x + ox, cl.y + oy, cl.r);
				g.addColorStop(0,   `hsla(${cl.hue + hShift},${cl.sat}%,${cl.lum}%,${cl.base * 1.6})`);
				g.addColorStop(0.45, `hsla(${cl.hue + hShift},${cl.sat}%,${cl.lum}%,${cl.base})`);
				g.addColorStop(1,   `hsla(${cl.hue + hShift},${cl.sat}%,${cl.lum}%,0)`);
				c.fillStyle = g;
				c.beginPath(); c.arc(cl.x + ox, cl.y + oy, cl.r, 0, Math.PI * 2); c.fill();
			}

			// Background stars (twinkling)
			for (const [sx, sy, a, phase] of STARS) {
				const twinkle = 0.4 + 0.6 * Math.abs(Math.sin(time * 1.6 + phase));
				c.fillStyle = `rgba(225,230,255,${a * twinkle * 0.65})`;
				c.fillRect(sx | 0, sy | 0, sx % 7 === 0 ? 2 : 1, sy % 9 === 0 ? 2 : 1);
			}

			// Bright cluster glows
			for (const [cx, cy, phase] of CLUSTERS) {
				const pulse = 0.35 + 0.2 * Math.sin(time * 1.4 + phase);
				const g = c.createRadialGradient(cx, cy, 0, cx, cy, 22 * S);
				g.addColorStop(0, `rgba(255,255,255,${pulse})`);
				g.addColorStop(0.3, `rgba(220,235,255,${pulse * 0.5})`);
				g.addColorStop(1, "rgba(180,200,255,0)");
				c.fillStyle = g; c.beginPath(); c.arc(cx, cy, 22 * S, 0, Math.PI * 2); c.fill();
			}

			// Faint nebula filaments (thin bright streaks)
			c.globalAlpha = 0.06 + 0.04 * Math.sin(time * 0.3);
			c.strokeStyle = "rgba(180,160,255,1)";
			c.lineWidth = Math.max(0.5, 0.5 * S);
			for (let i = 0; i < 5; i++) {
				const a   = (i / 5) * Math.PI + time * 0.04;
				const len = (60 + i * 15) * S;
				const sx  = W * 0.35 + Math.cos(a + 0.5) * 30 * S;
				const sy  = H * 0.45 + Math.sin(a + 0.5) * 20 * S;
				c.beginPath();
				c.moveTo(sx, sy);
				c.bezierCurveTo(sx + Math.cos(a) * len * 0.4, sy + Math.sin(a) * len * 0.4,
					sx + Math.cos(a + 0.3) * len * 0.7, sy + Math.sin(a + 0.3) * len * 0.7,
					sx + Math.cos(a + 0.5) * len, sy + Math.sin(a + 0.5) * len);
				c.stroke();
			}
			c.globalAlpha = 1;

			id = requestAnimationFrame(frame);
		}

		id = requestAnimationFrame(frame);
		return () => { cancelAnimationFrame(id); cleanup(); };
	}, []);

	return <canvas ref={ref} className="block w-full h-full" style={{ imageRendering: "auto" }} />;
}
