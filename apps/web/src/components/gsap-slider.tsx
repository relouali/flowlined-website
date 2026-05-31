"use client";

import { useEffect, useRef, type ReactNode, type RefObject } from "react";

import { useLocomotiveScroll } from "@/components/locomotive-scroll-provider";
import {
  debounceOnWidthChange,
  initGsapSlider,
} from "@/lib/init-gsap-slider";
import { MOBILE_CAROUSEL_MQ } from "@/lib/sync-lenis-prevent-mobile";

type GsapSliderProps = {
  children: ReactNode;
  className?: string;
  collectionClassName?: string;
  trackClassName?: string;
  trackAs?: "div" | "ul";
  trackRef?: RefObject<HTMLDivElement | HTMLUListElement | null>;
  ariaLabel?: string;
  onUpdate?: () => void;
};

export default function GsapSlider({
  children,
  className,
  collectionClassName,
  trackClassName,
  trackAs = "div",
  trackRef,
  ariaLabel = "Slider",
  onUpdate,
}: GsapSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const { locomotiveScroll } = useLocomotiveScroll();

  useEffect(() => {
    if (!locomotiveScroll || !sliderRef.current) return;

    const slider = sliderRef.current;
    const media = window.matchMedia(MOBILE_CAROUSEL_MQ);

    let revertSlider = () => {};

    const mountSlider = () => {
      revertSlider();
      if (!media.matches) return;
      revertSlider = initGsapSlider(slider, { onUpdate });
      onUpdate?.();
    };

    mountSlider();

    const handleResize = debounceOnWidthChange(() => {
      mountSlider();
    }, 200);

    const handleMediaChange = () => {
      mountSlider();
    };

    window.addEventListener("resize", handleResize);
    media.addEventListener("change", handleMediaChange);

    return () => {
      window.removeEventListener("resize", handleResize);
      media.removeEventListener("change", handleMediaChange);
      revertSlider();
    };
  }, [locomotiveScroll, onUpdate]);

  const TrackTag = trackAs;

  return (
    <div
      ref={sliderRef}
      data-gsap-slider-init
      className={className}
      aria-label={ariaLabel}
    >
      <div
        data-gsap-slider-collection
        className={collectionClassName}
      >
        <TrackTag
          ref={trackRef as RefObject<HTMLDivElement & HTMLUListElement>}
          data-gsap-slider-list
          className={trackClassName}
        >
          {children}
        </TrackTag>
      </div>
    </div>
  );
}
