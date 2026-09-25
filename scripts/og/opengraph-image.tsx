import { ImageResponse } from "next/og";

/*
  SOURCE for public/og.png. This file is parked here rather than living in the
  app tree on purpose.

  To regenerate after editing it:
      1. copy this file to src/app/opengraph-image.tsx
      2. npx next build
      3. cp out/opengraph-image public/og.png
      4. delete src/app/opengraph-image.tsx again

  The round trip exists because a live route emits an EXTENSIONLESS file named
  "opengraph-image", and GitHub Pages types files by extension, so it would be
  served as application/octet-stream and image crawlers would reject it. A real
  .png under public/ is served as image/png, which is what LinkedIn and the rest
  require. The metadata in layout.tsx points at that file explicitly.

  The share card for every link to this site.

  Before this existed the site declared twitter:card=summary_large_image with no
  image behind it, so every link posted to LinkedIn, Slack, iMessage or Discord
  rendered a blank card. That matters most on LinkedIn, which is the main path
  people take to get here.

  Next renders this once during `next build`, so it ships as a static PNG and
  costs nothing at request time, which is what a static export needs.
*/

// Required under output: "export", the same way sitemap.ts and robots.ts declare it.
export const dynamic = "force-static";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Arthur Krieger, Software and Platform Engineer";

export default function OpengraphImage() {
	return new ImageResponse(
		(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					padding: "0 86px",
					background: "#020617",
					// Matches the site's deep space backdrop rather than flat black.
					backgroundImage:
						"radial-gradient(circle at 78% 18%, rgba(37,99,235,0.30) 0%, transparent 46%)," +
						"radial-gradient(circle at 12% 88%, rgba(250,204,21,0.14) 0%, transparent 42%)",
				}}
			>
				<div
					style={{
						display: "flex",
						fontSize: 22,
						letterSpacing: 10,
						textTransform: "uppercase",
						color: "rgba(250,204,21,0.75)",
					}}
				>
					Software and Platform Engineer
				</div>

				<div
					style={{
						display: "flex",
						marginTop: 26,
						fontSize: 116,
						fontWeight: 700,
						color: "#ffffff",
						letterSpacing: -2,
					}}
				>
					Arthur Krieger
				</div>

				{/* The blue to yellow rule the site uses under every section heading. */}
				<div
					style={{
						display: "flex",
						width: 620,
						height: 5,
						marginTop: 30,
						borderRadius: 3,
						background: "linear-gradient(90deg, #2563eb 0%, #facc15 50%, #2563eb 100%)",
					}}
				/>

				<div
					style={{
						display: "flex",
						marginTop: 30,
						fontSize: 30,
						lineHeight: 1.4,
						color: "#cbd5e1",
						maxWidth: 940,
					}}
				>
					Platform engineering at Charles Schwab. Computer Science and Data Science,
					University of Michigan. Creator of KriegerDataForge.
				</div>

				<div
					style={{
						display: "flex",
						marginTop: 38,
						fontSize: 24,
						color: "#64748b",
					}}
				>
					needless2say.github.io/arthurs-portfolio
				</div>
			</div>
		),
		size
	);
}
