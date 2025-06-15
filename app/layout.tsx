import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "uoneweb",
  description: "Android / Backend Software Engineer. 地図・GIS技術、オープンソース、モバイルアプリ開発に興味があります。",
  keywords: ["Android", "Backend", "Software Engineer", "GIS", "地図", "MapLibre", "オープンソース", "モバイルアプリ"],
  authors: [{ name: "u-one" }],
  creator: "u-one",
  openGraph: {
    title: "u-one | Software Engineer",
    description: "Android / Backend Software Engineer. 地図・GIS技術、オープンソース、モバイルアプリ開発に興味があります。",
    url: "https://uoneweb.net",
    siteName: "u-one",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "u-one | Software Engineer",
    description: "Android / Backend Software Engineer",
    creator: "@uonejp",
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
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
