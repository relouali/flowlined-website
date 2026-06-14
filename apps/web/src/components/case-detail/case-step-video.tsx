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
    if (typeof window === "undefined") return;

    // On mobile the slider is disabled and the steps are stacked vertically, so
    // there's no single "active" slide. Drive playback from visibility instead:
    // each video starts when it scrolls into view (otherwise it stays on a
    // blank first frame and looks like it never loaded) and pauses when it
    // leaves.
    if (window.matchMedia("(max-width: 639px)").matches) {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) startCaseStepVideo(video);
            else video.pause();
          }
        },
        { threshold: 0.25 },
      );
      observer.observe(video);

      const onMobileInteraction = () => {
        if (!video.paused) return;
        const rect = video.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (inView) startCaseStepVideo(video);
      };
      window.addEventListener("touchstart", onMobileInteraction, {
        passive: true,
      });

      return () => {
        observer.disconnect();
        window.removeEventListener("touchstart", onMobileInteraction);
      };
    }

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
