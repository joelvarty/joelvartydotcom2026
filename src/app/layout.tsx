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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/favicons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "android-chrome-192x192", url: "/favicons/android-chrome-192x192.png" },
      { rel: "android-chrome-512x512", url: "/favicons/android-chrome-512x512.png" },
    ],
  },
  manifest: "/favicons/site.webmanifest",
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
