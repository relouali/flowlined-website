"use client";

import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  remapLottieColors,
  type LottieColorPair,
} from "@/lib/remap-lottie-colors";

type LottieIconProps = {
  size: number;
  src: string;
  /** When false the icon sits on its first frame; set true to play (looping). */
  play?: boolean;
  /** Remap wired-gradient primary/secondary controls to match section palette. */
  colors?: LottieColorPair;
};

export default function LottieIcon({
  size,
  src,
  play = false,
  colors,
}: LottieIconProps) {
  const [rawAnimationData, setRawAnimationData] = useState<object | null>(null);
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    let active = true;

    fetch(src)
      .then((response) => response.json())
      .then((data) => {
        if (active) setRawAnimationData(data);
      });

    return () => {
      active = false;
    };
  }, [src]);

  const animationData = useMemo(() => {
    if (!rawAnimationData) return null;
    if (!colors) return rawAnimationData;
    return remapLottieColors(rawAnimationData, colors);
  }, [rawAnimationData, colors]);

  // Drive playback from the `play` prop. Re-run when the data finishes
  // loading so a hover that happened before load is honored once ready.
  // On hover-out, let the current loop finish before stopping so the
  // animation doesn't cut off mid-cycle.
  useEffect(() => {
    const instance = lottieRef.current;
    if (!instance) return;

    if (play) {
      instance.play();
      return;
    }

    const anim = instance.animationItem;
    if (!anim) {
      instance.stop();
      return;
    }

    const onLoopComplete = () => instance.stop();
    anim.addEventListener("loopComplete", onLoopComplete);
    return () => anim.removeEventListener("loopComplete", onLoopComplete);
  }, [play, animationData]);

  if (!animationData) {
    return (
      <div
        aria-hidden
        className="shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div aria-hidden className="shrink-0" style={{ width: size, height: size }}>
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        autoplay={false}
        loop
        style={{ width: size, height: size }}
      />
    </div>
  );
}
