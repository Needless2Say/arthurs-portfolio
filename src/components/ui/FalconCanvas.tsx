"use client";
import { useEffect, useRef } from "react";
import { setupFullscreenCanvas } from "@/utils/fullscreenCanvas";

const CYCLE_MS   = 3800;

interface Star { x: number; y: number; z: number; px: number; py: number }
const newStar = (): Star => ({ x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2, z: 0.1 + Math.random() * 0.9, px: -1, py: -1 });

export default function FalconCanvas() {
	const ref = useRef<HTMLCanvasElement>(null);
	useEffect(() => {
		const cv = ref.current; if (!cv) return;
		const ctx = cv.getContext("2d"); if (!ctx) return;
		const c = ctx;
		const { dims, cleanup } = setupFullscreenCanvas(cv);

		const starCount = Math.round(Math.min(1500, Math.max(380, (dims.w * dims.h) / 1700)));
		const stars: Star[] = Array.from({ length: starCount }, newStar);
		let origin: number | null = null, id: number;

		c.fillStyle = "#000005"; c.fillRect(0, 0, dims.w, dims.h);

		function frame(ts: number) {
			if (origin === null) origin = ts;
			const W = dims.w, H = dims.h;
			const cx0 = W / 2, cy0 = H / 2;
			const lwScale = Math.min(2.4, Math.max(1, Math.min(W, H) / 460));
			const t    = ((ts - origin) % CYCLE_MS) / CYCLE_MS; // 0→1 per cycle
			const jump = t > 0.82; // last 18% = hyperspace jump

			// Hyperspace star speed ramps up as we approach jump
			const starSpeed = 0.0005 + Math.pow(Math.min(t, 0.82) / 0.82, 3) * 0.055;

			const fade = Math.max(0.04, 0.28 - (t / 0.82) * 0.24);
			c.fillStyle = `rgba(0,0,6,${jump ? 0.06 : fade})`;
			c.fillRect(0, 0, W, H);

			// Hyperspace star streaks
			for (const s of stars) {
				const px = (s.x / s.z) * cx0 + cx0;
				const py = (s.y / s.z) * cy0 + cy0;
				s.z -= starSpeed;
				if (s.z < 0.008 || px < -120 || px > W + 120 || py < -120 || py > H + 120) {
					Object.assign(s, newStar()); s.z = 0.88 + Math.random() * 0.12; continue;
				}
				const cx2 = (s.x / s.z) * cx0 + cx0;
				const cy2 = (s.y / s.z) * cy0 + cy0;
				const near  = 1 - s.z;
				const alpha = Math.min(1, 0.2 + near * 0.8);
				const lw    = Math.max(0.4, near * 2.2 * lwScale);
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
		return () => { cancelAnimationFrame(id); cleanup(); };
	}, []);

	return <canvas ref={ref} className="block w-full h-full" style={{ imageRendering: "auto" }} />;
}
