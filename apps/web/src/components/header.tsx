"use client";

import { cn } from "@flowlined-web/ui/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import Cta from "@/components/cta";

function getScrollY() {
  return window.scrollY || document.documentElement.scrollTop || 0;
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(getScrollY() > 8);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 flex h-[4.5rem] items-center px-16 transition-[background-color,backdrop-filter,border-color,box-shadow] duration-300",
        scrolled
          ? "border-b border-white/10 bg-[#000c10]/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex w-full items-center justify-between">
        <Link href="/" className="relative block h-[34px] w-[30px] shrink-0">
          <Image
            alt="Flowlined"
            className="object-contain"
            fill
            priority
            src="/images/flowlined-logo.svg"
          />
        </Link>

        <Cta href="#contact">Plan een gesprek</Cta>
      </div>
    </header>
  );
}
