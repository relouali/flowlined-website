"use client";

import Lottie from "lottie-react";
import { useEffect, useState } from "react";

type LottieIconProps = {
  size: number;
  src: string;
};

export default function LottieIcon({ size, src }: LottieIconProps) {
  const [animationData, setAnimationData] = useState<object | null>(null);

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
        animationData={animationData}
        autoplay
        loop
        style={{ width: size, height: size }}
      />
    </div>
  );
}
