"use client";

import { useEffect, useRef, type ReactNode, type Ref } from "react";

import { useLocomotiveScroll } from "@/components/locomotive-scroll-provider";
import { initScrollFadeText } from "@/lib/init-scroll-fade-text";

type ScrollFadeTextProps = {
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  children: ReactNode;
  className?: string;
  delay?: number;
  scrollStart?: string;
  y?: number;
};

export default function ScrollFadeText({
  as: Tag = "h2",
  children,
  className,
  delay = 0,
  scrollStart = "top 88%",
  y = 28,
}: ScrollFadeTextProps) {
  const elRef = useRef<HTMLElement>(null);
  const { locomotiveScroll } = useLocomotiveScroll();

  useEffect(() => {
    if (!locomotiveScroll || !elRef.current) return;

    const revert = initScrollFadeText(elRef.current);
    return revert;
  }, [locomotiveScroll]);

  return (
    <Tag
      ref={elRef as Ref<HTMLHeadingElement>}
      className={className}
      data-scroll-fade
      {...(delay > 0 ? { "data-scroll-fade-delay": delay } : {})}
      {...(scrollStart !== "top 88%"
        ? { "data-scroll-fade-start": scrollStart }
        : {})}
      {...(y !== 28 ? { "data-scroll-fade-y": y } : {})}
    >
      {children}
    </Tag>
  );
}
