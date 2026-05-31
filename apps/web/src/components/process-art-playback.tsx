"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, type ReactNode } from "react";

import { useLocomotiveScroll } from "@/components/locomotive-scroll-provider";
import {
  MOBILE_CAROUSEL_MQ,
  syncLenisPreventMobile,
} from "@/lib/sync-lenis-prevent-mobile";

type ProcessArtPlaybackProps = {
  children: ReactNode;
};

function setAllArtPlaying(track: HTMLElement, playing: boolean) {
  track.querySelectorAll<HTMLElement>(".process-art").forEach((art) => {
    art.classList.toggle("is--playing", playing);
  });
}

function updateMobileArtPlayback(
  track: HTMLOListElement,
  currentActiveArt: { current: HTMLElement | null },
) {
  const cards = track.querySelectorAll<HTMLElement>(".horizontal-steps__card");
  const arts = track.querySelectorAll<HTMLElement>(".process-art");
  const trackRect = track.getBoundingClientRect();

  if (trackRect.bottom <= 0 || trackRect.top >= window.innerHeight) {
    if (currentActiveArt.current) {
      currentActiveArt.current.classList.remove("is--playing");
      currentActiveArt.current = null;
    }
    return;
  }

  const trackCenter = trackRect.left + trackRect.width / 2;
  let activeArt: HTMLElement | null = null;
  let bestDistance = Infinity;

  cards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    const isVisible =
      rect.right > trackRect.left + 8 && rect.left < trackRect.right - 8;

    if (!isVisible) return;

    const cardCenter = rect.left + rect.width / 2;
    const distance = Math.abs(cardCenter - trackCenter);

    if (distance < bestDistance) {
      bestDistance = distance;
      activeArt = card.querySelector<HTMLElement>(".process-art");
    }
  });

  if (activeArt === currentActiveArt.current) return;

  if (currentActiveArt.current) {
    currentActiveArt.current.classList.remove("is--playing");
  }

  if (activeArt) {
    activeArt.classList.remove("is--playing");
    void activeArt.offsetWidth;
    activeArt.classList.add("is--playing");
  }

  currentActiveArt.current = activeArt;
}

export default function ProcessArtPlayback({ children }: ProcessArtPlaybackProps) {
  const trackRef = useRef<HTMLOListElement>(null);
  const { locomotiveScroll } = useLocomotiveScroll();

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    return syncLenisPreventMobile(track);
  }, []);

  useEffect(() => {
    if (!locomotiveScroll || !trackRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const track = trackRef.current;
    const mm = gsap.matchMedia();

    mm.add(MOBILE_CAROUSEL_MQ, () => {
      const currentActiveArt = { current: null as HTMLElement | null };

      setAllArtPlaying(track, false);

      const syncMobilePlayback = () => {
        updateMobileArtPlayback(track, currentActiveArt);
      };

      syncMobilePlayback();

      track.addEventListener("scroll", syncMobilePlayback, { passive: true });
      window.addEventListener("resize", syncMobilePlayback);

      const visibilityTrigger = ScrollTrigger.create({
        trigger: track,
        scroller: document.body,
        start: "top bottom",
        end: "bottom top",
        onUpdate: syncMobilePlayback,
        onToggle: syncMobilePlayback,
      });

      return () => {
        track.removeEventListener("scroll", syncMobilePlayback);
        window.removeEventListener("resize", syncMobilePlayback);
        visibilityTrigger.kill();
        if (currentActiveArt.current) {
          currentActiveArt.current.classList.remove("is--playing");
          currentActiveArt.current = null;
        }
      };
    });

    mm.add("(min-width: 640px)", () => {
      setAllArtPlaying(track, false);

      const trigger = ScrollTrigger.create({
        trigger: track,
        scroller: document.body,
        start: "top 48%",
        onEnter: () => setAllArtPlaying(track, true),
        onLeaveBack: () => setAllArtPlaying(track, false),
      });

      ScrollTrigger.refresh();

      return () => {
        trigger.kill();
        setAllArtPlaying(track, false);
      };
    });

    ScrollTrigger.refresh();

    return () => {
      mm.revert();
    };
  }, [locomotiveScroll]);

  return (
    <ol ref={trackRef} className="horizontal-steps__track">
      {children}
    </ol>
  );
}
