import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CVModalProvider } from "@/components/providers/CVModalProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "James Ivan Gabarda - Full Stack Developer",
  description:
    "Portfolio of James Ivan Gabarda, a Full Stack Developer building modern, responsive web and mobile applications with React, Next.js, and Node.js.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CVModalProvider>{children}</CVModalProvider>
      </body>
    </html>
  );
}
