"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LocomotiveScroll from "locomotive-scroll";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type LocomotiveScrollContextValue = {
  locomotiveScroll: LocomotiveScroll | null;
};

const LocomotiveScrollContext = createContext<LocomotiveScrollContextValue>({
  locomotiveScroll: null,
});

export function useLocomotiveScroll() {
  return useContext(LocomotiveScrollContext);
}

export default function LocomotiveScrollProvider({ children }: { children: ReactNode }) {
  const [locomotiveScroll, setLocomotiveScroll] = useState<LocomotiveScroll | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const instance = new LocomotiveScroll({
      lenisOptions: {
        lerp: 0.1,
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      },
      initCustomTicker: (render) => {
        gsap.ticker.add(render);
      },
      destroyCustomTicker: (render) => {
        gsap.ticker.remove(render);
      },
      scrollCallback: () => {
        ScrollTrigger.update();
      },
    });

    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length && value !== undefined) {
          instance.scrollTo(value, { immediate: true });
        }
        return instance.lenisInstance?.scroll ?? 0;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    const onRefresh = () => {
      instance.resize();
    };

    ScrollTrigger.addEventListener("refresh", onRefresh);
    ScrollTrigger.refresh();

    setLocomotiveScroll(instance);

    return () => {
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      ScrollTrigger.scrollerProxy(document.body, {});
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      instance.destroy();
      setLocomotiveScroll(null);
    };
  }, []);

  return (
    <LocomotiveScrollContext.Provider value={{ locomotiveScroll }}>
      {children}
    </LocomotiveScrollContext.Provider>
  );
}
