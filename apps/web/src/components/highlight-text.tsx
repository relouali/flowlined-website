"use client";

import { useEffect, useRef, type ReactNode, type Ref } from "react";

import { useLocomotiveScroll } from "@/components/locomotive-scroll-provider";
import { initHighlightText } from "@/lib/init-highlight-text";

type HighlightTextProps = {
  as?: "h1" | "h2" | "h3" | "p" | "span";
  children: ReactNode;
  className?: string;
  fade?: number;
  scrollEnd?: string;
  scrollStart?: string;
  stagger?: number;
};

export default function HighlightText({
  as: Tag = "h2",
  children,
  className,
  fade,
  scrollEnd,
  scrollStart,
  stagger,
}: HighlightTextProps) {
  const headingRef = useRef<HTMLElement>(null);
  const { locomotiveScroll } = useLocomotiveScroll();

  useEffect(() => {
    if (!locomotiveScroll || !headingRef.current) return;

    const revert = initHighlightText(headingRef.current);

    return () => {
      revert();
    };
  }, [locomotiveScroll]);

  return (
    <Tag
      ref={headingRef as Ref<HTMLHeadingElement>}
      className={className}
      {...(fade !== undefined ? { "data-highlight-fade": fade } : {})}
      {...(scrollEnd !== undefined ? { "data-highlight-scroll-end": scrollEnd } : {})}
      {...(scrollStart !== undefined ? { "data-highlight-scroll-start": scrollStart } : {})}
      {...(stagger !== undefined ? { "data-highlight-stagger": stagger } : {})}
      data-highlight-text
    >
      {children}
    </Tag>
  );
}
