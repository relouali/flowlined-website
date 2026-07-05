import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
import Draggable from "gsap/Draggable";

gsap.registerPlugin(Draggable, CustomEase);

if (!CustomEase.get("osmo")) {
  CustomEase.create("osmo", "0.625, 0.05, 0, 1");
}

function getStackElements(root: ParentNode | Document): Element[] {
  if (root instanceof Element && root.matches("[data-dropping-stack-init]")) {
    return [root];
  }

  return Array.from(root.querySelectorAll("[data-dropping-stack-init]"));
}

export function initDroppingCardsStack(root: ParentNode | Document = document) {
  const stacks = getStackElements(root);
  if (!stacks.length) return () => {};

  const cleanups: Array<() => void> = [];

  // Settings
  const visibleCount = 4;
  const minTotalForLoop = 5;
  const duration = 0.75;
  const mainEase = "osmo";
  const dragThresholdPercent = 20;

  // Color follows stack position (not the card), so the front card is always
  // the darkest and cards get lighter toward the back regardless of which step
  // is active. Index 0 = front; the last entry covers hidden/incoming cards.
  const depthColors = ["#0a1418", "#1b2a31", "#33454d", "#4d626b", "#66808a"];
  const colorAtDepth = (depth: number) =>
    depthColors[Math.min(depth, depthColors.length - 1)];

  const getUnitValue = (val: string, depth: number) => {
    const num = parseFloat(val) || 0;
    const unit = String(val).replace(/[0-9.-]/g, "") || "px";
    return num * depth + unit;
  };

  stacks.forEach((stackEl) => {
    const nextBtn = stackEl.querySelector("[data-dropping-stack-next]");
    const prevBtn = stackEl.querySelector("[data-dropping-stack-prev]");

    const list = stackEl.querySelector(".dropping-stack__list");
    if (!list) return;

    let cards = Array.from(
      list.querySelectorAll("[data-dropping-stack-item]"),
    );
    if (cards.length < 3) return;

    const clonedNodes: Element[] = [];
    const originalCount = cards.length;
    if (cards.length < minTotalForLoop) {
      const setsNeeded = Math.ceil(minTotalForLoop / originalCount);
      const clonesToAdd = setsNeeded * originalCount - originalCount;

      for (let i = 0; i < clonesToAdd; i++) {
        const clone = cards[i % originalCount].cloneNode(true) as HTMLElement;
        clone.setAttribute("aria-hidden", "true");
        list.appendChild(clone);
        clonedNodes.push(clone);
      }

      cards = Array.from(list.querySelectorAll("[data-dropping-stack-item]"));
    }

    const total = cards.length;
    let activeIndex = 0;
    let isAnimating = false;

    let dragCard: Element | null = null;
    let draggableInstance: Draggable | null = null;

    let limitX = 1;
    let limitY = 1;

    let offsetX = "0em";
    let offsetY = "0em";

    let isActive = false;

    const mod = (n: number, m: number) => ((n % m) + m) % m;
    const cardAt = (offset: number) => cards[mod(activeIndex + offset, total)];
    const innerOf = (item: Element) =>
      item.querySelector(".dropping-stack-card") ?? item;

    function updateOffsetsFromPadding() {
      const collectionEl = stackEl.querySelector("[data-dropping-stack-collection]");
      if (!collectionEl) return;

      const styles = getComputedStyle(collectionEl);

      const padRight = parseFloat(styles.paddingRight) || 0;
      const padLeft = parseFloat(styles.paddingLeft) || 0;

      const padBottom = parseFloat(styles.paddingBottom) || 0;
      const padTop = parseFloat(styles.paddingTop) || 0;

      const steps = Math.max(1, visibleCount - 1);

      const usePadX = Math.max(padRight, padLeft);
      const usePadY = Math.max(padBottom, padTop);

      const signX = padLeft > padRight ? -1 : 1;
      const signY = padTop > padBottom ? -1 : 1;

      const xStep = (usePadX / steps) * signX;
      const yStep = (usePadY / steps) * signY;

      offsetX = xStep + "px";
      offsetY = yStep + "px";
    }

    function updateDragLimits() {
      if (!dragCard) return;
      const cardRect = dragCard.getBoundingClientRect();
      limitX = cardRect.width || 1;
      limitY = cardRect.height || 1;
    }

    function applyState() {
      updateOffsetsFromPadding();

      cards.forEach((card) => {
        gsap.set(card, {
          opacity: 0,
          pointerEvents: "none",
          zIndex: 0,
          x: 0,
          y: 0,
          xPercent: 0,
          yPercent: 0,
        });
        // Hidden cards sit at the deepest (lightest) color, ready to come in.
        gsap.set(innerOf(card), { backgroundColor: colorAtDepth(visibleCount) });
      });

      for (let depth = 0; depth < visibleCount; depth++) {
        const card = cardAt(depth);
        const xVal = getUnitValue(offsetX, depth);
        const yVal = getUnitValue(offsetY, depth);

        const state: gsap.TweenVars = {
          opacity: 1,
          zIndex: 999 - depth,
          pointerEvents: depth === 0 ? "auto" : "none",
        };

        if (offsetX.includes("%")) state.xPercent = parseFloat(xVal);
        else state.x = xVal;
        if (offsetY.includes("%")) state.yPercent = parseFloat(yVal);
        else state.y = yVal;

        gsap.set(card, state);
        gsap.set(innerOf(card), { backgroundColor: colorAtDepth(depth) });
      }

      dragCard = cardAt(0);
      gsap.set(dragCard, { touchAction: "none" });

      updateDragLimits();

      if (draggableInstance) {
        draggableInstance.kill();
        draggableInstance = null;
      }

      const magnetize = (raw: number, limit: number) => {
        const sign = Math.sign(raw) || 1;
        const abs = Math.abs(raw);
        const out = limit * Math.tanh(abs / limit);
        return sign * out;
      };

      draggableInstance = Draggable.create(dragCard, {
        type: "x,y",
        inertia: false,
        onPress: function () {
          if (isAnimating) return;
          gsap.killTweensOf(dragCard);
          gsap.set(dragCard, { zIndex: 2000, opacity: 1 });
        },
        onDrag: function () {
          if (isAnimating) return;

          const x = magnetize(this.x, limitX);
          const y = magnetize(this.y, limitY);

          gsap.set(dragCard, { x, y, opacity: 1 });
        },
        onRelease: function () {
          if (isAnimating) return;

          const currentX = gsap.getProperty(dragCard, "x") as number;
          const currentY = gsap.getProperty(dragCard, "y") as number;

          const movedXPercent = (Math.abs(currentX) / limitX) * 100;
          const movedYPercent = (Math.abs(currentY) / limitY) * 100;
          const movedPercent = Math.max(movedXPercent, movedYPercent);

          if (movedPercent >= dragThresholdPercent) {
            animateNext(true, currentX, currentY);
            return;
          }

          gsap.to(dragCard, {
            x: 0,
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "elastic.out(1, 0.7)",
            onComplete: () => {
              applyState();
            },
          });
        },
      })[0];

      stackEl.classList.add("is--ready");
    }

    function animateNext(fromDrag = false, releaseX = 0, releaseY = 0) {
      if (isAnimating) return;
      isAnimating = true;

      const outgoing = cardAt(0);
      const incomingBack = cardAt(visibleCount);
      const tl = gsap.timeline({
        defaults: { duration, ease: mainEase },
        onComplete: () => {
          activeIndex = mod(activeIndex + 1, total);
          applyState();
          isAnimating = false;
        },
      });

      gsap.set(outgoing, { zIndex: 2000, opacity: 1 });
      if (fromDrag) gsap.set(outgoing, { x: releaseX, y: releaseY });

      tl.to(outgoing, { yPercent: 200 }, 0);
      tl.to(
        outgoing,
        { opacity: 0, duration: duration * 0.2, ease: "none" },
        duration * 0.4,
      );

      for (let depth = 1; depth < visibleCount; depth++) {
        const xVal = getUnitValue(offsetX, depth - 1);
        const yVal = getUnitValue(offsetY, depth - 1);
        const move: gsap.TweenVars = { zIndex: 999 - (depth - 1) };

        if (offsetX.includes("%")) move.xPercent = parseFloat(xVal);
        else move.x = xVal;
        if (offsetY.includes("%")) move.yPercent = parseFloat(yVal);
        else move.y = yVal;

        tl.to(cardAt(depth), move, 0);
        // Card moves one step toward the front → darken to that depth's color.
        tl.to(
          innerOf(cardAt(depth)),
          { backgroundColor: colorAtDepth(depth - 1) },
          0,
        );
      }

      const backX = getUnitValue(offsetX, visibleCount);
      const backY = getUnitValue(offsetY, visibleCount);
      const startX = getUnitValue(offsetX, visibleCount - 1);
      const startY = getUnitValue(offsetY, visibleCount - 1);

      const incomingSet: gsap.TweenVars = {
        opacity: 0,
        zIndex: 999 - visibleCount,
      };
      if (offsetX.includes("%")) incomingSet.xPercent = parseFloat(backX);
      else incomingSet.x = backX;
      if (offsetY.includes("%")) incomingSet.yPercent = parseFloat(backY);
      else incomingSet.y = backY;
      gsap.set(incomingBack, incomingSet);
      gsap.set(innerOf(incomingBack), {
        backgroundColor: colorAtDepth(visibleCount),
      });

      const incomingTo: gsap.TweenVars = { opacity: 1 };
      if (offsetX.includes("%")) incomingTo.xPercent = parseFloat(startX);
      else incomingTo.x = startX;
      if (offsetY.includes("%")) incomingTo.yPercent = parseFloat(startY);
      else incomingTo.y = startY;
      tl.to(incomingBack, incomingTo, 0);
      tl.to(
        innerOf(incomingBack),
        { backgroundColor: colorAtDepth(visibleCount - 1) },
        0,
      );
    }

    function animatePrev() {
      if (isAnimating) return;
      isAnimating = true;

      const incomingTop = cardAt(-1);
      const leavingBack = cardAt(visibleCount - 1);
      const tl = gsap.timeline({
        defaults: { duration, ease: mainEase },
        onComplete: () => {
          activeIndex = mod(activeIndex - 1, total);
          applyState();
          isAnimating = false;
        },
      });

      gsap.set(leavingBack, { zIndex: 1 });

      gsap.set(incomingTop, {
        opacity: 0,
        x: 0,
        xPercent: 0,
        yPercent: -200,
        zIndex: 2000,
      });
      // A card returning to the front arrives already at the front color.
      gsap.set(innerOf(incomingTop), { backgroundColor: colorAtDepth(0) });
      tl.to(incomingTop, { yPercent: 0 }, 0);
      tl.to(
        incomingTop,
        { opacity: 1, duration: duration * 0.2, ease: "none" },
        duration * 0.3,
      );

      for (let depth = 0; depth < visibleCount - 1; depth++) {
        const xVal = getUnitValue(offsetX, depth + 1);
        const yVal = getUnitValue(offsetY, depth + 1);
        const move: gsap.TweenVars = { zIndex: 999 - (depth + 1) };

        if (offsetX.includes("%")) move.xPercent = parseFloat(xVal);
        else move.x = xVal;
        if (offsetY.includes("%")) move.yPercent = parseFloat(yVal);
        else move.y = yVal;

        tl.to(cardAt(depth), move, 0);
        // Card moves one step toward the back → lighten to that depth's color.
        tl.to(
          innerOf(cardAt(depth)),
          { backgroundColor: colorAtDepth(depth + 1) },
          0,
        );
      }

      const backX = getUnitValue(offsetX, visibleCount);
      const backY = getUnitValue(offsetY, visibleCount);
      const hideBack: gsap.TweenVars = { opacity: 0 };
      if (offsetX.includes("%")) hideBack.xPercent = parseFloat(backX);
      else hideBack.x = backX;
      if (offsetY.includes("%")) hideBack.yPercent = parseFloat(backY);
      else hideBack.y = backY;
      tl.to(leavingBack, hideBack, 0);
      tl.to(
        innerOf(leavingBack),
        { backgroundColor: colorAtDepth(visibleCount) },
        0,
      );
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isActive = entry.isIntersecting && entry.intersectionRatio >= 0.6;
        });
      },
      { threshold: [0, 0.6, 1] },
    );

    observer.observe(stackEl);

    const onKeyDown = (e: KeyboardEvent) => {
      if (!isActive) return;
      if (isAnimating) return;

      const target = e.target as HTMLElement | null;
      const tag = target?.tagName ? target.tagName.toLowerCase() : "";
      const isTyping =
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        target?.isContentEditable;
      if (isTyping) return;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        animateNext(false);
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        animatePrev();
      }
    };

    const onResize = () => {
      applyState();
    };

    const onNextClick = () => animateNext(false);
    const onPrevClick = () => animatePrev();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    applyState();

    nextBtn?.addEventListener("click", onNextClick);
    prevBtn?.addEventListener("click", onPrevClick);

    cleanups.push(() => {
      observer.disconnect();
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      nextBtn?.removeEventListener("click", onNextClick);
      prevBtn?.removeEventListener("click", onPrevClick);
      draggableInstance?.kill();
      gsap.killTweensOf(cards);
      clonedNodes.forEach((node) => node.remove());
      stackEl.classList.remove("is--ready");
    });
  });

  return () => {
    cleanups.forEach((cleanup) => cleanup());
  };
}
