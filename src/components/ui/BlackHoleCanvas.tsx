"use client";
import { useEffect, useRef } from "react";

const W = 320, H = 200;
const CX = W / 2, CY = H / 2 + 8;
const TILT      = 0.36;
const R_HORIZON = 22;
const R_IN      = 28;
const R_OUT     = 85;
const N         = 300;

let _s = 7;
const sr = () => { _s = ((_s * 1664525 + 1013904223) >>> 0); return _s / 0xffffffff; };
const BG: [number, number, number][] = Array.from({ length: 90 }, () => [sr() * W, sr() * H, 0.15 + sr() * 0.6]);

interface Pt { a: number; r: number; spd: number; sz: number }
const mkPt = (): Pt => {
	const r = R_IN + Math.random() * (R_OUT - R_IN);
	return {
		a:   Math.random() * Math.PI * 2,
		r,
		spd: 1.5 / Math.sqrt(r),
		sz:  1.2 + (1 - (r - R_IN) / (R_OUT - R_IN)) * 2.4, // 3.6 inner → 1.2 outer
	};
};

export default function BlackHoleCanvas() {
	const ref = useRef<HTMLCanvasElement>(null);
	useEffect(() => {
		const cv = ref.current; if (!cv) return;
		const ctx = cv.getContext("2d"); if (!ctx) return;
		const c = ctx;
		const pts: Pt[] = Array.from({ length: N }, mkPt);
		let last: number | null = null, id: number;

		c.fillStyle = "#00000a"; c.fillRect(0, 0, W, H);

		function frame(ts: number) {
			if (last === null) last = ts;
			const dt = Math.min((ts - last) / 1000, 0.05); last = ts;

			// Slow fade so particles linger visibly
			c.fillStyle = "rgba(0,0,6,0.13)"; c.fillRect(0, 0, W, H);

			// Background stars
			for (const [sx, sy, a] of BG) {
				c.fillStyle = `rgba(210,220,255,${a * 0.35})`;
				c.fillRect(sx | 0, sy | 0, 1, 1);
			}

			// Ambient disk glow — tilted ellipse behind everything
			c.save();
			c.translate(CX, CY);
			c.scale(1, TILT);
			const diskGlow = c.createRadialGradient(0, 0, R_IN * 0.5, 0, 0, R_OUT);
			diskGlow.addColorStop(0,   "rgba(255,210,80,0.18)");
			diskGlow.addColorStop(0.35,"rgba(255,120,20,0.13)");
			diskGlow.addColorStop(0.7, "rgba(180,40,0,0.06)");
			diskGlow.addColorStop(1,   "rgba(0,0,0,0)");
			c.fillStyle = diskGlow;
			c.beginPath(); c.arc(0, 0, R_OUT, 0, Math.PI * 2); c.fill();
			c.restore();

			// Update angles
			for (const p of pts) p.a = (p.a + p.spd * dt) % (Math.PI * 2);

			// Sort: far side (sin < 0) drawn first so near side renders on top
			const sorted = [...pts].sort((a, b) => Math.sin(a.a) - Math.sin(b.a));

			for (const p of sorted) {
				const x    = CX + Math.cos(p.a) * p.r;
				const y    = CY + Math.sin(p.a) * p.r * TILT;
				const norm = (p.r - R_IN) / (R_OUT - R_IN); // 0=inner(hot), 1=outer(cool)

				// Approaching side (cos > 0) is brighter — range always [0.55, 1.0]
				const doppler  = 0.775 + 0.225 * Math.cos(p.a);
				// Far side dimmer but still clearly visible
				const farDim   = Math.sin(p.a) < 0 ? 0.55 : 1.0;
				// Base brightness high so disk is clearly visible
				const bright   = (0.55 + (1 - norm) * 0.45) * doppler * farDim;
				const alpha    = Math.min(1, bright * 1.05);

				// Colour: inner = hot white-yellow, outer = orange, far outer = red
				const r = 255;
				const g = Math.max(0, Math.min(255, ((1 - norm) * 200 + 40) | 0)); // 240→40
				const b = Math.max(0, Math.min(255, ((1 - norm * 1.4) * 120)  | 0)); // 120→0

				c.globalAlpha = alpha;
				c.fillStyle   = `rgb(${r},${g},${b})`;
				c.beginPath();
				c.arc(x, y, p.sz, 0, Math.PI * 2);
				c.fill();

				// Inner ring particles also get a soft glow halo
				if (norm < 0.35 && alpha > 0.5) {
					const halo = c.createRadialGradient(x, y, 0, x, y, p.sz * 3.5);
					halo.addColorStop(0, `rgba(255,230,120,${alpha * 0.35})`);
					halo.addColorStop(1, "rgba(255,100,0,0)");
					c.globalAlpha = 1;
					c.fillStyle   = halo;
					c.beginPath();
					c.arc(x, y, p.sz * 3.5, 0, Math.PI * 2);
					c.fill();
				}
			}
			c.globalAlpha = 1;

			// Photon-sphere orange glow ring
			const lens = c.createRadialGradient(CX, CY, R_HORIZON, CX, CY, R_HORIZON + 18);
			lens.addColorStop(0,   "rgba(255,150,40,0.55)");
			lens.addColorStop(0.4, "rgba(220,70,0,0.2)");
			lens.addColorStop(1,   "rgba(0,0,0,0)");
			c.fillStyle = lens;
			c.beginPath(); c.arc(CX, CY, R_HORIZON + 18, 0, Math.PI * 2); c.fill();

			// Event horizon — pure black
			c.fillStyle = "#000";
			c.beginPath(); c.arc(CX, CY, R_HORIZON, 0, Math.PI * 2); c.fill();

			id = requestAnimationFrame(frame);
		}

		id = requestAnimationFrame(frame);
		return () => cancelAnimationFrame(id);
	}, []);

	return <canvas ref={ref} width={W} height={H} className="w-64 sm:w-72 h-auto rounded-md" style={{ imageRendering: "auto" }} />;
}
