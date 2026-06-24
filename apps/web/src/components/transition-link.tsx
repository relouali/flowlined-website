"use client";

import type { Route } from "next";
import Link from "next/link";
import type { ComponentPropsWithoutRef, MouseEvent } from "react";

import { transitionNavigate } from "@/components/page-transition-controller";

type TransitionLinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, "href"> & {
  href: string;
};

/**
 * A next/link that plays the column-wipe page transition on click. Modifier
 * clicks (new tab, middle-click, etc.) fall through to the native anchor, and
 * if no transition provider is mounted the link navigates normally.
 */
export default function TransitionLink({
  href,
  onClick,
  ...props
}: TransitionLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    if (transitionNavigate(href)) {
      event.preventDefault();
    }
  }

  return <Link href={href as Route} onClick={handleClick} {...props} />;
}
