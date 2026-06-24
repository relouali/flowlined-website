"use client";

import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import { useEffect, useRef, useState } from "react";

type LottieIconProps = {
  size: number;
  src: string;
  /** When false the icon sits on its first frame; set true to play (looping). */
  play?: boolean;
};

export default function LottieIcon({ size, src, play = false }: LottieIconProps) {
  const [animationData, setAnimationData] = useState<object | null>(null);
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    let active = true;

    fetch(src)
      .then((response) => response.json())
      .then((data) => {
        if (active) setAnimationData(data);
      });

    return () => {
      active = false;
    };
  }, [src]);

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
