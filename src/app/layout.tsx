import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

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
    default: "Joel Varty",
    template: "%s | Joel Varty",
  },
  description: "Personal website of Joel Varty - Developer, designer, and tech enthusiast.",
  keywords: ["Joel Varty", "developer", "web development", "Next.js", "Agility CMS"],
  authors: [{ name: "Joel Varty" }],
  creator: "Joel Varty",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Joel Varty",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@joelvarty",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
      <GoogleAnalytics gaId="G-JLWKVSZFV2" />
    </html>
  );
}
