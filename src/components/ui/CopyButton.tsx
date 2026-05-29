"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
	const [copied, setCopied] = useState(false);

	const copy = async () => {
		await navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<button
			onClick={copy}
			className="text-sm text-slate-500 hover:text-blue-400 transition-colors font-mono"
		>
			{copied ? "✓ Copied" : "Copy"}
		</button>
	);
}