"use client";

import { useEffect, useRef } from "react";
import { setupFullscreenCanvas } from "@/utils/fullscreenCanvas";

const CYCLE_MS = 3200;

interface Star {
	x: number;   // radial x offset from center, -1..1
	y: number;   // radial y offset from center, -1..1
	z: number;   // depth — 0.01 (near) to 1 (far)
	px: number;  // last projected screen x  (-1 = unset)
	py: number;
}

function randomStar(zMin = 0.05, zMax = 1.0): Star {
	const angle = Math.random() * Math.PI * 2;
	const dist  = 0.08 + Math.random() * 0.92;
	return {
		x: Math.cos(angle) * dist,
		y: Math.sin(angle) * dist,
		z: zMin + Math.random() * (zMax - zMin),
		px: -1,
		py: -1,
	};
}

export default function HyperdriveCanvas() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		const c = ctx; // narrow type once so inner functions see non-null
		const { dims, cleanup } = setupFullscreenCanvas(canvas);

		// Density scales with viewport area so large screens stay full of streaks.
		const starCount = Math.round(Math.min(1700, Math.max(420, (dims.w * dims.h) / 1500)));
		const stars: Star[] = Array.from({ length: starCount }, () => randomStar());
		let origin: number | null = null;
		let animId: number;

		c.fillStyle = "#00000a";
		c.fillRect(0, 0, dims.w, dims.h);

		function frame(ts: number) {
			if (origin === null) origin = ts;
			const W = dims.w, H = dims.h;
			const cx0 = W / 2, cy0 = H / 2;
			// Gentle line-width boost on larger viewports so streaks read at distance.
			const lwScale = Math.min(2.4, Math.max(1, Math.min(W, H) / 460));
			const t = ((ts - origin) % CYCLE_MS) / CYCLE_MS; // 0 → 1 each cycle

			// Exponential speed ramp — almost imperceptible at t=0, violent at t≈0.85
			const speed = 0.0008 + Math.pow(t, 2.8) * 0.09;

			// Motion-blur trail: thicker trail at higher speeds → longer streaks
			const fade = Math.max(0.04, 0.28 - t * 0.24);
			c.fillStyle = `rgba(0,0,8,${fade})`;
			c.fillRect(0, 0, W, H);

			for (const star of stars) {
				const prevX = (star.x / star.z) * cx0 + cx0;
				const prevY = (star.y / star.z) * cy0 + cy0;

				star.z -= speed;

				// Recycle stars that go off-screen or past the camera
				if (
					star.z < 0.008 ||
					prevX < -120 || prevX > W + 120 ||
					prevY < -120 || prevY > H + 120
				) {
					Object.assign(star, randomStar(0.85, 1.0));
					continue;
				}

				const cx = (star.x / star.z) * cx0 + cx0;
				const cy = (star.y / star.z) * cy0 + cy0;
				const nearness  = 1 - star.z;           // 0=far, 1=near
				const brightness = Math.pow(nearness, 1.4);
				const alpha      = Math.min(0.25 + brightness * 0.75, 1);
				const lineWidth  = Math.max(0.5, brightness * 2.8 * lwScale);

				// Blue-white colour: warm white early, icy blue at peak
				const rg  = Math.floor(160 + brightness * 95);
				const b   = 255;

				c.strokeStyle = `rgba(${rg},${rg},${b},${alpha})`;
				c.lineWidth   = lineWidth;
				c.beginPath();

				if (star.px >= 0 && t > 0.05) {
					c.moveTo(star.px, star.py);
					c.lineTo(cx, cy);
				} else {
					c.moveTo(cx, cy);
					c.lineTo(cx + 0.1, cy);
				}
				c.stroke();

				star.px = cx;
				star.py = cy;
			}

			// Hyperspace jump flash — blooms near end of each cycle
			if (t > 0.86) {
				const ft    = (t - 0.86) / 0.14;
				const bloom = Math.sin(ft * Math.PI) * 0.75;
				c.fillStyle = `rgba(210,228,255,${bloom})`;
				c.fillRect(0, 0, W, H);
			}

			animId = requestAnimationFrame(frame);
		}

		animId = requestAnimationFrame(frame);
		return () => { cancelAnimationFrame(animId); cleanup(); };
	}, []);

	return (
		<canvas
			ref={canvasRef}
			className="block w-full h-full"
			style={{ imageRendering: "auto" }}
		/>
	);
}
