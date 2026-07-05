"use client";

import { useEffect, useRef } from "react";

import "./home-background.css";

const BG_VIDEO_SRC = "/videos/hero-background.mp4";

function startVideo(video: HTMLVideoElement) {
  video.muted = true;
  video.defaultMuted = true;
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");

  const playAttempt = video.play();
  if (playAttempt !== undefined) {
    playAttempt.catch(() => {});
  }
}

/**
 * Single, fixed background shared by the whole homepage: a muted video base
 * with a brand-tinted raster grid and a subtle noise overlay stacked on top.
 * Rendered once behind the page content; individual sections are made
 * transparent (scoped to `.home-shell`) so this layer reads through them.
 */
export default function HomeBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    startVideo(video);

    const onReady = () => startVideo(video);
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        startVideo(video);
      }
    };
    const onFirstInteraction = () => {
      startVideo(video);
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
    <div aria-hidden="true" className="home-bg">
      <video
        ref={videoRef}
        autoPlay
        className="home-bg__video"
        disablePictureInPicture
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src={BG_VIDEO_SRC} type="video/mp4" />
      </video>
      <div className="home-bg__raster" />
      <div className="home-bg__noise" />
    </div>
  );
}
