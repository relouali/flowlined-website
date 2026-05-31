"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, type ReactNode } from "react";

import { useLocomotiveScroll } from "@/components/locomotive-scroll-provider";
import {
  debounceOnWidthChange,
  initGsapSlider,
} from "@/lib/init-gsap-slider";
import { MOBILE_CAROUSEL_MQ } from "@/lib/sync-lenis-prevent-mobile";

type ProcessArtPlaybackProps = {
  children: ReactNode;
};

function setAllArtPlaying(track: HTMLElement, playing: boolean) {
  track.querySelectorAll<HTMLElement>(".process-art").forEach((art) => {
    art.classList.toggle("is--playing", playing);
  });
}

function updateMobileArtPlayback(
  slider: HTMLElement,
  currentActiveArt: { current: HTMLElement | null },
) {
  const collection = slider.querySelector<HTMLElement>(
    "[data-gsap-slider-collection]",
  );

  if (!collection) return;

  const collectionRect = collection.getBoundingClientRect();

  if (collectionRect.bottom <= 0 || collectionRect.top >= window.innerHeight) {
    if (currentActiveArt.current) {
      currentActiveArt.current.classList.remove("is--playing");
      currentActiveArt.current = null;
    }
    return;
  }

  let activeArt: HTMLElement | null = null;
  const activeCard = slider.querySelector<HTMLElement>(
    '[data-gsap-slider-item-status="active"]',
  );

  if (activeCard) {
    activeArt = activeCard.querySelector<HTMLElement>(".process-art");
  } else {
    const viewportCenter = collectionRect.left + collectionRect.width / 2;
    const cards = slider.querySelectorAll<HTMLElement>(".horizontal-steps__card");
    let bestDistance = Infinity;

    for (const card of cards) {
      const rect = card.getBoundingClientRect();
      const isVisible =
        rect.right > collectionRect.left + 8 &&
        rect.left < collectionRect.right - 8;

      if (!isVisible) continue;

      const cardCenter = rect.left + rect.width / 2;
      const distance = Math.abs(cardCenter - viewportCenter);

      if (distance < bestDistance) {
        bestDistance = distance;
        activeArt = card.querySelector<HTMLElement>(".process-art");
      }
    }
  }

  if (activeArt === currentActiveArt.current) return;

  if (currentActiveArt.current) {
    currentActiveArt.current.classList.remove("is--playing");
  }

  if (activeArt !== null) {
    activeArt.classList.remove("is--playing");
    void activeArt.offsetWidth;
    activeArt.classList.add("is--playing");
  }

  currentActiveArt.current = activeArt;
}

export default function ProcessArtPlayback({ children }: ProcessArtPlaybackProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const { locomotiveScroll } = useLocomotiveScroll();

  useEffect(() => {
    if (!locomotiveScroll || !sliderRef.current || !trackRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const slider = sliderRef.current;
    const track = trackRef.current;
    const mm = gsap.matchMedia();
    const currentActiveArt = { current: null as HTMLElement | null };

    const syncMobilePlayback = () => {
      updateMobileArtPlayback(slider, currentActiveArt);
    };

    mm.add(MOBILE_CAROUSEL_MQ, () => {
      setAllArtPlaying(track, false);

      let revertSlider = initGsapSlider(slider, {
        onUpdate: syncMobilePlayback,
      });

      syncMobilePlayback();

      const handleResize = debounceOnWidthChange(() => {
        revertSlider();
        revertSlider = initGsapSlider(slider, {
          onUpdate: syncMobilePlayback,
        });
        syncMobilePlayback();
        ScrollTrigger.refresh();
      }, 200);

      window.addEventListener("resize", handleResize);

      const visibilityTrigger = ScrollTrigger.create({
        trigger: slider,
        scroller: document.body,
        start: "top bottom",
        end: "bottom top",
        onUpdate: syncMobilePlayback,
        onToggle: syncMobilePlayback,
      });

      return () => {
        window.removeEventListener("resize", handleResize);
        visibilityTrigger.kill();
        revertSlider();

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
    <div
      ref={sliderRef}
      data-gsap-slider-init
      className="horizontal-steps__slider"
      aria-label="Processtappen"
    >
      <div
        data-gsap-slider-collection
        className="horizontal-steps__collection"
      >
        <ol ref={trackRef} data-gsap-slider-list className="horizontal-steps__track">
          {children}
        </ol>
      </div>
    </div>
  );
}
