"use client";
import { useEffect, useRef } from "react";

const W = 320, H = 200;
const CX = W / 2, CY = H / 2 + 10;
const CYCLE_MS  = 3800;
const STAR_COUNT = 280;

interface Star { x: number; y: number; z: number; px: number; py: number }
const newStar = (): Star => ({ x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2, z: 0.1 + Math.random() * 0.9, px: -1, py: -1 });

function projectStar(s: Star): [number, number] {
	return [(s.x / s.z) * (W / 2) + W / 2, (s.y / s.z) * (H / 2) + H / 2];
}

// Draw the Millennium Falcon from a top-down perspective
// ship points "up" (toward y=0) via -PI/2 rotation
function drawFalcon(c: CanvasRenderingContext2D, x: number, y: number, scale: number, enginePulse: number) {
	c.save();
	c.translate(x, y);
	c.scale(scale, scale);
	c.rotate(-Math.PI / 2); // nose points toward -Y (top of canvas = forward)

	const hull    = "#56524e";
	const panel   = "#3e3b38";
	const edge    = "#2a2825";
	const detail  = "#6a6560";

	// ── Main saucer hull ──────────────────────────────────────
	c.beginPath(); c.ellipse(0, 0, 40, 30, 0, 0, Math.PI * 2);
	c.fillStyle = hull; c.fill();
	c.strokeStyle = edge; c.lineWidth = 1.2; c.stroke();

	// Inner hull ring
	c.beginPath(); c.ellipse(0, 0, 27, 20, 0, 0, Math.PI * 2);
	c.strokeStyle = panel; c.lineWidth = 0.8; c.stroke();

	// Hull panel lines
	c.strokeStyle = panel; c.lineWidth = 0.5;
	[[-25, -10, -25, 10], [25, -10, 25, 10], [-10, -28, 10, -28]].forEach(([x1, y1, x2, y2]) => {
		c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
	});

	// ── Dish (upper-left quadrant) ────────────────────────────
	c.beginPath(); c.ellipse(-15, -7, 12, 9, 0.25, 0, Math.PI * 2);
	c.fillStyle = detail; c.fill(); c.strokeStyle = edge; c.lineWidth = 0.8; c.stroke();
	c.beginPath(); c.arc(-15, -7, 3.5, 0, Math.PI * 2);
	c.fillStyle = "#888"; c.fill();
	// Dish rings
	c.strokeStyle = "#777"; c.lineWidth = 0.4;
	[6, 9].forEach(r => { c.beginPath(); c.ellipse(-15, -7, r, r * 0.75, 0.25, 0, Math.PI * 2); c.stroke(); });

	// ── Forward mandibles ────────────────────────────────────
	// Left mandible
	c.beginPath();
	c.moveTo(-5, -26); c.lineTo(-20, -52); c.lineTo(-8, -54); c.lineTo(-2, -28);
	c.fillStyle = hull; c.fill(); c.strokeStyle = edge; c.lineWidth = 1; c.stroke();

	// Right mandible
	c.beginPath();
	c.moveTo(5, -26); c.lineTo(20, -52); c.lineTo(8, -54); c.lineTo(2, -28);
	c.fillStyle = hull; c.fill(); c.strokeStyle = edge; c.lineWidth = 1; c.stroke();

	// Notch between mandibles
	c.beginPath(); c.moveTo(-4, -26); c.lineTo(4, -26); c.lineTo(2, -36); c.lineTo(-2, -36); c.closePath();
	c.fillStyle = "#1a1816"; c.fill();

	// ── Cockpit pod (right side) ──────────────────────────────
	c.beginPath(); c.ellipse(44, 2, 13, 9, -0.12, 0, Math.PI * 2);
	c.fillStyle = detail; c.fill(); c.strokeStyle = edge; c.lineWidth = 0.9; c.stroke();

	// Cockpit window
	c.beginPath(); c.ellipse(46, 2, 7, 5, -0.12, 0, Math.PI * 2);
	c.fillStyle = `rgba(20,60,100,1)`; c.fill();
	// Window glow — brightens with engine pulse
	const winGlow = c.createRadialGradient(46, 2, 0, 46, 2, 8);
	winGlow.addColorStop(0, `rgba(80,170,255,${0.4 + enginePulse * 0.4})`);
	winGlow.addColorStop(1, "rgba(0,80,200,0)");
	c.fillStyle = winGlow; c.beginPath(); c.ellipse(46, 2, 8, 6, -0.12, 0, Math.PI * 2); c.fill();

	// ── Engines (3 nozzles at the back, now bottom due to rotation) ──
	[-12, 0, 12].forEach(ex => {
		// Nozzle ring
		c.beginPath(); c.ellipse(ex, 32, 7, 5, 0, 0, Math.PI * 2);
		c.fillStyle = "#222"; c.fill(); c.strokeStyle = "#444"; c.lineWidth = 0.8; c.stroke();

		// Engine glow — pulses
		const eg = c.createRadialGradient(ex, 32, 0, ex, 32, 14);
		eg.addColorStop(0,   `rgba(120,200,255,${0.85 + enginePulse * 0.15})`);
		eg.addColorStop(0.35, `rgba(60,130,255,${0.45 + enginePulse * 0.2})`);
		eg.addColorStop(0.7, `rgba(20,60,220,0.12)`);
		eg.addColorStop(1,   "rgba(0,30,180,0)");
		c.fillStyle = eg; c.beginPath(); c.arc(ex, 32, 14, 0, Math.PI * 2); c.fill();
	});

	c.restore();
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

			// Falcon: starts at scale 0.18 (far) and grows to 0.55 at jump time
			const falconT    = Math.min(t / 0.82, 1);
			const falconScale = 0.18 + falconT * 0.37;
			const enginePulse = 0.5 + 0.5 * Math.sin(ts / 180);

			if (!jump) {
				drawFalcon(c, CX, CY, falconScale, enginePulse);
			}

			// Hyperspace jump flash
			if (jump) {
				const ft     = (t - 0.82) / 0.18;
				// First half: elongation streaks (falcon stretches to light)
				if (ft < 0.45) {
					const stretch = ft / 0.45;
					// Draw the Falcon highly squished (like it's being stretched into hyperspace)
					c.save();
					c.translate(CX, CY);
					c.scale(0.55, 0.55 - stretch * 0.48);
					c.translate(-CX, -CY);
					drawFalcon(c, CX, CY, 1, 1);
					c.restore();
					// Bright elongating flash
					const flashGrd = c.createLinearGradient(CX, CY - 80 * stretch, CX, CY + 80 * stretch);
					flashGrd.addColorStop(0, "rgba(200,225,255,0)");
					flashGrd.addColorStop(0.5, `rgba(220,235,255,${stretch * 0.85})`);
					flashGrd.addColorStop(1, "rgba(200,225,255,0)");
					c.fillStyle = flashGrd; c.fillRect(0, 0, W, H);
				} else {
					// Full bloom — traveled to hyperspace
					const bloom = Math.sin(((ft - 0.45) / 0.55) * Math.PI) * 0.88;
					c.fillStyle = `rgba(215,230,255,${bloom})`;
					c.fillRect(0, 0, W, H);
				}
			}

			id = requestAnimationFrame(frame);
		}

		id = requestAnimationFrame(frame);
		return () => cancelAnimationFrame(id);
	}, []);

	return <canvas ref={ref} width={W} height={H} className="w-64 sm:w-72 h-auto rounded-md" style={{ imageRendering: "auto" }} />;
}
