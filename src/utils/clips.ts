import fs from "node:fs";
import path from "node:path";

/*
  Reads public/videos at build time so the gallery is whatever is in the folder.
  Drop a clip in, rebuild, it appears. Nothing here runs in the browser, and in
  a static export it runs once during `next build`.

  Naming convention, which is where the order and the headings come from:

      <set name>_<index>_<label>.mp4
      carnival_lr_teq_perfect_cell_3_12_ki_ex.mp4
      |___________set___________| |i| |_label_|

  The first purely numeric segment splits the two. Everything before it names
  the set, everything after is the heading for that clip.
*/

const VIDEO_DIR = path.join(process.cwd(), "public", "videos");
const BASE_PATH = "/arthurs-portfolio";

// Tokens that read wrong in title case. Dokkan is full of them.
const ACRONYMS = new Set(["lr", "ex", "sa", "teq", "str", "phy", "int", "agl", "ui", "ssj", "hp", "atk", "def"]);

export interface Clip {
	/** Filename without extension, stable enough for a React key. */
	name: string;
	src: string;
	poster?: string;
	/** Short heading, the part of the filename after the index. Used on the thumbnails. */
	label: string;
	/**
	 * The whole filename in readable form, set name included, for the main
	 * heading. The index is left out because the ordinal badge already shows it.
	 */
	fullLabel: string;
	/** Zero padded position, e.g. "03". */
	ordinal: string;
	width: number;
	height: number;
}

interface ManifestEntry {
	name: string;
	width: number;
	height: number;
}

function titleCase(words: string[]): string {
	return words
		.map((w) => (ACRONYMS.has(w) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
		.join(" ");
}

/** Splits a filename into its set name, ordering index and heading. */
function parseName(name: string): { set: string; index: number; label: string } {
	const parts = name.split("_").filter(Boolean);
	const at = parts.findIndex((p) => /^\d+$/.test(p));

	// No index segment, so treat the whole name as the heading and sort it
	// alphabetically after everything that does have one.
	if (at === -1) {
		return { set: "", index: Number.MAX_SAFE_INTEGER, label: titleCase(parts) };
	}

	return {
		set: titleCase(parts.slice(0, at)),
		index: Number(parts[at]),
		label: titleCase(parts.slice(at + 1)) || titleCase(parts.slice(0, at)),
	};
}

function readManifest(): Map<string, ManifestEntry> {
	const file = path.join(VIDEO_DIR, "manifest.json");
	const entries = new Map<string, ManifestEntry>();

	try {
		const parsed = JSON.parse(fs.readFileSync(file, "utf8")) as { clips?: ManifestEntry[] };
		for (const entry of parsed.clips ?? []) {
			entries.set(entry.name, entry);
		}
	} catch {
		// No manifest, so fall back to the default shape below. scripts/encode_clips.sh
		// writes one, but a hand dropped file should still render.
	}

	return entries;
}

/** Every clip in public/videos, in filename order. */
export function getClips(): Clip[] {
	let files: string[];
	try {
		files = fs.readdirSync(VIDEO_DIR).filter((f) => f.toLowerCase().endsWith(".mp4"));
	} catch {
		return []; // no videos folder, the section just renders empty
	}

	const manifest = readManifest();

	return files
		.map((file) => {
			const name = path.basename(file, path.extname(file));
			const parsed = parseName(name);
			const dims = manifest.get(name);
			const poster = fs.existsSync(path.join(VIDEO_DIR, `${name}.jpg`))
				? `${BASE_PATH}/videos/${name}.jpg`
				: undefined;

			return {
				clip: {
					name,
					src: `${BASE_PATH}/videos/${file}`,
					poster,
					label: parsed.label,
					fullLabel: [parsed.set, parsed.label].filter(Boolean).join(" "),
					ordinal: "",
					// 810x1080 matches what scripts/encode_clips.sh produces.
					width: dims?.width ?? 810,
					height: dims?.height ?? 1080,
				} satisfies Clip,
				index: parsed.index,
				name,
			};
		})
		// Numeric on the index so a tenth clip does not sort between 1 and 2.
		.sort((a, b) => a.index - b.index || a.name.localeCompare(b.name))
		.map((entry, i) => ({ ...entry.clip, ordinal: String(i + 1).padStart(2, "0") }));
}

/** The set name shared by the clips, for use as a section subtitle. */
export function getClipSetName(): string {
	try {
		const first = fs
			.readdirSync(VIDEO_DIR)
			.filter((f) => f.toLowerCase().endsWith(".mp4"))
			.sort()[0];
		return first ? parseName(path.basename(first, path.extname(first))).set : "";
	} catch {
		return "";
	}
}
