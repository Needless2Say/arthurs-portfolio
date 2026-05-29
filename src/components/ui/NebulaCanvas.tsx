"use client";
import { useEffect, useRef } from "react";

const W = 320, H = 200;

// Seeded positions so they're identical on every load
let _s = 55;
const sr = () => { _s = ((_s * 1664525 + 1013904223) >>> 0); return _s / 0xffffffff; };

interface Cloud { x: number; y: number; r: number; hue: number; sat: number; lum: number; base: number; px: number; py: number }
const CLOUDS: Cloud[] = Array.from({ length: 16 }, () => ({
	x: sr() * W, y: sr() * H, r: 35 + sr() * 75,
	hue: 210 + sr() * 150, sat: 55 + sr() * 35, lum: 38 + sr() * 28,
	base: 0.03 + sr() * 0.09,
	px: (sr() - 0.5) * 5, py: (sr() - 0.5) * 4,
}));

const STARS: [number, number, number, number][] = Array.from({ length: 130 }, () => [
	sr() * W, sr() * H, 0.25 + sr() * 0.75, sr() * Math.PI * 2,
]);

// Bright nebula star clusters
const CLUSTERS: [number, number, number][] = [
	[W * 0.28, H * 0.32, 0],
	[W * 0.62, H * 0.58, 1.1],
	[W * 0.52, H * 0.22, 2.3],
	[W * 0.75, H * 0.38, 0.7],
];

export default function NebulaCanvas() {
	const ref = useRef<HTMLCanvasElement>(null);
	useEffect(() => {
		const cv = ref.current; if (!cv) return;
		const ctx = cv.getContext("2d"); if (!ctx) return;
		const c = ctx;
		let last: number | null = null, time = 0, id: number;

		function frame(ts: number) {
			if (last === null) last = ts;
			const dt = Math.min((ts - last) / 1000, 0.05); last = ts;
			time += dt;

			c.fillStyle = "#00000e"; c.fillRect(0, 0, W, H);

			// Gas clouds — multiple layered radial gradients with slow drift
			for (const cl of CLOUDS) {
				const ox = Math.sin(time * 0.11 + cl.px) * 14;
				const oy = Math.cos(time * 0.085 + cl.py) * 10;
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
				const g = c.createRadialGradient(cx, cy, 0, cx, cy, 22);
				g.addColorStop(0, `rgba(255,255,255,${pulse})`);
				g.addColorStop(0.3, `rgba(220,235,255,${pulse * 0.5})`);
				g.addColorStop(1, "rgba(180,200,255,0)");
				c.fillStyle = g; c.beginPath(); c.arc(cx, cy, 22, 0, Math.PI * 2); c.fill();
			}

			// Faint nebula filaments (thin bright streaks)
			c.globalAlpha = 0.06 + 0.04 * Math.sin(time * 0.3);
			c.strokeStyle = "rgba(180,160,255,1)";
			c.lineWidth = 0.5;
			for (let i = 0; i < 5; i++) {
				const a   = (i / 5) * Math.PI + time * 0.04;
				const len = 60 + i * 15;
				const sx  = W * 0.35 + Math.cos(a + 0.5) * 30;
				const sy  = H * 0.45 + Math.sin(a + 0.5) * 20;
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
		return () => cancelAnimationFrame(id);
	}, []);

	return <canvas ref={ref} width={W} height={H} className="w-64 sm:w-72 h-auto rounded-md" style={{ imageRendering: "auto" }} />;
}
