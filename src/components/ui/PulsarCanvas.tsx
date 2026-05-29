"use client";
import { useEffect, useRef } from "react";

const W = 320, H = 200;
const CX = W / 2, CY = H / 2;
const PULSE_MS = 1100;

let _s = 17;
const sr = () => { _s = ((_s * 1664525 + 1013904223) >>> 0); return _s / 0xffffffff; };
const BG: [number, number, number][] = Array.from({ length: 70 }, () => [sr() * W, sr() * H, 0.1 + sr() * 0.55]);

interface Ring { r: number; a: number }
interface Debris { angle: number; r: number; spd: number }

export default function PulsarCanvas() {
	const ref = useRef<HTMLCanvasElement>(null);
	useEffect(() => {
		const cv = ref.current; if (!cv) return;
		const ctx = cv.getContext("2d"); if (!ctx) return;
		const c = ctx;

		const rings: Ring[] = [];
		const debris: Debris[] = Array.from({ length: 55 }, () => ({
			angle: Math.random() * Math.PI * 2,
			r: 30 + Math.random() * 22,
			spd: 0.8 + Math.random() * 1.8,
		}));

		let last: number | null = null, lastPulse = 0, beamAngle = 0, id: number;

		c.fillStyle = "#00000a"; c.fillRect(0, 0, W, H);

		function drawBeam(angle: number, len: number, alpha: number) {
			c.save(); c.translate(CX, CY); c.rotate(angle);
			const g = c.createLinearGradient(0, 0, len, 0);
			g.addColorStop(0,   `rgba(255,255,255,${alpha})`);
			g.addColorStop(0.2, `rgba(160,210,255,${alpha * 0.75})`);
			g.addColorStop(0.7, `rgba(80,140,255,${alpha * 0.3})`);
			g.addColorStop(1,   "rgba(40,80,255,0)");
			c.beginPath(); c.moveTo(0, -4); c.lineTo(len, 0); c.lineTo(0, 4); c.closePath();
			c.fillStyle = g; c.fill(); c.restore();
		}

		function frame(ts: number) {
			if (last === null) { last = ts; lastPulse = ts; }
			const dt = Math.min((ts - last) / 1000, 0.05); last = ts;

			c.fillStyle = "rgba(0,0,8,0.32)"; c.fillRect(0, 0, W, H);

			// Stars
			for (const [sx, sy, a] of BG) { c.fillStyle = `rgba(210,220,255,${a * 0.35})`; c.fillRect(sx | 0, sy | 0, 1, 1); }

			// Beams rotate
			beamAngle += 2.6 * dt;
			drawBeam(beamAngle,           108, 0.72);
			drawBeam(beamAngle + Math.PI, 108, 0.72);

			// Side X-ray jets (perpendicular, dimmer)
			drawBeam(beamAngle + Math.PI / 2, 60, 0.18);
			drawBeam(beamAngle - Math.PI / 2, 60, 0.18);

			// Pulse emission
			if (ts - lastPulse > PULSE_MS) { rings.push({ r: 14, a: 0.85 }); lastPulse = ts; }

			// Expand pulse rings
			for (let i = rings.length - 1; i >= 0; i--) {
				rings[i].r += 65 * dt;
				rings[i].a -= 0.55 * dt;
				if (rings[i].a <= 0) { rings.splice(i, 1); continue; }
				c.strokeStyle = `rgba(160,210,255,${rings[i].a})`;
				c.lineWidth = 1.8;
				c.beginPath(); c.arc(CX, CY, rings[i].r, 0, Math.PI * 2); c.stroke();
			}

			// Debris accretion ring
			for (const d of debris) {
				d.angle += d.spd * dt;
				const x = CX + Math.cos(d.angle) * d.r;
				const y = CY + Math.sin(d.angle) * d.r * 0.38;
				c.fillStyle = "rgba(210,190,155,0.55)";
				c.fillRect(x | 0, y | 0, 1, 1);
			}

			// Core — pulsating with beam rotation
			const coreBright = 0.75 + 0.25 * Math.cos(beamAngle * 2);
			const core = c.createRadialGradient(CX, CY, 0, CX, CY, 18);
			core.addColorStop(0, `rgba(255,255,255,${coreBright})`);
			core.addColorStop(0.35, `rgba(200,230,255,${coreBright * 0.8})`);
			core.addColorStop(0.7, `rgba(120,160,255,${coreBright * 0.25})`);
			core.addColorStop(1, "rgba(80,100,255,0)");
			c.fillStyle = core; c.beginPath(); c.arc(CX, CY, 18, 0, Math.PI * 2); c.fill();

			id = requestAnimationFrame(frame);
		}

		id = requestAnimationFrame(frame);
		return () => cancelAnimationFrame(id);
	}, []);

	return <canvas ref={ref} width={W} height={H} className="w-64 sm:w-72 h-auto rounded-md" style={{ imageRendering: "auto" }} />;
}
