"use client";

import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
  useEffect,
  useRef,
} from "react";

import { syncLenisPreventMobile } from "@/lib/sync-lenis-prevent-mobile";

type MobileScrollTrackProps<T extends ElementType> = {
  as?: T;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

export default function MobileScrollTrack<T extends ElementType = "div">({
  as,
  className,
  children,
  ...props
}: MobileScrollTrackProps<T>) {
  const Tag = as ?? "div";
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    return syncLenisPreventMobile(element);
  }, []);

  return (
    <Tag ref={ref as never} className={className} {...props}>
      {children}
    </Tag>
  );
}
