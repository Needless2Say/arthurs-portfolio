import type { Metadata } from "next";
import { ROUTES } from "@/constants/routes";
import { SITE_ORIGIN, SITE_URL } from "@/constants/seo";
import RootRedirect from "@/components/ui/RootRedirect";

// The bare basePath root now just forwards to /home — see RootRedirect.
export const metadata: Metadata = {
	robots: { index: false, follow: true },
	alternates: { canonical: `${SITE_URL}${ROUTES.HOME}` },
};

export default function RootPage() {
	return (
		<>
			<RootRedirect />
			<noscript>
				<div className="min-h-screen flex items-center justify-center px-4">
					{/* Plain anchor, not next/link: basePath isn't auto-applied to raw <a> hrefs. */}
					<a
						href={`${SITE_URL.replace(SITE_ORIGIN, "")}${ROUTES.HOME}/`}
						className="text-blue-400 underline text-sm"
					>
						Continue to the homepage
					</a>
				</div>
			</noscript>
		</>
	);
}
