import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Navbar, Footer, PageTransition } from "@/components/layout";
import StarField from "@/components/ui/StarField";
import ScrollProgress from "@/components/ui/ScrollProgress";
import ScrollToTop from "@/components/ui/ScrollToTop";
import KonamiEasterEgg from "@/components/ui/KonamiEasterEgg";

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

export const metadata: Metadata = {
	metadataBase: new URL(BASE_URL),
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
	},
	twitter: {
		card: "summary_large_image",
		title: "Arthur Krieger | Software Engineer & KriegerDataForge",
		description:
			"Software/Platform Engineer at Charles Schwab. CS + Data Science, UMich 2025. Founder of KriegerDataForge. Building in Chicago, IL.",
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
		<html lang="en">
			<head>
				{/*
				  PL-071: Content-Security-Policy via <meta>. GitHub Pages is a static
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
				*/}
				<meta
					httpEquiv="Content-Security-Policy"
					content={[
						"default-src 'self'",
						"base-uri 'self'",
						"object-src 'none'",
						"frame-ancestors 'none'",
						"frame-src https://www.youtube.com https://www.youtube-nocookie.com",
						"img-src 'self' data: https:",
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
							{
								"@context": "https://schema.org",
								"@type": "Person",
								name: "Arthur Krieger",
								jobTitle: "Software/Platform Engineer",
								worksFor: { "@type": "Organization", name: "Charles Schwab" },
								alumniOf: { "@type": "EducationalOrganization", name: "University of Michigan" },
								url: BASE_URL,
								email: "kriegear@umich.edu",
								address: { "@type": "PostalAddress", addressLocality: "Chicago", addressRegion: "IL", addressCountry: "US" },
								sameAs: [
									"https://www.linkedin.com/in/arthur-krieger-3b986220a/",
									"https://github.com/Needless2Say",
								],
								knowsAbout: [
									"Software Engineering", "Data Engineering", "Machine Learning",
									"Python", "Next.js", "TypeScript", "React", "Snowflake",
									"Data Pipelines", "Full Stack Development", "Fitness Technology",
								],
								founder: { "@type": "Organization", name: "KriegerDataForge" },
							},
							{
								"@context": "https://schema.org",
								"@type": "WebSite",
								name: "Arthur Krieger | KriegerDataForge",
								url: BASE_URL,
								description: "Portfolio of Arthur Krieger — Software/Platform Engineer, KriegerDataForge founder, and builder of full-stack apps, data pipelines, and fitness technology.",
								author: { "@type": "Person", name: "Arthur Krieger" },
							},
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

			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
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