"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import type { Clip } from "@/utils/clips";

/*
  One player that walks through every clip in public/videos.

  Behaviour worth knowing:

    1. It starts when it scrolls into view and pauses when it leaves, so a
       visitor who never reaches this section pays nothing for it.
    2. Browsers refuse to autoplay audible media without a user gesture, and a
       scroll is NOT a gesture as far as Chrome is concerned. So it always
       starts muted and sound is opt-in through the speaker button. After that
       click the choice sticks for the rest of the session.
    3. When a clip ends the next one starts, wrapping at the end. The next
       clip's file is warmed while the current one plays, otherwise every
       hand off stalls on a cold multi megabyte fetch.
    4. The frame is sized from the clip's real pixel dimensions and the video
       is object-contain, so the whole frame shows and nothing is cropped.
*/

// Session-scoped so the sound choice survives navigation but a new visit
// starts muted again. Deliberately not localStorage.
const SOUND_KEY = "kdf_clip_sound";

interface ClipSlideshowProps {
	clips: Clip[];
	className?: string;
}

export default function ClipSlideshow({ clips, className }: ClipSlideshowProps) {
	const hostRef = useRef<HTMLDivElement>(null);
	const videoRef = useRef<HTMLVideoElement>(null);

	const [index, setIndex] = useState(0);
	// Gates the src so nothing is fetched until the slideshow is close.
	const [armed, setArmed] = useState(false);
	const [inView, setInView] = useState(false);
	const [playing, setPlaying] = useState(false);
	const [muted, setMuted] = useState(true);
	const [reduced, setReduced] = useState(false);
	const [progress, setProgress] = useState(0);

	const current = clips[index];
	const upcoming = clips.length > 1 ? clips[(index + 1) % clips.length] : undefined;

	/*
	  All playback goes through here. If the browser refuses audible playback we
	  fall back to muted rather than leaving a frozen poster, which is what
	  happens if you assume play() resolved.
	*/
	const attemptPlay = useCallback(async (withSound: boolean) => {
		const video = videoRef.current;
		if (!video) return;

		video.muted = !withSound;
		try {
			await video.play();
			setMuted(!withSound);
		} catch {
			if (!withSound) return; // already muted and still refused, leave it
			video.muted = true;
			setMuted(true);
			try {
				await video.play();
			} catch {
				// autoplay is off entirely, the poster stays put
			}
		}
	}, []);

	// Honour the OS reduced-motion setting, and react if it changes live.
	useEffect(() => {
		const query = window.matchMedia("(prefers-reduced-motion: reduce)");
		setReduced(query.matches);

		const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
		query.addEventListener("change", onChange);
		return () => query.removeEventListener("change", onChange);
	}, []);

	// Fetch early, play late. The margin gives the first clip a head start so
	// it is decodable by the time the slideshow is actually on screen.
	useEffect(() => {
		const host = hostRef.current;
		// Under reduced motion nothing plays unprompted, so don't spend the
		// visitor's bandwidth on a file they may never ask for.
		if (!host || reduced) return;

		const preloader = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setArmed(true);
					preloader.unobserve(host);
				}
			},
			{ rootMargin: "400px 0px" }
		);

		preloader.observe(host);
		return () => preloader.disconnect();
	}, [reduced]);

	useEffect(() => {
		const host = hostRef.current;
		if (!host) return;

		const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
			threshold: 0.35,
		});

		observer.observe(host);
		return () => observer.disconnect();
	}, []);

	/*
	  The single place playback is driven from. index is a dependency, so
	  advancing to the next clip and jumping via the selector both land here
	  and start the new file the same way.
	*/
	useEffect(() => {
		const video = videoRef.current;
		if (!video || reduced) return;

		if (inView && armed) {
			void attemptPlay(sessionStorage.getItem(SOUND_KEY) === "on");
			setPlaying(true);
		} else {
			video.pause();
			setPlaying(false);
		}
	}, [inView, armed, index, reduced, attemptPlay]);

	// A hidden tab should never keep making noise.
	useEffect(() => {
		const onVisibility = () => {
			const video = videoRef.current;
			if (!video || !document.hidden) return;
			video.pause();
			setPlaying(false);
		};

		document.addEventListener("visibilitychange", onVisibility);
		return () => document.removeEventListener("visibilitychange", onVisibility);
	}, []);

	const advance = () => {
		setProgress(0);
		setIndex((i) => (i + 1) % clips.length);
	};

	const select = (i: number) => {
		setProgress(0);
		setArmed(true); // a click means they want it now, even under reduced motion
		setIndex(i);
		if (reduced) {
			setPlaying(true);
			void attemptPlay(sessionStorage.getItem(SOUND_KEY) === "on");
		}
	};

	/*
	  This click is the user gesture the autoplay policy wants, so unmuting here
	  is always allowed. Recording it lets later clips start with sound on.
	*/
	const toggleSound = () => {
		const wantSound = muted; // currently muted means the click asks for sound
		sessionStorage.setItem(SOUND_KEY, wantSound ? "on" : "off");
		void attemptPlay(wantSound);
	};

	const manualStart = () => {
		setArmed(true);
		setPlaying(true);
		void attemptPlay(sessionStorage.getItem(SOUND_KEY) === "on");
	};

	if (!current) return null;

	return (
		<div ref={hostRef} className={cn("w-full", className)}>
			{/* Header sits above the player, never over the footage. */}
			<div className="mb-3 flex items-baseline gap-3">
				<span className="shrink-0 font-mono text-[10px] tracking-[0.3em] text-yellow-400/60">
					{current.ordinal}
					<span className="text-slate-600"> / {String(clips.length).padStart(2, "0")}</span>
				</span>
				<h3 className="text-white text-lg font-bold leading-tight">{current.fullLabel}</h3>
			</div>

			{/*
			  aspectRatio comes from the clip's real dimensions, so the frame is
			  exactly the shape of the video and object-contain has nothing to
			  letterbox.
			*/}
			<div
				className="relative w-full overflow-hidden rounded-2xl border border-white/5 bg-slate-950/60"
				style={{ aspectRatio: `${current.width} / ${current.height}` }}
			>
				{/*
				  src is bound rather than using a <source> child on purpose.
				  Adding a <source> to a video the browser has already resolved
				  does not start a new load, so the clip would never play.
				  Setting the src attribute does run the load algorithm, which is
				  also what makes swapping clips work.
				*/}
				<video
					ref={videoRef}
					src={armed ? current.src : undefined}
					poster={current.poster}
					muted={muted}
					playsInline
					preload="auto"
					tabIndex={-1}
					onEnded={advance}
					onTimeUpdate={(e) => {
						const v = e.currentTarget;
						if (v.duration) setProgress(v.currentTime / v.duration);
					}}
					className="absolute inset-0 h-full w-full object-contain"
				/>

				{/* Progress across the current clip. */}
				<div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/10">
					<div
						className="h-full bg-yellow-400/70 transition-[width] duration-200 ease-linear"
						style={{ width: `${Math.round(progress * 100)}%` }}
					/>
				</div>

				<div className="absolute bottom-3 right-3 flex gap-2">
					{reduced && !playing && (
						<button
							type="button"
							onClick={manualStart}
							className="rounded-full border border-white/15 bg-slate-950/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-300 backdrop-blur transition-colors hover:border-blue-500/40 hover:text-white"
						>
							Play
						</button>
					)}

					{playing && (
						<button
							type="button"
							onClick={toggleSound}
							aria-pressed={!muted}
							aria-label={muted ? "Turn sound on" : "Turn sound off"}
							className="rounded-full border border-white/15 bg-slate-950/80 p-2 text-slate-300 backdrop-blur transition-colors hover:border-blue-500/40 hover:text-white"
						>
							{muted ? <MutedIcon /> : <SoundIcon />}
						</button>
					)}
				</div>
			</div>

			{/*
			  Warms the next file while the current one plays. Without it every
			  hand off stalls on a cold fetch of several megabytes.
			*/}
			{playing && upcoming && (
				<video
					key={upcoming.name}
					src={upcoming.src}
					preload="auto"
					muted
					playsInline
					aria-hidden="true"
					tabIndex={-1}
					className="hidden"
				/>
			)}

			{/* Selector. Scrolls sideways on narrow screens rather than squashing. */}
			<div
				className="mt-4 flex gap-2 overflow-x-auto pb-1"
				role="tablist"
				aria-label="Choose a clip"
			>
				{clips.map((clip, i) => (
					<button
						key={clip.name}
						type="button"
						role="tab"
						aria-selected={i === index}
						aria-label={`Play ${clip.label}`}
						onClick={() => select(i)}
						className={cn(
							"group w-20 shrink-0 text-left transition-opacity",
							i === index ? "opacity-100" : "opacity-55 hover:opacity-90"
						)}
					>
						<div
							className={cn(
								"overflow-hidden rounded-lg border transition-colors",
								i === index
									? "border-yellow-400/70 shadow-[0_0_14px_rgba(250,204,21,0.18)]"
									: "border-white/10 group-hover:border-blue-500/40"
							)}
							style={{ aspectRatio: `${clip.width} / ${clip.height}` }}
						>
							{clip.poster ? (
								// eslint-disable-next-line @next/next/no-img-element
								<img
									src={clip.poster}
									alt=""
									loading="lazy"
									className="h-full w-full object-cover"
								/>
							) : (
								<div className="h-full w-full bg-slate-900" />
							)}
						</div>
						<p
							className={cn(
								"mt-1.5 font-mono text-[9px] leading-tight",
								i === index ? "text-yellow-400/70" : "text-slate-500"
							)}
						>
							{clip.ordinal}
						</p>
						<p
							className={cn(
								"text-[10px] leading-tight",
								i === index ? "text-white" : "text-slate-400"
							)}
						>
							{clip.label}
						</p>
					</button>
				))}
			</div>
		</div>
	);
}

function MutedIcon() {
	return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
			<path d="M11 5 6 9H2v6h4l5 4V5z" strokeLinecap="round" strokeLinejoin="round" />
			<path d="m23 9-6 6M17 9l6 6" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

function SoundIcon() {
	return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
			<path d="M11 5 6 9H2v6h4l5 4V5z" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}
