"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

import SectionFrame from "@/components/section-frame";
import { initHeroIntro } from "@/lib/init-hero-intro";

import "./hero.css";

const HERO_VIDEO_SRC = "/videos/hero-video.mp4";
const HERO_PLACEHOLDER_SRC = "/images/hero-placeholder.png";

const TITLE_LINES = [
  "Jouw vakkennis.",
  "Ons systeem.",
  "Eén product.",
] as const;

const LEAD_LINES = [
  "Wij bouwen werksystemen samen met de experts",
  "die ze het hardst nodig hebben.",
] as const;

function startHeroVideo(video: HTMLVideoElement) {
  video.muted = true;
  video.defaultMuted = true;
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");

  const playAttempt = video.play();
  if (playAttempt !== undefined) {
    playAttempt.catch(() => {});
  }
}

export default function Hero() {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const cleanup = initHeroIntro(frame);
    return cleanup;
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    startHeroVideo(video);

    const onReady = () => startHeroVideo(video);
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        startHeroVideo(video);
      }
    };
    const onFirstInteraction = () => {
      startHeroVideo(video);
      window.removeEventListener("touchstart", onFirstInteraction);
      window.removeEventListener("pointerdown", onFirstInteraction);
    };

    video.addEventListener("loadeddata", onReady);
    video.addEventListener("canplay", onReady);
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("touchstart", onFirstInteraction, { passive: true });
    window.addEventListener("pointerdown", onFirstInteraction);

    return () => {
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("canplay", onReady);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("touchstart", onFirstInteraction);
      window.removeEventListener("pointerdown", onFirstInteraction);
    };
  }, []);

  return (
    <SectionFrame id="top" data-progress-nav-anchor className="hero">
      <div ref={frameRef} className="hero__frame">
        <div aria-hidden="true" className="hero__media">
          {/* Static fallback — visible while the video loads or if it fails */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            className="absolute inset-0 size-full object-cover"
            src={HERO_PLACEHOLDER_SRC}
          />
          <video
            ref={videoRef}
            autoPlay
            className="hero__video absolute inset-0 size-full object-cover"
            disablePictureInPicture
            loop
            muted
            playsInline
            preload="auto"
          >
            <source src={HERO_VIDEO_SRC} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[#000C10]/65" />
        </div>

        <div className="hero__content">
          <div className="hero__copy flex w-full flex-col items-start gap-4 md:gap-6">
            <h1 className="hero__title flex flex-col font-semibold tracking-tight text-white">
              {TITLE_LINES.map((line) => (
                <span key={line} className="hero__title-mask">
                  <span className="hero__title-line">{line}</span>
                </span>
              ))}
            </h1>
            <p className="hero__lead type-section-lead flex max-w-xl flex-col text-white">
              {LEAD_LINES.map((line) => (
                <span key={line} className="hero__lead-mask">
                  <span className="hero__lead-line">{line}</span>
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}
