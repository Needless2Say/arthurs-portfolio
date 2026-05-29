import type { Metadata } from "next";
import Card from "@/components/ui/Card";
import TechBadge from "@/components/ui/TechBadge";
import SectionHeader from "@/components/ui/SectionHeader";
import { BLOG_POSTS } from "@/constants/blog";

export const metadata: Metadata = {
	title: "Blog",
	description:
		"Technical writing by Arthur Krieger — thoughts on software engineering, data pipelines, machine learning, fitness technology, and building KriegerDataForge.",
	alternates: { canonical: "https://needless2say.github.io/arthurs-portfolio/blog" },
	openGraph: {
		title: "Blog | Arthur Krieger & KriegerDataForge",
		description:
			"Software engineering, data, ML, fitness technology, and lessons from building KriegerDataForge — by Arthur Krieger.",
		url: "https://needless2say.github.io/arthurs-portfolio/blog",
	},
};

export default function Blog() {
	return (
		<div className="min-h-screen pt-24 pb-16 px-4">
			<div className="max-w-3xl mx-auto">
				<SectionHeader
					title="Blog"
					subtitle="Thoughts on code, data, and building things."
				/>

				{BLOG_POSTS.length > 0 ? (
					<div className="space-y-4">
						{BLOG_POSTS.map((post) => (
							<Card key={post.slug} glow="blue" className="group cursor-default">
								<h2 className="text-white font-bold text-lg mb-2 group-hover:text-blue-300 transition-colors">
									{post.title}
								</h2>

								<p className="text-slate-400 text-sm leading-relaxed mb-4">
									{post.excerpt}
								</p>

								<div className="flex flex-wrap gap-1.5 mb-4">
									{post.tags.map((tag) => (
										<TechBadge key={tag} label={tag} color="nebula" />
									))}
								</div>

								<div className="flex items-center gap-4 text-slate-500 font-mono text-xs">
									<span>{post.date}</span>
									<span>·</span>
									<span>{post.readTime} min read</span>
								</div>
							</Card>
						))}
					</div>
				) : (
					<div className="text-center py-20">
						<div className="flex items-center justify-center gap-3 mb-8 text-slate-800 select-none font-mono text-lg tracking-widest">
							<span className="animate-pulse-glow">✦</span>
							<span>✦</span>
							<span className="animate-pulse-glow" style={{ animationDelay: "1.2s" }}>✦</span>
						</div>
						<p className="text-white font-bold text-2xl mb-3 glow-text">
							Transmissions incoming.
						</p>
						<p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed mb-10">
							Writing is in progress. First posts deploying soon.
						</p>
						<div className="inline-flex items-center gap-2.5 glass-card px-5 py-2.5 border-white/5">
							<span className="relative flex h-1.5 w-1.5">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
								<span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500" />
							</span>
							<span className="text-slate-500 font-mono text-xs tracking-widest">signal pending...</span>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}