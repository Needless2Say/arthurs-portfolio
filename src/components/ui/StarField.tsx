"use client";

import { useEffect, useRef } from "react";

interface Star {
	x: number;
	y: number;
	size: number;
	opacity: number;
	opacityDelta: number;
}

interface ShootingStar {
	x: number;
	y: number;
	vx: number;
	vy: number;
	length: number;
	opacity: number;
	life: number;
	lifeSpeed: number;
}

interface Nebula {
	x: number;
	y: number;
	radius: number;
	color: string;
	opacity: number;
	opacityDelta: number;
	driftX: number;
	driftY: number;
}

interface SparkStar {
	x: number;
	y: number;
	size: number;
	state: "waiting" | "rising" | "holding" | "falling";
	framesDone: number;
	framesTotal: number;
}

function sparkDuration(state: SparkStar["state"]): number {
	switch (state) {
		case "waiting": return 80  + Math.floor(Math.random() * 240); // ~1.3–5.3s pause
		case "rising":  return 14  + Math.floor(Math.random() * 46);  // ~0.23–1s fade-in
		case "holding": return 8   + Math.floor(Math.random() * 72);  // ~0.13–1.3s hold
		case "falling": return 22  + Math.floor(Math.random() * 78);  // ~0.37–1.7s fade-out
	}
}

