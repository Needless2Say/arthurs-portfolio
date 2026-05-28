"use client";

import { useEffect, useRef } from "react";

// ── Pixel grid constants ────────────────────────────────────────
const SCALE = 6;
const CW = 600;
const CH = 240;
const OX = 36; // character grid origin X (canvas px)
const OY = 14; // character grid origin Y (canvas px)

// ── DBZ color palette ───────────────────────────────────────────
const C = {
	K: "#0a0a0a", // black (hair, outlines)
	S: "#FFD8A8", // skin
	D: "#B0764C", // skin shadow
	O: "#F08018", // orange gi
	Q: "#9C4810", // orange shadow
	T: "#FFB060", // orange highlight
	B: "#1858B0", // blue (collar, belt, boots, wristband)
	N: "#0E2860", // dark blue
	W: "#EAEAEA", // white (boot wrap)
	E: "#28D8FF", // energy cyan
	F: "#F0FAFF", // bright energy
	Y: "#FFD848", // aura yellow
	P: "#FF7820", // aura orange
} as const;

// ── Animation timing (frame-locked for retro feel) ─────────────
const FRAME_MS = 100; // 10 FPS

const FRAMES = {
	stance: 3,
	cup: 5,
	charge: 6,
	build: 5,
	release: 3,
	sustain: 22,
} as const;

const START = {
	stance: 0,
	cup: FRAMES.stance,
	charge: FRAMES.stance + FRAMES.cup,
	build: FRAMES.stance + FRAMES.cup + FRAMES.charge,
	release: FRAMES.stance + FRAMES.cup + FRAMES.charge + FRAMES.build,
	sustain: FRAMES.stance + FRAMES.cup + FRAMES.charge + FRAMES.build + FRAMES.release,
};

const TOTAL_FRAMES = Object.values(FRAMES).reduce((a, b) => a + b, 0);
export const LOOP_MS = TOTAL_FRAMES * FRAME_MS; // 4400ms

// Beam emerges from right edge of extended hand
const HAND_GRID_X = 25;
const ARM_MID_GRID_Y = 13.5;

