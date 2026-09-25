export const SITE_ORIGIN = "https://needless2say.github.io";
export const SITE_URL = `${SITE_ORIGIN}/arthurs-portfolio`;

/*
  The share card, committed as public/og.png and generated from
  scripts/og/opengraph-image.tsx.

  Every page has to spread this into its own openGraph block. Next does NOT
  merge openGraph field by field across segments: a page that declares its own
  openGraph replaces the parent's outright, so defining images only in the root
  layout left og:image missing on every single page while twitter:image, which
  no page overrides, came through fine.
*/
export const OG_IMAGE = {
	url: `${SITE_URL}/og.png`,
	width: 1200,
	height: 630,
	alt: "Arthur Krieger, Software and Platform Engineer",
};
