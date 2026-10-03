import type { Metadata } from "next";
import { Anton, Geist, Geist_Mono } from "next/font/google";
import { site } from "@/content/site";
import { BOOT_SCRIPT } from "@/lib/theme";
import "./globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton", display: "swap" });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

const title = "James Gabarda — AI & Software Engineer";
const description =
  "James Ivan Gabarda builds custom software, web and mobile apps, and AI features for businesses. Based in Bicol, Philippines.";

export const metadata: Metadata = {
  // Resolves relative URLs (like the generated preview image) against the real domain.
  metadataBase: new URL(site.url),
  title,
  description,
  alternates: { canonical: "/" },
  icons: { icon: "/logo.png" },
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
      <body>{children}</body>
    </html>
  );
}
