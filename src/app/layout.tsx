import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Navbar, Footer, PageTransition } from "@/components/layout";
import StarField from "@/components/ui/StarField";
import ScrollProgress from "@/components/ui/ScrollProgress";
import ScrollToTop from "@/components/ui/ScrollToTop";
import KonamiEasterEgg from "@/components/ui/KonamiEasterEgg";
import { OG_IMAGE } from "@/constants/seo";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 5,
};

const BASE_URL = "https://needless2say.github.io/arthurs-portfolio";

/*
  metadataBase is the ORIGIN only, deliberately. Next prepends the configured
  basePath to generated metadata assets, so pointing metadataBase at the full
  BASE_URL produced /arthurs-portfolio/arthurs-portfolio/opengraph-image, which
  404s and leaves every share card blank. Absolute URLs below pass through
  untouched, so canonicals are unaffected.
*/
const ORIGIN = "https://needless2say.github.io";


export const metadata: Metadata = {
	metadataBase: new URL(ORIGIN),
	title: {
		default: "Arthur Krieger | Software Engineer & KriegerDataForge",
		template: "%s | Arthur Krieger",
	},
	description:
		"Arthur Krieger — Software/Platform Engineer at Charles Schwab, CS + Data Science graduate from the University of Michigan (2025). Founder of KriegerDataForge. Building full-stack apps, data pipelines, ML systems, and fitness technology from Chicago, IL.",
	keywords: [
		"Arthur Krieger",
		"KriegerDataForge",
		"Software Engineer Chicago",
		"Platform Engineer",
		"Data Engineer",
		"Full Stack Developer",
		"Machine Learning Engineer",
		"University of Michigan Computer Science",
		"Charles Schwab engineer",
		"Python developer",
		"Next.js developer",
		"TypeScript",
		"React developer",
		"Snowflake",
		"data pipelines",
		"fitness app",
		"fitness technology",
		"software portfolio",
	],
	authors: [{ name: "Arthur Krieger", url: BASE_URL }],
	creator: "Arthur Krieger",
	publisher: "KriegerDataForge",
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: BASE_URL,
		siteName: "Arthur Krieger | KriegerDataForge",
		title: "Arthur Krieger | Software Engineer & KriegerDataForge",
		description:
			"Software/Platform Engineer at Charles Schwab. CS + Data Science, University of Michigan 2025. Founder of KriegerDataForge — building data pipelines, full-stack apps, ML systems, and fitness technology.",
		images: [OG_IMAGE],
	},
	twitter: {
		card: "summary_large_image",
		title: "Arthur Krieger | Software Engineer & KriegerDataForge",
		description:
			"Software/Platform Engineer at Charles Schwab. CS + Data Science, UMich 2025. Founder of KriegerDataForge. Building in Chicago, IL.",
		images: [OG_IMAGE],
	},
	alternates: {
		canonical: BASE_URL,
	},
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
			<head>
				{/*
				  Content-Security-Policy via <meta>. GitHub Pages is a static
				  host and cannot send real HTTP headers, so this is a best-effort,
				  partial mitigation:
				    - frame-ancestors / X-Frame-Options are header-only and ignored in
				      <meta> (clickjacking can't be fully blocked on this host).
				    - 'unsafe-inline' is required on script-src because a static export
				      emits inline bootstrap scripts that cannot be nonced.
				    - 'unsafe-eval' is added ONLY in development (process.env.NODE_ENV),
				      because Next.js Fast Refresh / HMR evaluates code via eval(); it is
				      never emitted in the production build, so the deployed CSP is strict.
				  Allowlisted: Google Analytics (googletagmanager + google-analytics)
				  and the EmailJS contact-form POST (api.emailjs.com), and YouTube
					  iframe embeds on /life + /projects. If GA, the form, or the videos
				  break, the origins below are the first place to look.
				    - media-src is spelled out for the self-hosted <video> clips under
				      public/videos/. It would fall back to default-src today, but an
				      explicit entry means a later default-src change cannot silently
				      kill them.
				*/}
				<meta
					httpEquiv="Content-Security-Policy"
					content={[
						"default-src 'self'",
						"base-uri 'self'",
						"object-src 'none'",
						/*
						  frame-ancestors is deliberately NOT here. The spec says a
						  user agent must ignore it when it arrives via <meta>, so it
						  bought nothing and logged a CSP error into the console on
						  every single page load. Clickjacking protection on this host
						  needs a real HTTP header, which GitHub Pages cannot send.
						*/
						"frame-src https://www.youtube.com https://www.youtube-nocookie.com",
						"img-src 'self' data: https:",
						"media-src 'self'",
						"font-src 'self' data:",
						"style-src 'self' 'unsafe-inline'",
						`script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com`,
						"connect-src 'self' https://api.emailjs.com https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://stats.g.doubleclick.net",
						"form-action 'self' https://api.emailjs.com",
					].join("; ")}
				/>

				{/* JSON-LD: Person + WebSite structured data */}
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify([
							/*
							  The three nodes are joined by @id rather than repeating
							  "Arthur Krieger" as loose strings. That is what lets a
							  search engine treat the person, the site and this page
							  as one entity instead of three unrelated mentions, which
							  is the whole game when the target query is a name.
							*/
							{
								"@context": "https://schema.org",
								"@type": "Person",
								"@id": `${BASE_URL}/#arthur-krieger`,
								name: "Arthur Krieger",
								givenName: "Arthur",
								familyName: "Krieger",
								jobTitle: "Software/Platform Engineer",
								description:
									"Software and platform engineer at Charles Schwab, working on internal data platform and cloud infrastructure. Computer Science and Data Science graduate of the University of Michigan. Creator of KriegerDataForge.",
								image: `${BASE_URL}/og.png`,
								worksFor: {
									"@type": "Organization",
									name: "Charles Schwab",
									url: "https://www.schwab.com",
								},
								alumniOf: {
									"@type": "CollegeOrUniversity",
									name: "University of Michigan",
									url: "https://umich.edu",
								},
								url: BASE_URL,
								mainEntityOfPage: { "@id": `${BASE_URL}/#webpage` },
								email: "kriegear@umich.edu",
								address: { "@type": "PostalAddress", addressLocality: "Chicago", addressRegion: "IL", addressCountry: "US" },
								// sameAs is the strongest signal tying this site to the
								// profiles that already rank for the name.
								sameAs: [
									"https://www.linkedin.com/in/arthur-krieger-3b986220a/",
									"https://github.com/Needless2Say",
								],
								knowsAbout: [
									"Software Engineering", "Data Engineering", "Platform Engineering",
									"Machine Learning", "Python", "Next.js", "TypeScript", "React",
									"Snowflake", "Google Cloud Platform", "Terraform",
									"Data Pipelines", "Full Stack Development", "Fitness Technology",
								],
								founder: {
									"@type": "Organization",
									name: "KriegerDataForge",
									url: BASE_URL,
								},
							},
							{
								"@context": "https://schema.org",
								"@type": "WebSite",
								"@id": `${BASE_URL}/#website`,
								name: "Arthur Krieger | KriegerDataForge",
								alternateName: ["Arthur Krieger Portfolio", "Arthur's Portfolio", "Arthur Krieger's Portfolio"],
								url: BASE_URL,
								inLanguage: "en-US",
								description: "Portfolio of Arthur Krieger — Software/Platform Engineer, KriegerDataForge founder, and builder of full-stack apps, data pipelines, and fitness technology.",
								author: { "@id": `${BASE_URL}/#arthur-krieger` },
								publisher: { "@id": `${BASE_URL}/#arthur-krieger` },
							},
							/*
							  ProfilePage is NOT declared here. This block renders into
							  every page's head, and a ProfilePage node claiming the
							  homepage URL would then be repeated on /projects, /resume
							  and the rest, each asserting it is the homepage. It lives
							  on the homepage alone, in app/page.tsx, and references
							  these two nodes by @id.
							*/
						]),
					}}
				/>
				<Script async src="https://www.googletagmanager.com/gtag/js?id=G-98X0KCB8Z9" />
				<Script id="google-analytics">
					{`
						if (localStorage.getItem('ga-opt-out') === '1') {
							window['ga-disable-G-98X0KCB8Z9'] = true;
						} else {
							window.dataLayer = window.dataLayer || [];
							function gtag(){dataLayer.push(arguments);}
							gtag('js', new Date());
							gtag('config', 'G-98X0KCB8Z9');
						}
					`}
				</Script>
			</head>

			<body className="antialiased">
				<a href="#main-content" className="skip-to-content">
					Skip to content
				</a>

				<ScrollProgress />
				<StarField />
				<Navbar />

				<main id="main-content" className="relative z-10">
					<PageTransition>{children}</PageTransition>
				</main>

				<Footer />
				<ScrollToTop />
				<KonamiEasterEgg />
			</body>
		</html>
	);
}