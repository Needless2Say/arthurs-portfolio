const BLUE = "#60a5fa";
const YELLOW = "#facc15";
const EMERALD = "#34d399";
const SLATE = "#94a3b8";
const DIM = "#64748b";

interface StepProps {
	x: number;
	y: number;
	w?: number;
	title: string;
	sub?: string;
	accent?: string;
}

function Step({ x, y, w = 168, title, sub, accent = BLUE }: StepProps) {
	return (
		<g>
			<rect
				x={x}
				y={y}
				width={w}
				height={sub ? 56 : 42}
				rx={8}
				fill="rgba(255,255,255,0.04)"
				stroke={accent}
				strokeOpacity={0.35}
			/>
			<text x={x + w / 2} y={y + (sub ? 24 : 26)} textAnchor="middle" fill="#e2e8f0" fontSize={12.5} fontWeight={600}>
				{title}
			</text>
			{sub && (
				<text x={x + w / 2} y={y + 42} textAnchor="middle" fill={DIM} fontSize={10.5} fontFamily="ui-monospace, monospace">
					{sub}
				</text>
			)}
		</g>
	);
}

export default function MetadataFlowDiagram() {
	return (
		<figure className="my-6">
			<div className="overflow-x-auto glass-card border-white/5 p-4 rounded-xl">
				<svg
					viewBox="0 0 880 486"
					role="img"
					aria-label="Metadata reconciliation flow. Authors publish version controlled desired state through review and CI into object storage. Inside the warehouse, scheduled scan, merge, fix and apply phases converge live objects toward that state every weekday, repairing whatever the previous day's schema deploys stripped."
					className="w-full min-w-[820px]"
				>
					<defs>
						<marker id="mfd-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
							<path d="M 0 0 L 10 5 L 0 10 z" fill={SLATE} />
						</marker>
						<marker id="mfd-arrow-y" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
							<path d="M 0 0 L 10 5 L 0 10 z" fill={YELLOW} />
						</marker>
					</defs>

					{/* ===== Lane 1, authoring ===== */}
					<text x={24} y={22} fill={DIM} fontSize={10} fontFamily="ui-monospace, monospace" letterSpacing="2">
						AUTHORING — HUMANS, REVIEWED
					</text>

					<Step x={24} y={34} title="Spreadsheet + issue form" sub="no YAML by hand" />
					<Step x={248} y={34} title="Pull request + CI" sub="validate, fail closed" />
					<Step x={472} y={34} title="Git catalog" sub="single source of truth" accent={EMERALD} />
					<Step x={696} y={34} w={160} title="Publish" sub="object storage" />

					<line x1={192} y1={62} x2={244} y2={62} stroke={SLATE} strokeWidth={1.5} markerEnd="url(#mfd-arrow)" />
					<line x1={416} y1={62} x2={468} y2={62} stroke={SLATE} strokeWidth={1.5} markerEnd="url(#mfd-arrow)" />
					<line x1={640} y1={62} x2={692} y2={62} stroke={SLATE} strokeWidth={1.5} markerEnd="url(#mfd-arrow)" />

					{/* drop into the warehouse */}
					<path d="M 776 90 L 776 128" stroke={SLATE} strokeWidth={1.5} fill="none" markerEnd="url(#mfd-arrow)" />
					<text x={786} y={116} fill={DIM} fontSize={10} fontFamily="ui-monospace, monospace">
						pull
					</text>

					{/* ===== Lane 2, the warehouse ===== */}
					<rect x={24} y={140} width={832} height={214} rx={12} fill="rgba(96,165,250,0.04)" stroke={BLUE} strokeOpacity={0.25} strokeDasharray="4 4" />
					<text x={40} y={164} fill={BLUE} fontSize={10.5} fontFamily="ui-monospace, monospace" letterSpacing="2">
						INSIDE THE WAREHOUSE — SCHEDULED, EVERY WEEKDAY BEFORE BUSINESS HOURS
					</text>
					<text x={40} y={181} fill={DIM} fontSize={10} fontFamily="ui-monospace, monospace">
						no CI runner · no tokens · no external orchestrator
					</text>

					<Step x={48} y={200} title="SCAN" sub="content hash diff" />
					<Step x={256} y={200} title="MERGE" sub="catalog → tables" />
					<Step x={464} y={200} title="FIX" sub="flip state, no DDL" accent={YELLOW} />
					<Step x={672} y={200} w={160} title="APPLY" sub="stamp live objects" accent={EMERALD} />

					<line x1={216} y1={228} x2={252} y2={228} stroke={SLATE} strokeWidth={1.5} markerEnd="url(#mfd-arrow)" />
					<line x1={424} y1={228} x2={460} y2={228} stroke={SLATE} strokeWidth={1.5} markerEnd="url(#mfd-arrow)" />
					<line x1={632} y1={228} x2={668} y2={228} stroke={SLATE} strokeWidth={1.5} markerEnd="url(#mfd-arrow)" />

					{/* properties strip */}
					<text x={48} y={288} fill={SLATE} fontSize={11}>
						Every phase is idempotent, time boxed, and resumable. State lives in a control table, so a crash costs nothing.
					</text>
					<text x={48} y={308} fill={SLATE} fontSize={11}>
						Each phase checks whether there is anything to do and exits immediately when there is not, so idle days cost almost nothing.
					</text>
					<text x={48} y={332} fill={YELLOW} fontSize={11} fontWeight={600}>
						Eight independent fail closed checks. The failure mode is inaction, never corruption.
					</text>

					{/* ===== Lane 3, live objects + the daily loop ===== */}
					<path d="M 752 354 L 752 392" stroke={EMERALD} strokeWidth={1.5} fill="none" markerEnd="url(#mfd-arrow)" />
					<Step x={672} y={392} w={160} title="Live objects" sub="tags · contacts · descriptions" accent={EMERALD} />

					<rect x={24} y={392} width={330} height={56} rx={8} fill="rgba(250,204,21,0.06)" stroke={YELLOW} strokeOpacity={0.35} />
					<text x={189} y={416} textAnchor="middle" fill="#fde68a" fontSize={12.5} fontWeight={600}>
						Daily schema deploys strip metadata
					</text>
					<text x={189} y={434} textAnchor="middle" fill={DIM} fontSize={10.5} fontFamily="ui-monospace, monospace">
						CREATE OR REPLACE recreates the object
					</text>

					<line x1={668} y1={420} x2={360} y2={420} stroke={YELLOW} strokeWidth={1.5} strokeOpacity={0.7} markerEnd="url(#mfd-arrow-y)" />

					{/* loop back up into FIX */}
					<path d="M 189 392 L 189 372 L 544 372 L 544 260" stroke={YELLOW} strokeWidth={1.5} strokeOpacity={0.7} fill="none" markerEnd="url(#mfd-arrow-y)" />
					<text x={560} y={380} fill={YELLOW} fontSize={10.5} fontFamily="ui-monospace, monospace" opacity={0.9}>
						repaired next morning, automatically
					</text>

					{/* outcome */}
					<text x={24} y={472} fill={EMERALD} fontSize={11.5} fontWeight={600}>
						Recovery went from three to four hours of manual rework to seconds. 20+ schema deploys survived with no human involvement.
					</text>
				</svg>
			</div>
			<figcaption className="mt-2 text-xs text-slate-500 font-mono">
				{"// the reconciliation loop, end to end"}
			</figcaption>
		</figure>
	);
}
