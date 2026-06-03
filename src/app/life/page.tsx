import type { Metadata } from "next";
import SectionHeader from "@/components/ui/SectionHeader";
import Card from "@/components/ui/Card";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
	title: "Life",
	description: "Arthur Krieger outside of work — gaming, training along Lake Michigan, building personal projects, and the music that fuels it all.",
	alternates: { canonical: "https://needless2say.github.io/arthurs-portfolio/life" },
	openGraph: {
		title: "Life | Arthur Krieger",
		description: "Gaming, running half marathons at 4:30 AM, biking the Chicago Lakefront Trail, and fine-tuning ML models for fun.",
		url: "https://needless2say.github.io/arthurs-portfolio/life",
	},
};

const GAMES = [
	"Minecraft",
	"Terraria",
	"Expedition 33",
	"Crimson Desert",
	"Cyberpunk 2077",
	"Forza Horizon 6",
	"Ghost of Tsushima",
	"Monster Hunter World & Wilds",
];

const EXERCISE = [
	{
		activity: "Swimming",
		detail: "Lake Michigan swims whenever the season allows. Nothing beats open water swim sessions.",
	},
	{
		activity: "Half Marathons",
		detail: "4:30 AM runs along the Chicago lakefront before the city wakes up.",
	},
	{
		activity: "Lakefront Trail",
		detail: "Biking the full 36 mile Chicago Lakefront Trail end to end.",
	},
];

const FUN_CODING = [
	{
		label: "KriegerDataForge",
		detail: "My personal platform for data pipelines, full stack experiments, and anything I want to build without constraints.",
	},
	{
		label: "ML & AI",
		detail: "Fine tuning models locally on my workstation and building custom AI agents. My intersection of curiosity and compute.",
	},
];

const SONGS = [
	{ title: "Broly vs Gogeta Theme", videoId: "yNomaZGrM04" },
	{ title: "Sung Jin-Woo vs The Ant King Beru Theme", videoId: "2SxuQhqznjM" },
	{ title: "Infinite Castle Theme", videoId: "2NihzptRjto" },
	{ title: "Perfect Cell Theme", videoId: "GzX-FzckFv0" },
];

export default function Life() {
	return (
		<div className="min-h-screen pt-24 pb-16 px-4">
			<div className="max-w-4xl mx-auto">

				{/* ===== Hero ===== */}
				<Reveal className="mb-16">
					<div>
						<p className="font-mono text-[10px] tracking-[0.4em] uppercase text-yellow-400/50 mb-2">
							◇ BEYOND THE KEYBOARD ◇
						</p>
						<h1 className="text-4xl font-bold glow-text text-white mb-4 pb-2">
							Life Outside Work
						</h1>
						<p className="text-slate-300 text-base leading-relaxed max-w-2xl">
							When I&apos;m not engineering data platforms or shipping features, I&apos;m out running
							lakefront trails before sunrise, deep in an open world game, or tinkering with ML
							models on my personal rig.
						</p>
						<div className="h-px mt-6 animate-gradient-line" />
					</div>
				</Reveal>

				{/* ===== Video Games ===== */}
				<section className="mb-16">
					<Reveal>
						<SectionHeader
							title="Video Games"
							subtitle="Open worlds, survival builds, and boss fights. The games I keep coming back to."
						/>
					</Reveal>
					<Reveal delay={60}>
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
							{GAMES.map((game) => (
								<div
									key={game}
									className="glass-card p-4 border-white/5 hover:border-blue-500/30 hover:shadow-[0_0_20px_rgba(59,130,246,0.08)] transition-all duration-300 hover:-translate-y-1"
								>
									<p className="text-white text-sm font-medium leading-snug">{game}</p>
								</div>
							))}
						</div>
					</Reveal>
				</section>

				{/* ===== Exercise ===== */}
				<section className="mb-16">
					<Reveal>
						<SectionHeader
							title="Exercise"
							subtitle="Lake Michigan is my gym. Chicago is my track."
						/>
					</Reveal>
					<div className="grid gap-4 sm:grid-cols-3">
						{EXERCISE.map((item, i) => (
							<Reveal key={item.activity} delay={i * 80}>
								<Card glow="blue">
									<p className="text-blue-400 font-mono text-xs uppercase tracking-widest mb-2">
										{item.activity}
									</p>
									<p className="text-slate-300 text-sm leading-relaxed">{item.detail}</p>
								</Card>
							</Reveal>
						))}
					</div>
				</section>

				{/* ===== Coding for Fun ===== */}
				<section className="mb-16">
					<Reveal>
						<SectionHeader
							title="Coding for Fun"
							subtitle="The personal lab where the real experiments happen."
						/>
					</Reveal>
					<div className="grid gap-4 sm:grid-cols-2">
						{FUN_CODING.map((item, i) => (
							<Reveal key={item.label} delay={i * 80}>
								<Card glow="gold">
									<p className="text-yellow-400 font-mono text-xs uppercase tracking-widest mb-2">
										{item.label}
									</p>
									<p className="text-slate-300 text-sm leading-relaxed">{item.detail}</p>
								</Card>
							</Reveal>
						))}
					</div>
				</section>

				{/* ===== Favorite Music ===== */}
				<section>
					<Reveal>
						<SectionHeader
							title="Favorite Music"
							subtitle="Battle themes and anime OSTs. The soundtrack to late night coding sessions."
						/>
					</Reveal>
					<div className="grid gap-6 sm:grid-cols-2">
						{SONGS.map((song, i) => (
							<Reveal key={song.videoId} delay={i * 80}>
								<div className="glass-card border-white/5 overflow-hidden hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.10)] transition-all duration-300">
									<div className="relative w-full aspect-video">
										<iframe
											src={`https://www.youtube.com/embed/${song.videoId}`}
											title={song.title}
											allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
											allowFullScreen
											className="absolute inset-0 w-full h-full"
										/>
									</div>
									<div className="px-4 py-3 border-t border-white/5">
										<p className="text-white text-sm font-medium">{song.title}</p>
									</div>
								</div>
							</Reveal>
						))}
					</div>
				</section>

			</div>
		</div>
	);
}