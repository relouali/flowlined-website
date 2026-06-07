import gsap from "gsap";
import Draggable from "gsap/Draggable";

gsap.registerPlugin(Draggable);

type HorizontalLoopConfig = {
  repeat?: number;
  paused?: boolean;
  speed?: number;
  snap?: number | false;
  paddingRight?: number;
  reversed?: boolean;
  center?: boolean | Element;
  draggable?: boolean;
  onChange?: (element: Element, index: number) => void;
};

type HorizontalLoopTimeline = gsap.core.Timeline & {
  toIndex: (index: number, vars?: gsap.TweenVars) => gsap.core.Tween | void;
  closestIndex: (setCurrent?: boolean) => number;
  current: () => number;
  next: (vars?: gsap.TweenVars) => gsap.core.Tween | void;
  previous: (vars?: gsap.TweenVars) => gsap.core.Tween | void;
  times: number[];
  draggable?: Draggable;
};

// GSAP seamless horizontal loop helper (Osmo centered slider).
export function horizontalLoop(
  items: Element[],
  config: HorizontalLoopConfig = {},
): HorizontalLoopTimeline {
  const timeline = gsap.timeline({
    repeat: config.repeat,
    paused: config.paused,
    defaults: { ease: "none" },
    onReverseComplete: () => {
      timeline.totalTime(timeline.rawTime() + timeline.duration() * 100);
    },
  }) as HorizontalLoopTimeline;

  if (items.length === 0) return timeline;

  let onChange = config.onChange;
  let lastIndex = 0;
  let length = items.length;
  let startX = (items[0] as HTMLElement).offsetLeft;
  const times: number[] = [];
  const widths: number[] = [];
  const spaceBefore: number[] = [];
  const xPercents: number[] = [];
  let curIndex = 0;
  let indexIsDirty = false;
  const center = config.center;
  const pixelsPerSecond = (config.speed || 1) * 100;
  const snap =
    config.snap === false
      ? (value: number) => value
      : gsap.utils.snap(config.snap || 1);
  let timeOffset = 0;
  const container =
    center === true
      ? items[0].parentNode
      : gsap.utils.toArray(center as Element)[0] || items[0].parentNode;

  if (!container) return timeline;

  let totalWidth = 0;
  const getTotalWidth = () =>
    (items[length - 1] as HTMLElement).offsetLeft +
    (xPercents[length - 1] / 100) * widths[length - 1] -
    startX +
    spaceBefore[0] +
    (items[length - 1] as HTMLElement).offsetWidth *
      Number(gsap.getProperty(items[length - 1], "scaleX")) +
    (Number.parseFloat(String(config.paddingRight)) || 0);

  const populateWidths = () => {
    const containerEl = container as HTMLElement;
    let b1 = containerEl.getBoundingClientRect();
    let b2: DOMRect;

    items.forEach((el, i) => {
      const htmlEl = el as HTMLElement;
      widths[i] = Number.parseFloat(gsap.getProperty(htmlEl, "width", "px") as string);
      xPercents[i] = snap(
        (Number.parseFloat(gsap.getProperty(htmlEl, "x", "px") as string) /
          widths[i]) *
          100 +
          Number(gsap.getProperty(htmlEl, "xPercent")),
      );
      b2 = htmlEl.getBoundingClientRect();
      spaceBefore[i] = b2.left - (i ? b1.right : b1.left);
      b1 = b2;
    });

    gsap.set(items, {
      xPercent: (i) => xPercents[i as number],
    });
    totalWidth = getTotalWidth();
  };

  let timeWrap: (value: number) => number;
  const populateOffsets = () => {
    const containerEl = container as HTMLElement;
    timeOffset = center
      ? timeline.duration() * (containerEl.offsetWidth / 2) / totalWidth
      : 0;

    if (center) {
      times.forEach((t, i) => {
        times[i] = timeWrap(
          Number(timeline.labels[`label${i}`]) +
            (timeline.duration() * widths[i]) / 2 / totalWidth -
            timeOffset,
        );
      });
    }
  };

  const getClosest = (values: number[], value: number, wrap: number) => {
    let i = values.length;
    let closest = 1e10;
    let index = 0;

    while (i--) {
      let d = Math.abs(values[i] - value);
      if (d > wrap / 2) d = wrap - d;
      if (d < closest) {
        closest = d;
        index = i;
      }
    }

    return index;
  };

  const populateTimeline = () => {
    timeline.clear();

    for (let i = 0; i < length; i++) {
      const item = items[i] as HTMLElement;
      const curX = (xPercents[i] / 100) * widths[i];
      const distanceToStart = item.offsetLeft + curX - startX + spaceBefore[0];
      const distanceToLoop =
        distanceToStart + widths[i] * Number(gsap.getProperty(item, "scaleX"));

      timeline
        .to(
          item,
          {
            xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
            duration: distanceToLoop / pixelsPerSecond,
          },
          0,
        )
        .fromTo(
          item,
          {
            xPercent: snap(
              ((curX - distanceToLoop + totalWidth) / widths[i]) * 100,
            ),
          },
          {
            xPercent: xPercents[i],
            duration:
              (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
            immediateRender: false,
          },
          distanceToLoop / pixelsPerSecond,
        )
        .add("label" + i, distanceToStart / pixelsPerSecond);

      times[i] = distanceToStart / pixelsPerSecond;
    }

    timeWrap = gsap.utils.wrap(0, timeline.duration());
  };

  const refresh = (deep?: boolean) => {
    const progress = timeline.progress();
    timeline.progress(0, true);
    populateWidths();
    if (deep) populateTimeline();
    populateOffsets();
    if (deep && timeline.draggable) {
      timeline.time(times[curIndex], true);
    } else {
      timeline.progress(progress, true);
    }
  };

  const onResize = () => refresh(true);

  const notifyChange = (index: number) => {
    if (lastIndex !== index) {
      lastIndex = index;
      onChange?.(items[index], index);
    }
  };

  const toIndex = (index: number, vars: gsap.TweenVars = {}) => {
    if (Math.abs(index - curIndex) > length / 2) {
      index += index > curIndex ? -length : length;
    }

    const newIndex = gsap.utils.wrap(0, length, index);
    let time = times[newIndex];

    if ((time > timeline.time()) !== (index > curIndex) && index !== curIndex) {
      time += timeline.duration() * (index > curIndex ? 1 : -1);
    }

    if (time < 0 || time > timeline.duration()) {
      vars.modifiers = { time: timeWrap };
    }

    curIndex = newIndex;
    vars.overwrite = true;
    gsap.killTweensOf(proxy);

    if (vars.duration === 0) {
      timeline.time(timeWrap(time));
      notifyChange(newIndex);
      return;
    }

    const { onComplete, ...tweenVars } = vars;

    return timeline.tweenTo(time, {
      ...tweenVars,
      onComplete: () => {
        notifyChange(newIndex);
        if (typeof onComplete === "function") {
          onComplete();
        }
      },
    });
  };

  timeline.toIndex = (index, vars) => toIndex(index, vars);
  timeline.closestIndex = (setCurrent) => {
    const index = getClosest(times, timeline.time(), timeline.duration());
    if (setCurrent) {
      curIndex = index;
      indexIsDirty = false;
    }
    return index;
  };
  timeline.current = () => (indexIsDirty ? timeline.closestIndex(true) : curIndex);
  timeline.next = (vars) => toIndex(timeline.current() + 1, vars);
  timeline.previous = (vars) => toIndex(timeline.current() - 1, vars);
  timeline.times = times;

  gsap.set(items, { x: 0 });
  populateWidths();
  populateTimeline();
  populateOffsets();
  window.addEventListener("resize", onResize);

  timeline.progress(1, true).progress(0, true);

  if (config.reversed) {
    timeline.reverse();
  }

  let proxy: HTMLDivElement | undefined;

  if (config.draggable) {
    proxy = document.createElement("div");
    const wrap = gsap.utils.wrap(0, 1);
    let ratio = 0;
    let startProgress = 0;
    let draggable: Draggable;
    let lastSnap = 0;
    let initChangeX = 0;
    let wasPlaying = false;

    const align = () =>
      timeline.progress(
        wrap(startProgress + (draggable.startX - draggable.x) * ratio),
      );
    const syncIndex = () => timeline.closestIndex(true);

    draggable = Draggable.create(proxy, {
      trigger: (items[0].parentNode as Element) || undefined,
      type: "x",
      inertia: false,
      onPressInit() {
        const x = this.x;
        gsap.killTweensOf(timeline);
        wasPlaying = !timeline.paused();
        timeline.pause();
        startProgress = timeline.progress();
        refresh();
        ratio = 1 / totalWidth;
        initChangeX = startProgress / -ratio - x;
        gsap.set(proxy, { x: startProgress / -ratio });
      },
      onDrag: align,
      onRelease() {
        syncIndex();
        timeline.toIndex(timeline.current(), {
          duration: 0.5,
          ease: "power3.inOut",
        });
        if (wasPlaying) timeline.play();
      },
    })[0];

    timeline.draggable = draggable;
  }

  timeline.closestIndex(true);
  notifyChange(curIndex);

  const originalKill = timeline.kill.bind(timeline);
  timeline.kill = (...args) => {
    window.removeEventListener("resize", onResize);
    timeline.draggable?.kill();
    return originalKill(...args);
  };

  return timeline;
}
