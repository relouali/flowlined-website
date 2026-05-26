"use client";

import gsap from "gsap";
import SplitText from "gsap/SplitText";
import {
  useEffect,
  useRef,
  type ElementType,
  type ReactNode,
  type Ref,
} from "react";

type Tag =
  | "div"
  | "span"
  | "p"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6";

type MaskTextRevealProps = {
  as?: Tag;
  children: ReactNode;
  className?: string;
  /**
   * When true, the lines animate from below the mask (yPercent: 110) up to
   * their natural position. When false, lines are snapped back below the
   * mask so the next reveal can replay cleanly.
   */
  active?: boolean;
  duration?: number;
  stagger?: number;
  delay?: number;
};

type SplitTextInstance = {
  revert: () => void;
  lines: Element[];
};

/**
 * Osmo "MaskText Scroll Reveal" pattern as a React component. The reveal
 * fires each time `active` toggles from false → true so the same component
 * can replay infinitely (e.g. driven by a cycling LoopingWords picker).
 */
export default function MaskTextReveal({
  as: Tag = "div",
  children,
  className,
  active = false,
  duration = 0.8,
  stagger = 0.08,
  delay = 0,
}: MaskTextRevealProps) {
  const elRef = useRef<HTMLElement | null>(null);
  const splitRef = useRef<SplitTextInstance | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  // Setup SplitText once on mount. We wait for the fonts to be ready so the
  // line breaks are calculated against the final font metrics — splitting
  // before fallback → web font swap causes lines to be mismeasured.
  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    if (typeof window === "undefined") return;

    gsap.registerPlugin(SplitText);

    let cancelled = false;

    const playReveal = () => {
      const s = splitRef.current;
      if (!s) return;
      if (tweenRef.current) tweenRef.current.kill();
      tweenRef.current = gsap.fromTo(
        s.lines,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration,
          stagger,
          delay,
          ease: "expo.out",
        },
      );
    };

    const setup = () => {
      if (cancelled || !el) return;

      try {
        const split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          linesClass: "mask-reveal-line",
          onSplit: (instance: SplitTextInstance) => {
            // Whenever the text resplits (resize / font load), reset the
            // lines to whichever state matches the current active flag.
            gsap.set(instance.lines, {
              yPercent: activeRef.current ? 0 : 110,
            });
          },
        }) as unknown as SplitTextInstance;

        splitRef.current = split;

        if (activeRef.current) {
          playReveal();
        }
      } catch (err) {
        // Fail-safe: if SplitText errors (e.g. missing license in dev),
        // leave the original text untouched so content is still readable.
        // eslint-disable-next-line no-console
        console.error("MaskTextReveal SplitText failed", err);
      }
    };

    const fonts = (
      document as Document & { fonts?: { ready: Promise<unknown> } }
    ).fonts;
    if (fonts && fonts.ready) {
      fonts.ready.then(setup);
    } else {
      setup();
    }

    return () => {
      cancelled = true;
      if (tweenRef.current) {
        tweenRef.current.kill();
        tweenRef.current = null;
      }
      if (splitRef.current) {
        splitRef.current.revert();
        splitRef.current = null;
      }
    };
    // We intentionally do NOT include duration/stagger/delay here. Those
    // props are read fresh on every active-effect run via the closure
    // below, and the initial setup uses them once at mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Replay the reveal whenever `active` flips on. When `active` flips off,
  // snap the lines back below the mask so the next reveal starts from a
  // clean hidden state.
  useEffect(() => {
    const s = splitRef.current;
    if (!s) return;

    if (tweenRef.current) tweenRef.current.kill();

    if (active) {
      tweenRef.current = gsap.fromTo(
        s.lines,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration,
          stagger,
          delay,
          ease: "expo.out",
        },
      );
    } else {
      gsap.set(s.lines, { yPercent: 110 });
    }
  }, [active, duration, stagger, delay]);

  const TagComponent = Tag as ElementType;
  return (
    <TagComponent
      ref={elRef as Ref<HTMLElement>}
      className={className}
    >
      {children}
    </TagComponent>
  );
}
