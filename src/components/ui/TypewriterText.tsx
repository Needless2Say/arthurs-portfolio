"use client";

import { useState, useEffect } from "react";

const ROLES = [
	"Software Engineer",
	"Data Engineer",
	"Full-Stack Developer",
	"ML Enthusiast",
];

export default function TypewriterText() {
	const [roleIndex, setRoleIndex] = useState(0);
	const [displayed, setDisplayed] = useState("");
	const [phase, setPhase] = useState<"typing" | "holding" | "deleting">("typing");

	useEffect(() => {
		const target = ROLES[roleIndex];

		if (phase === "typing") {
			if (displayed.length < target.length) {
				const id = setTimeout(
					() => setDisplayed(target.slice(0, displayed.length + 1)),
					60
				);
				return () => clearTimeout(id);
			}
			const id = setTimeout(() => setPhase("holding"), 1800);
			return () => clearTimeout(id);
		}

		if (phase === "holding") {
			const id = setTimeout(() => setPhase("deleting"), 400);
			return () => clearTimeout(id);
		}

		if (phase === "deleting") {
			if (displayed.length > 0) {
				const id = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
				return () => clearTimeout(id);
			}
			setRoleIndex((i) => (i + 1) % ROLES.length);
			setPhase("typing");
		}
	}, [displayed, phase, roleIndex]);

	return (
		<>
			{displayed}
			<span className="animate-pulse text-purple-400">|</span>
		</>
	);
}