import gsap from "gsap";
import Draggable from "gsap/Draggable";

type InitGsapSliderOptions = {
  onUpdate?: () => void;
};

type SliderRoot = HTMLElement & {
  _sliderDraggable?: Draggable;
};

export function initGsapSlider(
  root: HTMLElement | null,
  options: InitGsapSliderOptions = {},
): () => void {
  if (!root) return () => {};

  gsap.registerPlugin(Draggable);

  const sliderRoot = root as SliderRoot;

  if (sliderRoot._sliderDraggable) {
    sliderRoot._sliderDraggable.kill();
    sliderRoot._sliderDraggable = undefined;
  }

  const collection = root.querySelector<HTMLElement>(
    "[data-gsap-slider-collection]",
  );
  const track = root.querySelector<HTMLElement>("[data-gsap-slider-list]");
  const items = Array.from(
    root.querySelectorAll<HTMLElement>("[data-gsap-slider-item]"),
  );
  const controls = Array.from(
    root.querySelectorAll<HTMLButtonElement>("[data-gsap-slider-control]"),
  );

  if (!collection || !track || items.length === 0) {
    return () => {};
  }

  root.setAttribute("role", "region");
  root.setAttribute("aria-roledescription", "carousel");
  if (!root.hasAttribute("aria-label")) {
    root.setAttribute("aria-label", "Slider");
  }

  collection.setAttribute("role", "group");
  collection.setAttribute("aria-roledescription", "Slides List");
  collection.setAttribute("aria-label", "Slides");

  items.forEach((slide, index) => {
    slide.setAttribute("role", "group");
    slide.setAttribute("aria-roledescription", "Slide");
    slide.setAttribute("aria-label", `Slide ${index + 1} of ${items.length}`);
    slide.setAttribute("aria-hidden", "true");
    slide.setAttribute("aria-selected", "false");
    slide.setAttribute("tabindex", "-1");
  });

  controls.forEach((button) => {
    const direction = button.getAttribute("data-gsap-slider-control");
    button.setAttribute("role", "button");
    button.setAttribute(
      "aria-label",
      direction === "prev" ? "Previous Slide" : "Next Slide",
    );
    button.disabled = true;
    button.setAttribute("aria-disabled", "true");
  });

  const styles = getComputedStyle(root);
  const statusVar = styles.getPropertyValue("--slider-status").trim();
  let spvVar = Number.parseFloat(styles.getPropertyValue("--slider-spv"));
  const firstItemRect = items[0].getBoundingClientRect();
  const marginRight = Number.parseFloat(getComputedStyle(items[0]).marginRight);
  const slideWidth = firstItemRect.width + marginRight;

  if (Number.isNaN(spvVar)) {
    spvVar = collection.clientWidth / slideWidth;
  }

  const slidesPerView = Math.max(1, Math.min(spvVar, items.length));
  const sliderEnabled = statusVar === "on" && slidesPerView < items.length;

  root.setAttribute(
    "data-gsap-slider-status",
    sliderEnabled ? "active" : "not-active",
  );

  const controlListeners: Array<{
    button: HTMLButtonElement;
    handler: () => void;
  }> = [];

  if (!sliderEnabled) {
    track.removeAttribute("style");
    track.onmouseenter = null;
    track.onmouseleave = null;
    track.removeAttribute("data-gsap-slider-list-status");
    root.removeAttribute("role");
    root.removeAttribute("aria-roledescription");
    root.removeAttribute("aria-label");
    collection.removeAttribute("role");
    collection.removeAttribute("aria-roledescription");
    collection.removeAttribute("aria-label");

    items.forEach((slide) => {
      slide.removeAttribute("role");
      slide.removeAttribute("aria-roledescription");
      slide.removeAttribute("aria-label");
      slide.removeAttribute("aria-hidden");
      slide.removeAttribute("aria-selected");
      slide.removeAttribute("tabindex");
      slide.removeAttribute("data-gsap-slider-item-status");
    });

    controls.forEach((button) => {
      button.disabled = false;
      button.removeAttribute("role");
      button.removeAttribute("aria-label");
      button.removeAttribute("aria-disabled");
      button.removeAttribute("data-gsap-slider-control-status");
    });

    return () => {};
  }

  track.onmouseenter = () => {
    track.setAttribute("data-gsap-slider-list-status", "grab");
  };

  track.onmouseleave = () => {
    track.removeAttribute("data-gsap-slider-list-status");
  };

  let collectionRect = collection.getBoundingClientRect();

  function measureSnapPoints() {
    collectionRect = collection!.getBoundingClientRect();
    return items.map((item) => -item.offsetLeft);
  }

  const viewportWidth = collection.clientWidth;
  const trackWidth = track.scrollWidth;
  const maxScroll = Math.max(trackWidth - viewportWidth, 0);
  const maxX = 0;
  const snapPoints = measureSnapPoints();
  const lastSnap = snapPoints[snapPoints.length - 1] ?? 0;
  const minX = Math.min(-maxScroll, lastSnap);

  let activeIndex = 0;
  let pressStartX = 0;
  let pressStartIndex = 0;
  let lastSampleX = 0;
  let lastSampleTime = 0;
  let releaseVelocity = 0;
  const setX = gsap.quickSetter(track, "x", "px");
  const slideStep =
    snapPoints.length > 1
      ? Math.abs(snapPoints[1] - snapPoints[0])
      : slideWidth;

  function snapToIndex(index: number, duration = 0.4) {
    const target = Math.max(0, Math.min(index, snapPoints.length - 1));
    const targetX = snapPoints[target];

    gsap.to(track, {
      duration,
      ease: "power3.out",
      x: targetX,
      overwrite: true,
      onUpdate: () => {
        updateStatus(Number(gsap.getProperty(track, "x")));
      },
      onComplete: () => {
        setX(targetX);
        updateStatus(targetX);
        sliderRoot._sliderDraggable?.update();
      },
    });
  }

  function resolveReleaseIndex(
    startIndex: number,
    delta: number,
    velocity: number,
  ) {
    const moveThreshold = Math.min(slideStep * 0.08, 36);
    const velocityThreshold = 120;

    if (delta <= -moveThreshold || velocity <= -velocityThreshold) {
      return Math.min(startIndex + 1, snapPoints.length - 1);
    }

    if (delta >= moveThreshold || velocity >= velocityThreshold) {
      return Math.max(startIndex - 1, 0);
    }

    return startIndex;
  }

  function updateStatus(x: number) {
    if (x > maxX || x < minX) {
      return;
    }

    const clampedX = x > maxX ? maxX : x < minX ? minX : x;
    let closest = snapPoints[0];

    snapPoints.forEach((point) => {
      if (Math.abs(point - clampedX) < Math.abs(closest - clampedX)) {
        closest = point;
      }
    });

    activeIndex = snapPoints.indexOf(closest);

    items.forEach((slide, index) => {
      const rect = slide.getBoundingClientRect();
      const leftEdge = rect.left - collectionRect.left;
      const slideCenter = leftEdge + rect.width / 2;
      const inView =
        slideCenter > 0 && slideCenter < collectionRect.width;
      const status =
        index === activeIndex ? "active" : inView ? "inview" : "not-active";

      slide.setAttribute("data-gsap-slider-item-status", status);
      slide.setAttribute(
        "aria-selected",
        index === activeIndex ? "true" : "false",
      );
      slide.setAttribute("aria-hidden", inView ? "false" : "true");
      slide.setAttribute("tabindex", index === activeIndex ? "0" : "-1");
    });

    controls.forEach((button) => {
      const direction = button.getAttribute("data-gsap-slider-control");
      const canMove =
        direction === "prev"
          ? activeIndex > 0
          : activeIndex < snapPoints.length - 1;

      button.disabled = !canMove;
      button.setAttribute("aria-disabled", canMove ? "false" : "true");
      button.setAttribute(
        "data-gsap-slider-control-status",
        canMove ? "active" : "not-active",
      );
    });

    options.onUpdate?.();
  }

  controls.forEach((button) => {
    const direction = button.getAttribute("data-gsap-slider-control");

    const handler = () => {
      if (button.disabled) return;

      const delta = direction === "next" ? 1 : -1;
      const target = activeIndex + delta;

      snapToIndex(target);
    };

    button.addEventListener("click", handler);
    controlListeners.push({ button, handler });
  });

  sliderRoot._sliderDraggable = Draggable.create(track, {
    type: "x",
    inertia: false,
    bounds: { minX, maxX },
    dragResistance: 0,
    edgeResistance: 0.65,
    onPress() {
      pressStartX = this.x;
      pressStartIndex = activeIndex;
      lastSampleX = this.x;
      lastSampleTime = performance.now();
      releaseVelocity = 0;
      track.setAttribute("data-gsap-slider-list-status", "grabbing");
      collectionRect = collection.getBoundingClientRect();
    },
    onDrag() {
      const now = performance.now();
      const elapsed = now - lastSampleTime;

      if (elapsed >= 16) {
        releaseVelocity = ((this.x - lastSampleX) / elapsed) * 1000;
        lastSampleX = this.x;
        lastSampleTime = now;
      }

      setX(this.x);
      updateStatus(this.x);
    },
    onRelease() {
      const delta = this.x - pressStartX;
      const targetIndex = resolveReleaseIndex(
        pressStartIndex,
        delta,
        releaseVelocity,
      );

      snapToIndex(targetIndex);
      track.setAttribute("data-gsap-slider-list-status", "grab");
    },
  })[0];

  setX(0);
  updateStatus(0);

  return () => {
    controlListeners.forEach(({ button, handler }) => {
      button.removeEventListener("click", handler);
    });

    if (sliderRoot._sliderDraggable) {
      sliderRoot._sliderDraggable.kill();
      sliderRoot._sliderDraggable = undefined;
    }

    gsap.set(track, { clearProps: "x" });
    track.removeAttribute("style");
    track.onmouseenter = null;
    track.onmouseleave = null;
    track.removeAttribute("data-gsap-slider-list-status");

    root.removeAttribute("data-gsap-slider-status");
    root.removeAttribute("role");
    root.removeAttribute("aria-roledescription");
    root.removeAttribute("aria-label");

    collection.removeAttribute("role");
    collection.removeAttribute("aria-roledescription");
    collection.removeAttribute("aria-label");

    items.forEach((slide) => {
      slide.removeAttribute("role");
      slide.removeAttribute("aria-roledescription");
      slide.removeAttribute("aria-label");
      slide.removeAttribute("aria-hidden");
      slide.removeAttribute("aria-selected");
      slide.removeAttribute("tabindex");
      slide.removeAttribute("data-gsap-slider-item-status");
    });

    controls.forEach((button) => {
      button.disabled = false;
      button.removeAttribute("role");
      button.removeAttribute("aria-label");
      button.removeAttribute("aria-disabled");
      button.removeAttribute("data-gsap-slider-control-status");
    });
  };
}

export function debounceOnWidthChange(fn: () => void, ms: number) {
  let lastWidth = window.innerWidth;
  let timer: ReturnType<typeof setTimeout> | undefined;

  return () => {
    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth;
        fn();
      }
    }, ms);
  };
}
