import type { Metadata } from "next";
import { GeistPixelLine } from "geist/font/pixel";
import { Geist, Geist_Mono } from "next/font/google";

import "../index.css";
import GlobalParallax from "@/components/global-parallax";
import LocomotiveScrollProvider from "@/components/locomotive-scroll-provider";
import PageTransitionProvider from "@/components/page-transition-provider";
import ProgressNav from "@/components/progress-nav";
import Providers from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Geist Pixel (Line variant) — used for the case-study KPI numbers
// (70%, 99,99%, 3x, 100%). The package self-hosts the woff2 file and
// exposes the `--font-geist-pixel-line` CSS variable used by
// case-study-section.css. See https://vercel.com/blog/introducing-geist-pixel

export const metadata: Metadata = {
  title: "Flowlined",
  description: "Werksystemen voor experts die ze het hardst nodig hebben.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${GeistPixelLine.variable} ${geistSans.className} bg-white antialiased`}
      >
        <Providers>
          <LocomotiveScrollProvider>
            {/* Owns the column-wipe page transition and exposes navigate()
                via context. Wraps the nav + page content so both (and the
                footer rendered inside pages) can trigger transitions. */}
            <PageTransitionProvider>
              <ProgressNav />
              {/* Hooks GSAP scroll-driven parallax to every element marked
                  with data-parallax="trigger" (see init-global-parallax.ts).
                  Must live inside <LocomotiveScrollProvider> so it can wait
                  for Locomotive's scrollerProxy to be initialised before
                  wiring ScrollTrigger animations. */}
              <GlobalParallax />
              {children}
            </PageTransitionProvider>
          </LocomotiveScrollProvider>
        </Providers>
      </body>
    </html>
  );
}
