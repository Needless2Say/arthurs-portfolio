import type { Metadata } from "next";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import CopyButton from "@/components/ui/CopyButton";
import Reveal from "@/components/ui/Reveal";
import { PERSONAL_INFO } from "@/constants/personal-info";

export const metadata: Metadata = {
	title: "Contact",
	description:
		"Get in touch with Arthur Krieger — Software/Platform Engineer, KriegerDataForge founder. Open to new opportunities, collaborations, and conversations about software, data, fitness technology, and more.",
	alternates: { canonical: "https://needless2say.github.io/arthurs-portfolio/contact" },
	openGraph: {
		title: "Contact Arthur Krieger | KriegerDataForge",
		description:
			"Reach out to Arthur Krieger — Software Engineer, data builder, KriegerDataForge founder. Open to new opportunities and collaborations.",
		url: "https://needless2say.github.io/arthurs-portfolio/contact",
	},
};

const contacts = [
	{
		label: "Email",
		value: PERSONAL_INFO.email,
		href: `mailto:${PERSONAL_INFO.email}`,
		description: "Drop me a line anytime",
		borderClass: "hover:border-blue-500/50 hover:shadow-[0_0_24px_rgba(37,99,235,0.15)]",
		copyable: true,
	},
	{
		label: "LinkedIn",
		value: "arthur-krieger",
		href: PERSONAL_INFO.links.linkedin,
		description: "Connect with me professionally",
		borderClass: "hover:border-blue-500/50 hover:shadow-[0_0_24px_rgba(59,130,246,0.15)]",
		copyable: false,
	},
	{
		label: "GitHub",
		value: "Needless2Say",
		href: PERSONAL_INFO.links.github,
		description: "Browse my repositories",
		borderClass: "hover:border-slate-400/50 hover:shadow-[0_0_24px_rgba(148,163,184,0.1)]",
		copyable: false,
	},
	{
		label: "Instagram",
		value: "needless2say_dbfan",
		href: PERSONAL_INFO.links.instagram,
		description: "Follow my journey",
		borderClass: "hover:border-pink-500/50 hover:shadow-[0_0_24px_rgba(236,72,153,0.15)]",
		copyable: false,
	},
];

export default function Contact() {
	return (
		<div className="min-h-screen pt-24 pb-16 px-4">
			<div className="max-w-2xl mx-auto">
				<Reveal>
					<SectionHeader
						title="Let's Connect"
						subtitle="I'm always open to new opportunities and conversations."
						align="center"
					/>
				</Reveal>

				<div className="grid sm:grid-cols-2 gap-4 mt-10">
					{contacts.map((contact, i) => (
						<Reveal key={contact.label} delay={i * 80}>
							<div
								className={`glass-card p-6 transition-all duration-300 border hover:-translate-y-1 ${contact.borderClass}`}
							>
								<p className="text-slate-500 font-mono text-xs uppercase tracking-widest mb-1">
									{contact.label}
								</p>
								<p className="text-white font-medium text-lg mb-1">
									{contact.value}
								</p>
								<p className="text-slate-400 text-sm mb-5">
									{contact.description}
								</p>

								<div className="flex items-center gap-3">
									<Link
										href={contact.href}
										target={contact.copyable ? undefined : "_blank"}
										rel={contact.copyable ? undefined : "noopener noreferrer"}
										className="text-sm text-slate-400 hover:text-white transition-colors font-mono"
									>
										{contact.copyable ? "Send email →" : "Open →"}
									</Link>

									{contact.copyable && (
										<CopyButton text={PERSONAL_INFO.email} />
									)}
								</div>
							</div>
						</Reveal>
					))}
				</div>

				<Reveal delay={contacts.length * 80}>
					<p className="text-center text-slate-600 text-xs mt-12 font-mono">
						Based in Chicago, IL · Open to remote & hybrid roles
					</p>
				</Reveal>
			</div>
		</div>
	);
}