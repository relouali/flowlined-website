"use client";

import { useEffect, useRef } from "react";

function startCaseStepVideo(video: HTMLVideoElement) {
  video.muted = true;
  video.defaultMuted = true;
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");

  const playAttempt = video.play();
  if (playAttempt !== undefined) {
    playAttempt.catch(() => {});
  }
}

type CaseStepVideoProps = {
  src: string;
  isActive: boolean;
};

export default function CaseStepVideo({ src, isActive }: CaseStepVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!isActive) {
      video.pause();
      return;
    }

    startCaseStepVideo(video);

    const onReady = () => {
      if (isActive) startCaseStepVideo(video);
    };
    const onVisible = () => {
      if (document.visibilityState === "visible" && isActive) {
        startCaseStepVideo(video);
      }
    };
    const onFirstInteraction = () => {
      if (isActive) startCaseStepVideo(video);
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
  }, [isActive, src]);

  return (
    <video
      key={src}
      ref={videoRef}
      autoPlay={isActive}
      className="case-step__video absolute inset-0 size-full object-cover"
      disablePictureInPicture
      loop
      muted
      playsInline
      preload="auto"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