export default function GokuCanvas() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d")!;
		if (!ctx) return;

		const BEAM_X = OX + HAND_GRID_X * SCALE;
		const BEAM_MID = OY + ARM_MID_GRID_Y * SCALE;

		// Background star field
		const stars = Array.from({ length: 38 }, () => ({
			x: Math.random() * CW,
			y: Math.random() * CH,
			r: Math.random() * 1.5 + 0.5,
			phase: Math.random() * Math.PI * 2,
		}));

		let startTime: number | null = null;
		let animId: number;

		// Draw one "pixel block" on the character grid
		function p(x: number, y: number, w: number, h: number, color: string) {
			ctx.fillStyle = color;
			ctx.fillRect(OX + x * SCALE, OY + y * SCALE, w * SCALE, h * SCALE);
		}

		// ── HAIR (profile facing right) ────────────────────────────
		function drawHair() {
			// Top spikes
			p(11, -2, 2, 1, C.K);
			p(13, -2, 1, 1, C.K);
			p(9, -1, 2, 1, C.K);
			p(11, -1, 3, 1, C.K);
			p(14, -1, 1, 1, C.K);

			// Hair mass on top of head
			p(7, 0, 9, 1, C.K);
			p(6, 1, 11, 1, C.K);
			p(5, 2, 12, 1, C.K);
			p(5, 3, 4, 1, C.K);
			p(15, 3, 2, 1, C.K);

			// Sideburn at back, fringe at front
			p(4, 3, 2, 2, C.K);
			p(16, 4, 1, 1, C.K);
		}

		// ── FACE (profile, nose to the right) ──────────────────────
		function drawFace(intense: boolean) {
			// Face area
			p(9, 4, 7, 1, C.S);
			p(9, 5, 7, 1, C.S);
			p(9, 6, 7, 1, C.S);
			p(10, 7, 6, 1, C.S);
			p(11, 8, 5, 1, C.S);
			p(12, 9, 3, 1, C.S);

			// Nose tip
			p(16, 5, 1, 2, C.S);

			// Ear at back of head
			p(9, 6, 1, 1, C.D);

			// Eyebrow
			p(13, 4, 2, 1, C.K);

			// Eye (intense vs normal)
			if (intense) {
				p(13, 5, 2, 1, C.K);
				p(13, 6, 1, 1, C.K);
			} else {
				p(13, 6, 1, 1, C.K);
			}

			// Mouth (open yelling vs closed)
			if (intense) {
				p(14, 7, 2, 1, C.K);
				p(14, 8, 2, 1, C.D);
			} else {
				p(15, 7, 1, 1, C.K);
			}

			// Chin shadow
			p(12, 8, 3, 1, C.D);

			// Neck
			p(11, 10, 4, 1, C.S);
			p(11, 11, 4, 1, C.D);
		}

		// ── TORSO (orange gi + blue collar) ───────────────────────
		function drawTorso() {
			p(7, 11, 10, 6, C.O);
			p(7, 11, 1, 6, C.T); // left edge highlight
			p(16, 11, 1, 6, C.Q); // right edge shadow

			// Blue undershirt at collar
			p(11, 11, 3, 1, C.B);
			p(12, 12, 2, 1, C.B);

			// Gi lapel detail
			p(13, 13, 2, 1, C.Q);
		}

		// ── BELT (blue sash) ──────────────────────────────────────
		function drawBelt() {
			p(7, 17, 10, 1, C.B);
			p(7, 18, 10, 1, C.N);
			p(7, 17, 2, 2, C.B);
			p(7, 18, 2, 1, C.K);
		}

		// ── HIPS (orange gi pants) ────────────────────────────────
		function drawHips() {
			p(7, 19, 10, 3, C.O);
			p(7, 19, 1, 3, C.T);
			p(16, 19, 1, 3, C.Q);
		}

		// ── LEGS ──────────────────────────────────────────────────
		function drawLegs(wide: boolean) {
			if (wide) {
				p(6, 22, 4, 8, C.O);
				p(6, 22, 1, 8, C.T);
				p(9, 22, 1, 8, C.Q);
				p(15, 22, 4, 8, C.O);
				p(15, 22, 1, 8, C.T);
				p(18, 22, 1, 8, C.Q);
			} else {
				p(8, 22, 4, 8, C.O);
				p(8, 22, 1, 8, C.T);
				p(11, 22, 1, 8, C.Q);
				p(12, 22, 4, 8, C.O);
				p(12, 22, 1, 8, C.T);
				p(15, 22, 1, 8, C.Q);
			}
		}

		// ── BOOTS (blue with white wrap, classic DBZ) ─────────────
		function drawBoots(wide: boolean) {
			if (wide) {
				p(5, 30, 5, 1, C.W);
				p(5, 31, 5, 2, C.B);
				p(5, 33, 5, 1, C.N);
				p(14, 30, 5, 1, C.W);
				p(14, 31, 5, 2, C.B);
				p(14, 33, 5, 1, C.N);
			} else {
				p(7, 30, 5, 1, C.W);
				p(7, 31, 5, 2, C.B);
				p(7, 33, 5, 1, C.N);
				p(11, 30, 5, 1, C.W);
				p(11, 31, 5, 2, C.B);
				p(11, 33, 5, 1, C.N);
			}
		}

		// ── ARMS: stance (relaxed at sides) ──────────────────────
		function drawArmsStance() {
			// Near arm visible at side
			p(15, 12, 2, 5, C.O);
			p(15, 12, 1, 5, C.T);
			p(15, 17, 2, 3, C.O);
			p(15, 19, 2, 1, C.B); // wristband
			p(15, 20, 2, 2, C.S); // hand
		}

		// ── ARMS: pulling back to cup at left hip ────────────────
		function drawArmsCup(progress: number) {
			if (progress < 0.34) {
				p(12, 12, 4, 3, C.O);
				p(10, 14, 4, 2, C.O);
				p(9, 16, 3, 2, C.S);
			} else if (progress < 0.67) {
				p(10, 12, 5, 3, C.O);
				p(8, 14, 4, 2, C.O);
				p(7, 16, 3, 2, C.S);
			} else {
				// Final cup pose at back/left hip
				p(8, 12, 6, 3, C.O);
				p(8, 12, 1, 3, C.T);
				p(6, 14, 4, 3, C.O);
				p(6, 14, 1, 3, C.Q);
				p(5, 16, 4, 2, C.S); // cupped hands
				p(5, 16, 1, 2, C.D);
				p(8, 17, 1, 1, C.K);
				p(5, 18, 1, 1, C.K);
				// Far hand peeking just below
				p(6, 18, 2, 1, C.S);
				p(6, 18, 1, 1, C.D);
			}
		}

		// ── ARMS: holding cup pose, energy starting ──────────────
		function drawArmsCharge(t: number) {
			p(8, 12, 6, 3, C.O);
			p(8, 12, 1, 3, C.T);
			p(6, 14, 4, 3, C.O);
			p(6, 14, 1, 3, C.Q);
			p(5, 16, 4, 2, C.S);
			p(5, 16, 1, 2, C.D);
			p(8, 17, 1, 1, C.K);
			p(5, 18, 1, 1, C.K);
			p(6, 18, 2, 1, C.S);
			p(6, 18, 1, 1, C.D);

			// Small flickering energy spark between hands
			const cx = OX + 6.5 * SCALE;
			const cy = OY + 17 * SCALE;
			const r = 5 + Math.sin(t * 12) * 2;

			const og = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 2.5);
			og.addColorStop(0, "rgba(40, 216, 255, 0.6)");
			og.addColorStop(0.5, "rgba(40, 216, 255, 0.15)");
			og.addColorStop(1, "rgba(40, 216, 255, 0)");
			ctx.fillStyle = og;
			ctx.beginPath();
			ctx.arc(cx, cy, r * 2.5, 0, Math.PI * 2);
			ctx.fill();

			ctx.fillStyle = "rgba(240, 252, 255, 0.9)";
			ctx.beginPath();
			ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2);
			ctx.fill();
		}

		// ── ARMS: cup pose with full energy orb ───────────────────
		function drawArmsBuild(t: number) {
			p(8, 12, 6, 3, C.O);
			p(8, 12, 1, 3, C.T);
			p(6, 14, 4, 3, C.O);
			p(6, 14, 1, 3, C.Q);
			p(5, 16, 4, 2, C.S);
			p(5, 16, 1, 2, C.D);
			p(8, 17, 1, 1, C.K);
			p(5, 18, 1, 1, C.K);
			p(6, 18, 2, 1, C.S);
			p(6, 18, 1, 1, C.D);

			const cx = OX + 6.5 * SCALE;
			const cy = OY + 17 * SCALE;
			const r = 11 + Math.sin(t * 14) * 3;

			// Outer halo
			const og = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 2.8);
			og.addColorStop(0, "rgba(40, 216, 255, 0.55)");
			og.addColorStop(0.5, "rgba(40, 216, 255, 0.18)");
			og.addColorStop(1, "rgba(40, 216, 255, 0)");
			ctx.fillStyle = og;
			ctx.beginPath();
			ctx.arc(cx, cy, r * 2.8, 0, Math.PI * 2);
			ctx.fill();

			// Core sphere
			const cg = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 0, cx, cy, r);
			cg.addColorStop(0, "#ffffff");
			cg.addColorStop(0.35, "#F0FAFF");
			cg.addColorStop(0.75, "#28D8FF");
			cg.addColorStop(1, "rgba(20, 100, 200, 0.6)");
			ctx.fillStyle = cg;
			ctx.beginPath();
			ctx.arc(cx, cy, r, 0, Math.PI * 2);
			ctx.fill();

			// Sparkle particles
			for (let i = 0; i < 7; i++) {
				const angle = (i / 7) * Math.PI * 2 + t * 3;
				const pr = r * 1.6 + Math.sin(t * 9 + i) * 5;
				const sx = cx + Math.cos(angle) * pr;
				const sy = cy + Math.sin(angle) * pr;
				const sz = SCALE * 0.65;
				ctx.fillStyle = `rgba(200, 250, 255, ${0.4 + Math.random() * 0.4})`;
				ctx.fillRect(sx - sz / 2, sy - sz / 2, sz, sz);
			}
		}

		// ── ARMS: thrusting forward to right ─────────────────────
		function drawArmsRelease(subFrame: number) {
			if (subFrame === 0) {
				// Mid-thrust
				p(10, 12, 5, 2, C.O);
				p(13, 13, 4, 2, C.O);
				p(16, 14, 2, 1, C.S);
				p(10, 15, 6, 2, C.O);
				p(15, 16, 3, 1, C.S);
			} else if (subFrame === 1) {
				// Nearly extended
				p(13, 12, 8, 2, C.O);
				p(20, 12, 2, 2, C.S);
				p(13, 14, 8, 2, C.O);
				p(20, 14, 2, 2, C.S);
			} else {
				// Fully extended to right
				p(15, 12, 7, 2, C.O);
				p(15, 12, 7, 1, C.T);
				p(22, 12, 3, 2, C.S);
				p(21, 12, 1, 2, C.B); // wristband
				p(15, 14, 7, 2, C.O);
				p(15, 15, 7, 1, C.Q);
				p(22, 14, 3, 2, C.S);
				p(21, 14, 1, 2, C.B);
			}
		}

		// ── ARMS: sustained blast pose ───────────────────────────
		function drawArmsSustain() {
			p(15, 12, 7, 2, C.O);
			p(15, 12, 7, 1, C.T);
			p(22, 12, 3, 2, C.S);
			p(21, 12, 1, 2, C.B);
			p(15, 14, 7, 2, C.O);
			p(15, 15, 7, 1, C.Q);
			p(22, 14, 3, 2, C.S);
			p(21, 14, 1, 2, C.B);
		}

		// ── AURA (yellow/orange, pulses around body) ─────────────
		function drawAura(intensity: number, t: number) {
			if (intensity <= 0) return;
			const cx = OX + 12 * SCALE;
			const cy = OY + 18 * SCALE;
			const r = 40 + 30 * intensity + Math.sin(t * 5) * 10;

			const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
			g.addColorStop(0, `rgba(255, 216, 72, ${0.22 * intensity})`);
			g.addColorStop(0.5, `rgba(255, 120, 32, ${0.1 * intensity})`);
			g.addColorStop(1, "rgba(255, 80, 10, 0)");
			ctx.fillStyle = g;
			ctx.beginPath();
			ctx.arc(cx, cy, r, 0, Math.PI * 2);
			ctx.fill();

			// Pixel-art aura spike particles
			if (intensity > 0.4) {
				for (let i = 0; i < 9; i++) {
					const angle = (i / 9) * Math.PI * 2 + t * 1.8;
					const sr = r * (0.7 + Math.sin(t * 6 + i) * 0.35);
					const sx = cx + Math.cos(angle) * sr;
					const sy = cy + Math.sin(angle) * sr;
					const sz = SCALE * (0.7 + Math.sin(t * 8 + i) * 0.3);
					ctx.fillStyle = `rgba(255, 230, 80, ${0.45 + Math.sin(t * 7 + i) * 0.2})`;
					ctx.fillRect(sx - sz / 2, sy - sz / 2, sz, sz);
				}
			}
		}

		// ── SHOCKWAVE (expanding rings on release) ───────────────
		function drawShockwave(progress: number) {
			const cx = OX + 14 * SCALE;
			const cy = OY + 16 * SCALE;
			const r = 30 + 70 * progress;
			const alpha = 0.65 * (1 - progress);

			ctx.strokeStyle = `rgba(220, 240, 255, ${alpha})`;
			ctx.lineWidth = SCALE * 0.45;
			for (let i = 0; i < 8; i++) {
				const angle = (i / 8) * Math.PI * 2;
				const x1 = cx + Math.cos(angle) * r;
				const y1 = cy + Math.sin(angle) * r;
				const x2 = cx + Math.cos(angle) * (r + SCALE * 1.5);
				const y2 = cy + Math.sin(angle) * (r + SCALE * 1.5);
				ctx.beginPath();
				ctx.moveTo(x1, y1);
				ctx.lineTo(x2, y2);
				ctx.stroke();
			}
		}

		// ── BEAM (multi-layer Kamehameha) ─────────────────────────
		function drawBeam(progress: number, t: number) {
			if (progress <= 0) return;
			const startX = BEAM_X;
			const targetW = CW - startX + 8;
			const bw = targetW * Math.min(progress, 1);
			const bh = 6 * SCALE;
			const midY = BEAM_MID;

			// Outer glow layers
			for (let i = 3; i >= 1; i--) {
				const h = bh * (1 + i * 0.7);
				const g = ctx.createLinearGradient(startX, midY - h / 2, startX, midY + h / 2);
				g.addColorStop(0, "rgba(40, 180, 255, 0)");
				g.addColorStop(0.5, `rgba(80, 220, 255, ${0.1 / i})`);
				g.addColorStop(1, "rgba(40, 180, 255, 0)");
				ctx.fillStyle = g;
				ctx.fillRect(startX, midY - h / 2, bw, h);
			}

			// Main beam body
			const mg = ctx.createLinearGradient(startX, midY - bh / 2, startX, midY + bh / 2);
			mg.addColorStop(0, "rgba(120, 230, 255, 0.7)");
			mg.addColorStop(0.3, "rgba(40, 216, 255, 0.95)");
			mg.addColorStop(0.5, "rgba(255, 255, 255, 1.0)");
			mg.addColorStop(0.7, "rgba(40, 216, 255, 0.95)");
			mg.addColorStop(1, "rgba(120, 230, 255, 0.7)");
			ctx.fillStyle = mg;
			ctx.fillRect(startX, midY - bh / 2, bw, bh);

			// Bright white core
			ctx.fillStyle = "rgba(240, 252, 255, 0.98)";
			ctx.fillRect(startX, midY - SCALE * 0.7, bw, SCALE * 1.4);

			// Edge shimmer
			const flicker = Math.sin(t * 25) * 0.3 + 0.7;
			ctx.fillStyle = `rgba(255, 255, 255, ${flicker * 0.5})`;
			ctx.fillRect(startX, midY - SCALE * 0.3, bw, SCALE * 0.6);

			// Pulsing wide bulge at beam source
			const sourceR = bh * (1.2 + Math.sin(t * 18) * 0.15);
			const sg = ctx.createRadialGradient(startX, midY, 0, startX, midY, sourceR * 1.5);
			sg.addColorStop(0, "rgba(255, 255, 255, 0.9)");
			sg.addColorStop(0.4, "rgba(160, 240, 255, 0.6)");
			sg.addColorStop(1, "rgba(40, 200, 255, 0)");
			ctx.fillStyle = sg;
			ctx.beginPath();
			ctx.arc(startX, midY, sourceR * 1.5, 0, Math.PI * 2);
			ctx.fill();

			// Pixel particles along beam edges
			const particleCount = Math.floor(bw / 25);
			for (let i = 0; i < particleCount; i++) {
				const px2 = startX + (bw * (i + 0.5) / particleCount) + (Math.random() - 0.5) * 6;
				const py2 = midY + (Math.random() > 0.5 ? -bh / 2 - SCALE * 0.5 : bh / 2 + SCALE * 0.2);
				ctx.fillStyle = `rgba(180, 240, 255, ${0.3 + Math.random() * 0.5})`;
				ctx.fillRect(px2, py2, SCALE * 0.7, SCALE * 0.7);
			}
		}

		type PhaseName = "stance" | "cup" | "charge" | "build" | "release" | "sustain";

		function getPhase(frame: number): { name: PhaseName; subFrame: number; progress: number } {
			if (frame < START.cup) {
				return { name: "stance", subFrame: frame, progress: frame / FRAMES.stance };
			} else if (frame < START.charge) {
				const sf = frame - START.cup;
				return { name: "cup", subFrame: sf, progress: sf / FRAMES.cup };
			} else if (frame < START.build) {
				const sf = frame - START.charge;
				return { name: "charge", subFrame: sf, progress: sf / FRAMES.charge };
			} else if (frame < START.release) {
				const sf = frame - START.build;
				return { name: "build", subFrame: sf, progress: sf / FRAMES.build };
			} else if (frame < START.sustain) {
				const sf = frame - START.release;
				return { name: "release", subFrame: sf, progress: sf / FRAMES.release };
			} else {
				const sf = frame - START.sustain;
				return { name: "sustain", subFrame: sf, progress: sf / FRAMES.sustain };
			}
		}

		function render(elapsed: number) {
			const t = elapsed / 1000;
			const frame = Math.floor(elapsed / FRAME_MS);
			const phase = getPhase(frame);

			// Deep space background
			ctx.fillStyle = "#06031A";
			ctx.fillRect(0, 0, CW, CH);

			// Twinkling stars
			stars.forEach((star) => {
				const a = 0.35 + Math.sin(t * 1.5 + star.phase) * 0.3;
				ctx.fillStyle = `rgba(200, 210, 255, ${a})`;
				ctx.fillRect(star.x, star.y, star.r, star.r);
			});

			// Aura intensity by phase
			let auraIntensity = 0;
			if (phase.name === "cup") auraIntensity = 0.3 * phase.progress;
			else if (phase.name === "charge") auraIntensity = 0.4 + 0.4 * phase.progress;
			else if (phase.name === "build") auraIntensity = 0.85;
			else if (phase.name === "release" || phase.name === "sustain") auraIntensity = 0.55;

			drawAura(auraIntensity, t);

			// Body
			const wide = phase.name !== "stance";
			const intense =
				phase.name === "charge" ||
				phase.name === "build" ||
				phase.name === "release" ||
				phase.name === "sustain";

			drawHair();
			drawFace(intense);
			drawTorso();
			drawBelt();
			drawHips();
			drawLegs(wide);
			drawBoots(wide);

			// Arms by phase
			switch (phase.name) {
				case "stance":
					drawArmsStance();
					break;
				case "cup":
					drawArmsCup(phase.progress);
					break;
				case "charge":
					drawArmsCharge(t);
					break;
				case "build":
					drawArmsBuild(t);
					break;
				case "release":
					drawArmsRelease(phase.subFrame);
					drawShockwave(phase.progress);
					if (phase.subFrame >= 1) {
						const bp = (phase.subFrame - 1) / Math.max(FRAMES.release - 1, 1);
						drawBeam(bp, t);
					}
					break;
				case "sustain":
					drawArmsSustain();
					drawBeam(1, t);
					break;
			}

			// Bright screen flash on first beam frames
			if (phase.name === "release" && phase.subFrame <= 1) {
				const flashA = 0.55 - phase.subFrame * 0.28;
				ctx.fillStyle = `rgba(200, 240, 255, ${flashA})`;
				ctx.fillRect(0, 0, CW, CH);
			}
		}

		function animate(timestamp: number) {
			if (startTime === null) startTime = timestamp;
			const elapsed = timestamp - startTime;

			if (elapsed >= LOOP_MS) {
				startTime = null;
				animId = requestAnimationFrame(animate);
				return;
			}

			render(elapsed);
			animId = requestAnimationFrame(animate);
		}

		animId = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(animId);
	}, []);

	return (
		<canvas
			ref={canvasRef}
			width={CW}
			height={CH}
			className="w-full max-w-[20rem] sm:max-w-[28rem] md:max-w-[34rem]"
			style={{ imageRendering: "pixelated" }}
		/>
	);
}
