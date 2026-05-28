import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Navbar, Footer } from "@/components/layout";
import StarField from "@/components/ui/StarField";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Arthur Krieger",
    template: "%s | Arthur Krieger",
  },
  description:
    "Software Engineer & CS + Data Science grad from the University of Michigan. Building at the intersection of data and software.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Arthur Krieger",
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
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-98X0KCB8Z9" />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-98X0KCB8Z9');
          `}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <StarField />
        <Navbar />
        <main id="main-content" className="relative z-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
