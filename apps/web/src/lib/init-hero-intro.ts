import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

const INTRO_EASE = "osmo";
const TEXT_EASE = "power4.out";
const EXPAND_DURATION = 1.35;
const TEXT_START = EXPAND_DURATION * 0.58;

const LINE_ENTER = { yPercent: 120, autoAlpha: 0 };
const LINE_VISIBLE = { yPercent: 0, autoAlpha: 1 };

function getIntroTargets(frame: HTMLElement) {
  const shell = frame.closest(".section-shell") as HTMLElement | null;
  const sectionFrame = frame.parentElement as HTMLElement | null;

  return { shell, sectionFrame, frame };
}

function getExpandedShellPadding() {
  // Expand all the way to a full-bleed, edge-to-edge hero (no panel gutter),
  // matching the resting `width="full"` state so the intro lands without a snap.
  return {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  };
}

function getExpandedFrameHeight() {
  return "100dvh";
}

function runIntro(
  frame: HTMLElement,
  shell: HTMLElement,
  sectionFrame: HTMLElement,
) {
  const media = frame.querySelector<HTMLElement>(".hero__media");
  const titleLines = Array.from(
    frame.querySelectorAll<HTMLElement>(".hero__title-line"),
  );
  const leadLines = Array.from(
    frame.querySelectorAll<HTMLElement>(".hero__lead-line"),
  );

  const isDesktop = window.matchMedia("(min-width: 768px)").matches;

  gsap.set(shell, {
    paddingTop: isDesktop ? "24vh" : "28vh",
    paddingBottom: isDesktop ? "24vh" : "28vh",
    paddingLeft: isDesktop ? "16vw" : "1.25rem",
    paddingRight: isDesktop ? "16vw" : "1.25rem",
  });
  gsap.set(sectionFrame, {
    borderRadius: "1rem",
    overflow: "hidden",
  });
  gsap.set(frame, {
    minHeight: isDesktop ? "38vh" : "42svh",
    width: "100%",
  });
  if (media) {
    gsap.set(media, { scale: 1.12 });
  }
  if (titleLines.length) {
    gsap.set(titleLines, LINE_ENTER);
  }
  if (leadLines.length) {
    gsap.set(leadLines, LINE_ENTER);
  }

  const expandedPadding = getExpandedShellPadding();
  const expandedHeight = getExpandedFrameHeight();

  const tl = gsap.timeline({
    defaults: { ease: INTRO_EASE },
    onComplete: () => {
      gsap.set([shell, sectionFrame, frame, media], { clearProps: "all" });
      frame.classList.add("is--intro-ready");
      shell.classList.add("is--intro-ready");
    },
  });

  tl.to(
    shell,
    {
      ...expandedPadding,
      duration: EXPAND_DURATION,
    },
    0,
  );

  tl.to(
    frame,
    {
      minHeight: expandedHeight,
      duration: EXPAND_DURATION,
    },
    0,
  );

  tl.to(
    sectionFrame,
    {
      borderRadius: 0,
      duration: EXPAND_DURATION,
    },
    0,
  );

  if (media) {
    tl.to(
      media,
      {
        scale: 1,
        duration: EXPAND_DURATION + 0.15,
        ease: INTRO_EASE,
      },
      0,
    );
  }

  if (titleLines.length) {
    tl.to(
      titleLines,
      {
        ...LINE_VISIBLE,
        duration: 1.05,
        stagger: 0.13,
        ease: TEXT_EASE,
      },
      TEXT_START,
    );
  }

  if (leadLines.length) {
    tl.to(
      leadLines,
      {
        ...LINE_VISIBLE,
        duration: 1.05,
        stagger: 0.13,
        ease: TEXT_EASE,
      },
      TEXT_START + 0.39,
    );
  }

  return tl;
}

export function initHeroIntro(frame: HTMLElement) {
  gsap.registerPlugin(CustomEase);

  if (!CustomEase.get("osmo")) {
    CustomEase.create("osmo", "0.625, 0.05, 0, 1");
  }

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const { shell, sectionFrame } = getIntroTargets(frame);

  if (reducedMotion) {
    frame.classList.add("is--intro-ready");
    shell?.classList.add("is--intro-ready");
    return () => {};
  }

  if (!shell || !sectionFrame) {
    frame.classList.add("is--intro-ready");
    shell?.classList.add("is--intro-ready");
    return () => {};
  }

  const timeline = runIntro(frame, shell, sectionFrame);

  return () => {
    timeline.kill();
    gsap.set([shell, sectionFrame, frame], { clearProps: "all" });
    frame.classList.remove("is--intro-ready");
    shell.classList.remove("is--intro-ready");
  };
}