function easeInOut(t: number): number {
	return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export default function StarField() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const mouseRef = useRef({ x: 0, y: 0 });
	const starsRef = useRef<Star[]>([]);
	const shootingStarsRef = useRef<ShootingStar[]>([]);
	const nebulaeRef = useRef<Nebula[]>([]);
	const sparkStarsRef = useRef<SparkStar[]>([]);
	const animFrameRef = useRef<number>(0);
	const nextSpawnRef = useRef<number>(0);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d")!;
		if (!ctx) return;

		function makeNebulae(w: number, h: number): Nebula[] {
			return [
				{ x: w * 0.12, y: h * 0.22, radius: 280, color: "124,58,237",  opacity: 0.055, opacityDelta:  0.00020, driftX:  0.010, driftY:  0.005 },
				{ x: w * 0.78, y: h * 0.14, radius: 240, color: "59,130,246",  opacity: 0.050, opacityDelta: -0.00016, driftX: -0.011, driftY:  0.007 },
				{ x: w * 0.50, y: h * 0.68, radius: 300, color: "99,102,241",  opacity: 0.045, opacityDelta:  0.00015, driftX:  0.007, driftY: -0.006 },
				{ x: w * 0.90, y: h * 0.72, radius: 210, color: "167,139,250", opacity: 0.050, opacityDelta: -0.00018, driftX: -0.009, driftY:  0.004 },
			];
		}

		function makeSparkStars(w: number, h: number): SparkStar[] {
			const count = 8;
			const states = ["waiting", "rising", "holding", "falling"] as const;
			return Array.from({ length: count }, (_, i) => {
				const slotW = w / count;
				const state = states[Math.floor(Math.random() * 4)];
				const framesTotal = sparkDuration(state);
				return {
					x: slotW * i + slotW * (0.15 + Math.random() * 0.7),
					y: h * (0.08 + Math.random() * 0.84),
					size: 2.0 + Math.random() * 1.2,
					state,
					framesDone: Math.floor(Math.random() * framesTotal),
					framesTotal,
				};
			});
		}

		const resize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			nebulaeRef.current = makeNebulae(canvas.width, canvas.height);
		};
		resize();
		window.addEventListener("resize", resize);

		starsRef.current = Array.from({ length: 200 }, () => ({
			x: Math.random() * canvas.width,
			y: Math.random() * canvas.height,
			size: Math.random() * 1.6 + 0.3,
			opacity: Math.random(),
			opacityDelta: (Math.random() * 0.004 + 0.001) * (Math.random() > 0.5 ? 1 : -1),
		}));

		sparkStarsRef.current = makeSparkStars(canvas.width, canvas.height);

		function spawnShootingStar(w: number, h: number): ShootingStar {
			const speed = 10 + Math.random() * 8;
			const angleDeg = 28 + Math.random() * 30;
			const angleRad = angleDeg * (Math.PI / 180);
			const dir = Math.random() > 0.5 ? 1 : -1;
			const x = dir > 0
				? w * (0.05 + Math.random() * 0.35)
				: w * (0.60 + Math.random() * 0.35);
			return {
				x,
				y: h * (Math.random() * 0.38),
				vx: Math.cos(angleRad) * speed * dir,
				vy: Math.sin(angleRad) * speed,
				length: 85 + Math.random() * 115,
				opacity: 0,
				life: 0,
				lifeSpeed: 0.007 + Math.random() * 0.005,
			};
		}

		function drawGlow(x: number, y: number, size: number, alpha: number) {
			const halo = ctx.createRadialGradient(x, y, 0, x, y, size * 9);
			halo.addColorStop(0,   `rgba(200, 190, 255, ${alpha * 0.18})`);
			halo.addColorStop(0.4, `rgba(180, 160, 255, ${alpha * 0.06})`);
			halo.addColorStop(1,   `rgba(160, 130, 255, 0)`);
			ctx.fillStyle = halo;
			ctx.beginPath();
			ctx.arc(x, y, size * 9, 0, Math.PI * 2);
			ctx.fill();

			const bloom = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
			bloom.addColorStop(0,   `rgba(255, 255, 255, ${alpha * 0.55})`);
			bloom.addColorStop(0.3, `rgba(220, 210, 255, ${alpha * 0.25})`);
			bloom.addColorStop(1,   `rgba(180, 160, 255, 0)`);
			ctx.fillStyle = bloom;
			ctx.beginPath();
			ctx.arc(x, y, size * 3, 0, Math.PI * 2);
			ctx.fill();
		}

		const handleMouseMove = (e: MouseEvent) => {
			mouseRef.current = {
				x: (e.clientX / window.innerWidth - 0.5) * 2,
				y: (e.clientY / window.innerHeight - 0.5) * 2,
			};
		};
		window.addEventListener("mousemove", handleMouseMove);

		const draw = (timestamp: number) => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// ── Cursor Glow ──────────────────────────────────────────────
			const cx = (mouseRef.current.x / 2 + 0.5) * canvas.width;
			const cy = (mouseRef.current.y / 2 + 0.5) * canvas.height;
			const cursorGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 160);
			cursorGrad.addColorStop(0,   "rgba(124, 58, 237, 0.055)");
			cursorGrad.addColorStop(0.5, "rgba(99,  102, 241, 0.022)");
			cursorGrad.addColorStop(1,   "rgba(0,   0,   0,   0)");
			ctx.fillStyle = cursorGrad;
			ctx.beginPath();
			ctx.arc(cx, cy, 160, 0, Math.PI * 2);
			ctx.fill();

			// ── Nebulae / Galaxy Blobs ───────────────────────────────────
			nebulaeRef.current.forEach((neb) => {
				neb.x += neb.driftX;
				neb.y += neb.driftY;
				neb.opacity += neb.opacityDelta;
				if (neb.opacity > 0.09 || neb.opacity < 0.025) neb.opacityDelta *= -1;
				neb.opacity = Math.max(0.025, Math.min(0.09, neb.opacity));

				const grad = ctx.createRadialGradient(neb.x, neb.y, 0, neb.x, neb.y, neb.radius);
				grad.addColorStop(0,   `rgba(${neb.color}, ${neb.opacity})`);
				grad.addColorStop(0.3, `rgba(${neb.color}, ${neb.opacity * 0.7})`);
				grad.addColorStop(0.7, `rgba(${neb.color}, ${neb.opacity * 0.2})`);
				grad.addColorStop(1,   `rgba(${neb.color}, 0)`);
				ctx.fillStyle = grad;
				ctx.beginPath();
				ctx.arc(neb.x, neb.y, neb.radius, 0, Math.PI * 2);
				ctx.fill();
			});

			// ── Regular Stars ────────────────────────────────────────────
			starsRef.current.forEach((star) => {
				star.opacity += star.opacityDelta;
				if (star.opacity > 1 || star.opacity < 0.05) star.opacityDelta *= -1;
				star.opacity = Math.max(0.05, Math.min(1, star.opacity));

				const px = mouseRef.current.x * star.size * 4;
				const py = mouseRef.current.y * star.size * 4;

				ctx.beginPath();
				ctx.arc(star.x + px, star.y + py, star.size, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
				ctx.fill();
			});

			// ── Sparkle Stars (4-phase independent random timing) ────────
			sparkStarsRef.current.forEach((s) => {
				s.framesDone++;
				if (s.framesDone >= s.framesTotal) {
					s.framesDone = 0;
					const next: SparkStar["state"] =
						s.state === "waiting" ? "rising"  :
						s.state === "rising"  ? "holding" :
						s.state === "holding" ? "falling" :
						"waiting";
					s.state = next;
					s.framesTotal = sparkDuration(next);
				}

				const t = s.framesDone / s.framesTotal;
				const alpha =
					s.state === "waiting" ? 0               :
					s.state === "rising"  ? easeInOut(t)    :
					s.state === "holding" ? 1                :
					                        1 - easeInOut(t);

				if (alpha < 0.01) return;

				ctx.beginPath();
				ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(230, 220, 255, ${0.1 + alpha * 0.6})`;
				ctx.fill();

				if (alpha > 0.15) {
					drawGlow(s.x, s.y, s.size, (alpha - 0.15) / 0.85);
				}
			});

			// ── Spawn Shooting Stars ─────────────────────────────────────
			if (timestamp >= nextSpawnRef.current && shootingStarsRef.current.length < 2) {
				shootingStarsRef.current.push(spawnShootingStar(canvas.width, canvas.height));
				nextSpawnRef.current = timestamp + 3500 + Math.random() * 7000;
			}

			// ── Animate Shooting Stars ───────────────────────────────────
			shootingStarsRef.current = shootingStarsRef.current.filter((s) => s.life < 1);
			shootingStarsRef.current.forEach((s) => {
				s.life += s.lifeSpeed;
				s.x += s.vx;
				s.y += s.vy;

				if (s.life < 0.15)      s.opacity = s.life / 0.15;
				else if (s.life > 0.70) s.opacity = Math.max(0, (1 - s.life) / 0.30);
				else                    s.opacity = 1;

				const mag = Math.hypot(s.vx, s.vy);
				const tailX = s.x - (s.vx / mag) * s.length;
				const tailY = s.y - (s.vy / mag) * s.length;

				const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
				grad.addColorStop(0,    `rgba(255, 255, 255, ${s.opacity})`);
				grad.addColorStop(0.25, `rgba(210, 190, 255, ${s.opacity * 0.6})`);
				grad.addColorStop(1,    `rgba(140, 100, 255, 0)`);

				ctx.beginPath();
				ctx.moveTo(s.x, s.y);
				ctx.lineTo(tailX, tailY);
				ctx.strokeStyle = grad;
				ctx.lineWidth = 1.5;
				ctx.stroke();
			});

			animFrameRef.current = requestAnimationFrame(draw);
		};

		animFrameRef.current = requestAnimationFrame(draw);

		return () => {
			cancelAnimationFrame(animFrameRef.current);
			window.removeEventListener("resize", resize);
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			className="fixed inset-0 pointer-events-none z-0"
			aria-hidden="true"
		/>
	);
}
