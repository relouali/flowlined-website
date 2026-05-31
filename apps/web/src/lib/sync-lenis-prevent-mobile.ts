const MOBILE_CAROUSEL_MQ = "(max-width: 639px)";

export { MOBILE_CAROUSEL_MQ };

export function syncLenisPreventMobile(element: HTMLElement) {
  const mq = window.matchMedia(MOBILE_CAROUSEL_MQ);

  const sync = () => {
    if (mq.matches) {
      element.setAttribute("data-lenis-prevent", "");
    } else {
      element.removeAttribute("data-lenis-prevent");
    }
  };

  sync();
  mq.addEventListener("change", sync);

  return () => {
    mq.removeEventListener("change", sync);
    element.removeAttribute("data-lenis-prevent");
  };
}
