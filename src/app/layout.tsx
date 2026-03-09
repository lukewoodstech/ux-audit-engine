import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "AI UX Audit Engine",
  description: "Turn product screenshots into actionable UX audit reports.",
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
        <header className="sticky top-0 z-10 flex h-12 items-center justify-between border-b border-zinc-200 bg-white/80 px-4 backdrop-blur dark:border-zinc-800 dark:bg-black/80 sm:px-6">
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight text-zinc-950 dark:text-zinc-50"
          >
            UX Audit
          </Link>
          <nav className="flex items-center gap-1">
            <Link
              href="/audits"
              className="rounded-md px-3 py-1.5 text-sm text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
            >
              Past audits
            </Link>
            <Link
              href="/audits/new"
              className="rounded-full bg-zinc-950 px-3 py-1.5 text-sm font-medium text-zinc-50 transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              + New audit
            </Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
