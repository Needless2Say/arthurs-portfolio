"use client";

import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

type FormStatus = "idle" | "sending" | "success" | "error";

const SERVICE_ID  = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID  ?? "";
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "";
const PUBLIC_KEY  = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY  ?? "";

// PL-070: best-effort client-side abuse controls (honeypot + send cooldown). The
// authoritative quota/abuse guard is the EmailJS dashboard (Allowed Origins +
// rate limit) — see README — since any client control is bypassable.
const COOLDOWN_MS = 45_000;
const LAST_SENT_KEY = "contact_last_sent";

function readLastSent(): number {
	try {
		return Number(localStorage.getItem(LAST_SENT_KEY)) || 0;
	} catch {
		return 0;
	}
}

function writeLastSent(ts: number): void {
	try {
		localStorage.setItem(LAST_SENT_KEY, String(ts));
	} catch {
		/* localStorage unavailable (private mode) — cooldown is best-effort */
	}
}

export default function ContactForm() {
	const formRef = useRef<HTMLFormElement>(null);
	const honeypotRef = useRef<HTMLInputElement>(null);
	const [status, setStatus] = useState<FormStatus>("idle");
	const [errorMsg, setErrorMsg] = useState("");

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!formRef.current) return;

		// Honeypot: a human never fills the off-screen "company" field. If it's
		// set, the submitter is almost certainly a bot — silently feign success
		// (so it doesn't learn it was filtered) and send nothing.
		if (honeypotRef.current?.value) {
			setStatus("success");
			formRef.current.reset();
			return;
		}

		// Client-side cooldown — throttles rapid resubmits from one browser.
		const sinceLast = Date.now() - readLastSent();
		if (sinceLast < COOLDOWN_MS) {
			const wait = Math.ceil((COOLDOWN_MS - sinceLast) / 1000);
			setErrorMsg(`Please wait ${wait}s before sending another message.`);
			setStatus("error");
			return;
		}

		if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
			setErrorMsg("Email service not configured — please reach out directly.");
			setStatus("error");
			return;
		}

		setStatus("sending");
		setErrorMsg("");

		try {
			await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, { publicKey: PUBLIC_KEY });
			writeLastSent(Date.now());
			setStatus("success");
			formRef.current.reset();
		} catch (err: unknown) {
			const e = err as { status?: number; text?: string };
			const detail = e.status
				? `[${e.status}] ${e.text ?? "unknown error"}`
				: "Network error — check credentials or allowed origins in EmailJS dashboard.";
			setErrorMsg(`Send failed: ${detail}`);
			setStatus("error");
			console.error("EmailJS error — status:", e.status, "text:", e.text, err);
		}
	}

	return (
		<form ref={formRef} onSubmit={handleSubmit} className="space-y-4" noValidate>
			{/* Honeypot — off-screen, hidden from humans & assistive tech; bots that
			    auto-fill it are silently dropped in handleSubmit (PL-070). */}
			<div aria-hidden="true" className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
				<label htmlFor="company">Company (leave this field blank)</label>
				<input
					ref={honeypotRef}
					id="company"
					name="company"
					type="text"
					tabIndex={-1}
					autoComplete="off"
				/>
			</div>

			{/* Name + Email row */}
			<div className="grid sm:grid-cols-2 gap-4">
				<div>
					<label htmlFor="from_name" className="block text-slate-400 font-mono text-xs uppercase tracking-widest mb-1.5">
						Name
					</label>
					<input
						id="from_name"
						name="from_name"
						type="text"
						required
						placeholder="Your name"
						className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/60 focus:shadow-[0_0_12px_rgba(37,99,235,0.2)] transition-all duration-200"
					/>
				</div>
				<div>
					<label htmlFor="reply_to" className="block text-slate-400 font-mono text-xs uppercase tracking-widest mb-1.5">
						Email
					</label>
					<input
						id="reply_to"
						name="reply_to"
						type="email"
						required
						placeholder="your@email.com"
						className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/60 focus:shadow-[0_0_12px_rgba(37,99,235,0.2)] transition-all duration-200"
					/>
				</div>
			</div>

			{/* Subject */}
			<div>
				<label htmlFor="subject" className="block text-slate-400 font-mono text-xs uppercase tracking-widest mb-1.5">
					Subject
				</label>
				<input
					id="subject"
					name="subject"
					type="text"
					required
					placeholder="What's this about?"
					className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/60 focus:shadow-[0_0_12px_rgba(37,99,235,0.2)] transition-all duration-200"
				/>
			</div>

			{/* Message */}
			<div>
				<label htmlFor="message" className="block text-slate-400 font-mono text-xs uppercase tracking-widest mb-1.5">
					Message
				</label>
				<textarea
					id="message"
					name="message"
					required
					rows={5}
					placeholder="Tell me what's on your mind..."
					className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/60 focus:shadow-[0_0_12px_rgba(37,99,235,0.2)] transition-all duration-200 resize-none"
				/>
			</div>

			{/* Status messages */}
			{status === "success" && (
				<div className="flex items-center gap-2 text-emerald-400 text-sm font-mono bg-emerald-950/40 border border-emerald-700/30 rounded-lg px-4 py-3">
					<svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
						<path d="m5 13 4 4L19 7" />
					</svg>
					Message sent — I&apos;ll get back to you soon.
				</div>
			)}
			{status === "error" && (
				<div className="flex items-center gap-2 text-red-400 text-sm font-mono bg-red-950/40 border border-red-700/30 rounded-lg px-4 py-3">
					<svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
						<circle cx="12" cy="12" r="10" /><path d="m15 9-6 6M9 9l6 6" />
					</svg>
					{errorMsg}
				</div>
			)}

			{/* Submit */}
			<button
				type="submit"
				disabled={status === "sending" || status === "success"}
				className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900/50 disabled:text-blue-400 text-white font-semibold text-sm transition-all duration-200 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2"
			>
				{status === "sending" ? (
					<>
						<svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
							<circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12" />
						</svg>
						Sending...
					</>
				) : status === "success" ? (
					<>
						<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
							<path d="m5 13 4 4L19 7" />
						</svg>
						Sent!
					</>
				) : (
					"Send Message"
				)}
			</button>
		</form>
	);
}
