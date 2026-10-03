import type { Metadata } from "next";
import { Anton, Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { site } from "@/content/site";
import { BOOT_SCRIPT } from "@/lib/theme";
import "./globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton", display: "swap" });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

// Name first for name searches, then the role and place people search for.
const title = "James Gabarda — AI & Software Engineer in the Philippines";
const description =
  "James Ivan Gabarda is an AI and software engineer in Bicol, Philippines, building custom web and mobile apps, business platforms, and AI features for clients worldwide.";

export const metadata: Metadata = {
  // Resolves relative URLs (like the generated preview image) against the real domain.
  metadataBase: new URL(site.url),
  // Other pages set their own title, shown as "Page | James Gabarda".
  title: { default: title, template: "%s | James Gabarda" },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title,
    description,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title, description },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${anton.variable} ${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      </head>
      <body>
        {children}
        {/* Vercel Web Analytics. The script is served by Vercel itself, so skip it outside Vercel builds. */}
        {process.env.VERCEL ? <Script src="/_vercel/insights/script.js" strategy="afterInteractive" /> : null}
      </body>
    </html>
  );
}
