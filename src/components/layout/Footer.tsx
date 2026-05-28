import Link from "next/link";
import { PERSONAL_INFO } from "@/constants/personal-info";

export default function Footer() {
	return (
		<footer className="relative z-10 mt-20 border-t border-white/5">
			<div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
				<span className="text-slate-600 text-sm font-mono">
					© {new Date().getFullYear()} Arthur Krieger
				</span>
				<div className="flex items-center gap-6">
					<Link
						href={PERSONAL_INFO.links.github}
						target="_blank"
						rel="noopener noreferrer"
						className="text-slate-500 hover:text-white transition-colors text-sm"
					>
						GitHub
					</Link>
					<Link
						href={PERSONAL_INFO.links.linkedin}
						target="_blank"
						rel="noopener noreferrer"
						className="text-slate-500 hover:text-white transition-colors text-sm"
					>
						LinkedIn
					</Link>
					<Link
						href={PERSONAL_INFO.links.instagram}
						target="_blank"
						rel="noopener noreferrer"
						className="text-slate-500 hover:text-white transition-colors text-sm"
					>
						Instagram
					</Link>
				</div>
			</div>
		</footer>
	);
}