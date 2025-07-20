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
  title: "SVG FavIcon Editor",
  description:
    "A modern web tool that automatically adapts SVG favicons to match users' system theme preferences (light/dark mode).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </head>
      <body
        cz-shortcut-listen="true"
        className={`${geistSans.variable} ${geistMono.variable} border-x border-gray-300 h-screen antialiased max-w-4xl mx-auto`}
      >
        {children}
      </body>
    </html>
  );
}
