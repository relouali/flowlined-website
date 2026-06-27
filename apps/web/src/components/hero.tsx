"use client";

import { useEffect, useRef } from "react";

import "./hero.css";

const HERO_VIDEO_SRC = "/videos/hero-video.mp4";
const HERO_PLACEHOLDER_SRC = "/images/hero-placeholder.png";

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
  const videoRef = useRef<HTMLVideoElement>(null);

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
    <section
      id="top"
      data-progress-nav-anchor
      className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
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
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="hero__content relative z-10 flex flex-1 flex-col items-start justify-end text-left">
        <div className="hero__copy flex w-full flex-col items-start gap-4 md:gap-6">
          <h1 className="hero__title font-semibold tracking-tight text-white">
            Jouw vakkennis.
            <br />
            Ons systeem.
            <br />
            Eén product.
          </h1>
          <p className="type-section-lead max-w-xl text-white/70">
          Wij bouwen werksystemen samen met de experts die ze het hardst nodig hebben.
          </p>
        </div>
      </div>
    </section>
  );
}
