"use client";
import { useEffect, useRef } from "react";

const W = 320, H = 200;
const CX = W / 2, CY = H / 2;
const CYCLE_MS   = 3800;
const STAR_COUNT = 280;

interface Star { x: number; y: number; z: number; px: number; py: number }
const newStar = (): Star => ({ x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2, z: 0.1 + Math.random() * 0.9, px: -1, py: -1 });

function projectStar(s: Star): [number, number] {
	return [(s.x / s.z) * (W / 2) + W / 2, (s.y / s.z) * (H / 2) + H / 2];
}

export default function FalconCanvas() {
	const ref = useRef<HTMLCanvasElement>(null);
	useEffect(() => {
		const cv = ref.current; if (!cv) return;
		const ctx = cv.getContext("2d"); if (!ctx) return;
		const c = ctx;

		const stars: Star[] = Array.from({ length: STAR_COUNT }, newStar);
		let origin: number | null = null, id: number;

		c.fillStyle = "#000005"; c.fillRect(0, 0, W, H);

		function frame(ts: number) {
			if (origin === null) origin = ts;
			const t    = ((ts - origin) % CYCLE_MS) / CYCLE_MS; // 0→1 per cycle
			const jump = t > 0.82; // last 18% = hyperspace jump

			// Hyperspace star speed ramps up as we approach jump
			const starSpeed = 0.0005 + Math.pow(Math.min(t, 0.82) / 0.82, 3) * 0.055;

			const fade = Math.max(0.04, 0.28 - (t / 0.82) * 0.24);
			c.fillStyle = `rgba(0,0,6,${jump ? 0.06 : fade})`;
			c.fillRect(0, 0, W, H);

			// Hyperspace star streaks
			for (const s of stars) {
				const [px, py] = projectStar(s);
				s.z -= starSpeed;
				if (s.z < 0.008 || px < -80 || px > W + 80 || py < -60 || py > H + 60) {
					Object.assign(s, newStar()); s.z = 0.88 + Math.random() * 0.12; continue;
				}
				const [cx2, cy2] = projectStar(s);
				const near  = 1 - s.z;
				const alpha = Math.min(1, 0.2 + near * 0.8);
				const lw    = Math.max(0.3, near * 2.2);
				const rg    = (150 + near * 105) | 0;
				c.strokeStyle = `rgba(${rg},${rg},255,${alpha})`;
				c.lineWidth   = lw;
				c.beginPath();
				if (s.px >= 0) { c.moveTo(s.px, s.py); } else { c.moveTo(cx2, cy2); }
				c.lineTo(cx2, cy2); c.stroke();
				s.px = cx2; s.py = cy2;
			}

			// Hyperspace jump flash
			if (jump) {
				const ft    = (t - 0.82) / 0.18;
				const bloom = Math.sin(ft * Math.PI) * 0.88;
				c.fillStyle = `rgba(215,230,255,${bloom})`;
				c.fillRect(0, 0, W, H);
			}

			id = requestAnimationFrame(frame);
		}

		id = requestAnimationFrame(frame);
		return () => cancelAnimationFrame(id);
	}, []);

	return <canvas ref={ref} width={W} height={H} className="w-64 sm:w-72 h-auto rounded-md" style={{ imageRendering: "auto" }} />;
}
