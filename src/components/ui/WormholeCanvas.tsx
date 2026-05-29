"use client";
import { useEffect, useRef } from "react";

const W = 320, H = 200;
const CX = W / 2, CY = H / 2;
const RINGS   = 14;
const CYCLE   = 2200;  // ms per ring revolution

let _s = 99;
const sr = () => { _s = ((_s * 1664525 + 1013904223) >>> 0); return _s / 0xffffffff; };

interface Sp { a: number; r: number; spd: number; hue: number }
const PARTICLES: Sp[] = Array.from({ length: 90 }, () => ({
	a: sr() * Math.PI * 2, r: 20 + sr() * 75, spd: 0.6 + sr() * 1.4, hue: 200 + sr() * 100,
}));

export default function WormholeCanvas() {
	const ref = useRef<HTMLCanvasElement>(null);
	useEffect(() => {
		const cv = ref.current; if (!cv) return;
		const ctx = cv.getContext("2d"); if (!ctx) return;
		const c = ctx;
		const pts: Sp[] = PARTICLES.map(p => ({ ...p }));
		let last: number | null = null, id: number;

		c.fillStyle = "#00000c"; c.fillRect(0, 0, W, H);

		function frame(ts: number) {
			if (last === null) last = ts;
			const dt = Math.min((ts - last) / 1000, 0.05); last = ts;
			const t  = (ts % CYCLE) / CYCLE;

			c.fillStyle = "rgba(0,0,10,0.22)"; c.fillRect(0, 0, W, H);

			// Concentric elliptical rings — each phased across RINGS
			for (let i = 0; i < RINGS; i++) {
				const phase  = (i / RINGS + t) % 1;          // 0→1 as ring reaches center
				const radius = (1 - phase) * 88 + 4;
				const alpha  = Math.sin(phase * Math.PI) * 0.65;
				const hue    = 240 + phase * 80;              // blue → purple → violet
				const lum    = 45 + phase * 35;
				c.strokeStyle = `hsla(${hue},72%,${lum}%,${alpha})`;
				c.lineWidth   = Math.max(0.4, 2.2 - phase * 1.8);
				c.beginPath();
				c.ellipse(CX, CY, radius, radius * 0.52, 0, 0, Math.PI * 2);
				c.stroke();
			}

			// Spiral particles draining toward center
			for (const p of pts) {
				p.a += p.spd * dt;
				p.r -= 10 * dt;
				if (p.r < 6) { p.r = 28 + Math.random() * 58; p.a = Math.random() * Math.PI * 2; }
				const x    = CX + Math.cos(p.a) * p.r;
				const y    = CY + Math.sin(p.a) * p.r * 0.5;
				const fade = Math.min(1, p.r / 70) * 0.9;
				c.globalAlpha = fade;
				c.fillStyle   = `hsl(${p.hue},80%,75%)`;
				c.beginPath(); c.arc(x, y, 1.4, 0, Math.PI * 2); c.fill();
			}
			c.globalAlpha = 1;

			// Tunnel depth rings (perspective lines at right angle to main rings)
			for (let i = 0; i < 6; i++) {
				const a = (i / 6) * Math.PI * 2 + t * 0.8;
				const r0 = 6, r1 = 88;
				const x0 = CX + Math.cos(a) * r0, y0 = CY + Math.sin(a) * r0 * 0.52;
				const x1 = CX + Math.cos(a) * r1, y1 = CY + Math.sin(a) * r1 * 0.52;
				c.strokeStyle = "rgba(140,160,255,0.08)";
				c.lineWidth   = 0.5;
				c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke();
			}

			// Bright center — other side of wormhole
			const grd = c.createRadialGradient(CX, CY, 0, CX, CY, 28);
			grd.addColorStop(0, "rgba(255,255,255,0.92)");
			grd.addColorStop(0.25, "rgba(200,225,255,0.55)");
			grd.addColorStop(0.7, "rgba(120,160,255,0.12)");
			grd.addColorStop(1, "rgba(80,100,255,0)");
			c.fillStyle = grd; c.beginPath(); c.arc(CX, CY, 28, 0, Math.PI * 2); c.fill();

			id = requestAnimationFrame(frame);
		}

		id = requestAnimationFrame(frame);
		return () => cancelAnimationFrame(id);
	}, []);

	return <canvas ref={ref} width={W} height={H} className="w-64 sm:w-72 h-auto rounded-md" style={{ imageRendering: "auto" }} />;
}
