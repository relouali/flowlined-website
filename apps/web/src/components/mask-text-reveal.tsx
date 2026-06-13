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
   * When true the lines roll up from below the mask into place. When it
   * flips back to false the lines roll further up and out of the mask
   * (rather than snapping), so swapping `active` between sibling elements
   * reads as one continuous vertical rotation — old text exits the top
   * while new text enters from the bottom.
   */
  active?: boolean;
  /** Enter (roll-in) duration. */
  duration?: number;
  /** Exit (roll-out) duration. */
  exitDuration?: number;
  stagger?: number;
  delay?: number;
  ease?: string;
};

type SplitTextInstance = {
  revert: () => void;
  lines: Element[];
};

// Masked-line states. Lines enter from below (+) and exit through the top (−);
// autoAlpha cross-fades them so overlapping in/out text stays clean.
const ENTER_FROM = { yPercent: 150, autoAlpha: 0 };
const EXIT_TO = { yPercent: -150, autoAlpha: 0 };
const VISIBLE = { yPercent: 0, autoAlpha: 1 };

/**
 * Vertical "rotating text" reveal. Each time `active` toggles the SplitText
 * lines roll in or out of their line-masks, so a cycling picker (e.g.
 * LoopingWords) produces a continuous upward rotation between items.
 */
export default function MaskTextReveal({
  as: Tag = "div",
  children,
  className,
  active = false,
  duration = 0.75,
  exitDuration = 0.6,
  stagger = 0.05,
  delay = 0,
  ease = "power4.inOut",
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
      tweenRef.current = gsap.fromTo(s.lines, ENTER_FROM, {
        ...VISIBLE,
        duration,
        stagger,
        delay,
        ease,
      });
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
            gsap.set(
              instance.lines,
              activeRef.current ? VISIBLE : ENTER_FROM,
            );
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
    // We intentionally do NOT include the motion props here. They are read
    // fresh on every active-effect run via the closure below, and the
    // initial setup uses them once at mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Roll the lines in (active) or out (inactive) whenever `active` changes.
  useEffect(() => {
    const s = splitRef.current;
    if (!s) return;

    if (tweenRef.current) tweenRef.current.kill();

    if (active) {
      tweenRef.current = gsap.fromTo(s.lines, ENTER_FROM, {
        ...VISIBLE,
        duration,
        stagger,
        delay,
        ease,
      });
    } else {
      tweenRef.current = gsap.to(s.lines, {
        ...EXIT_TO,
        duration: exitDuration,
        stagger,
        delay,
        ease,
      });
    }
  }, [active, duration, exitDuration, stagger, delay, ease]);

  const TagComponent = Tag as ElementType;
  return (
    <TagComponent ref={elRef as Ref<HTMLElement>} className={className}>
      {children}
    </TagComponent>
  );
}
