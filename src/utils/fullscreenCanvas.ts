/**
 * Size a canvas to fill the viewport at native device-pixel resolution and draw
 * in CSS-pixel coordinates (1 unit = 1 CSS px), so animations render natively at
 * full resolution — fine detail (thin lines, 1px stars) stays crisp instead of
 * being magnified from a small fixed buffer.
 *
 * Returns a live `dims` object (mutated on resize) and a cleanup function.
 * Drawing code should read `dims.w` / `dims.h` each frame so it re-fits on resize.
 */
export interface CanvasDims {
	w: number;
	h: number;
	dpr: number;
}

export function setupFullscreenCanvas(canvas: HTMLCanvasElement): {
	dims: CanvasDims;
	cleanup: () => void;
} {
	const ctx = canvas.getContext("2d");
	const dims: CanvasDims = { w: 1, h: 1, dpr: 1 };

	const apply = () => {
		const dpr = window.devicePixelRatio || 1;
		dims.w = window.innerWidth;
		dims.h = window.innerHeight;
		dims.dpr = dpr;

		canvas.width = Math.round(dims.w * dpr);
		canvas.height = Math.round(dims.h * dpr);

		// Draw in CSS pixels; the buffer is high-DPI for crisp output.
		ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
	};

	apply();
	window.addEventListener("resize", apply);
	return { dims, cleanup: () => window.removeEventListener("resize", apply) };
}
