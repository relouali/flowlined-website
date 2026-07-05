// Single source of truth for triggering the column-wipe page transition.
//
// The navigate implementation is registered by <PageTransitionProvider> once it
// mounts. Links call transitionNavigate() without needing to be React
// descendants of the provider. The registry is parked on `window` so it stays a
// true singleton even if this module is duplicated across client chunks (which
// would otherwise produce two distinct React contexts).

type NavigateFn = (href: string) => void;

type Controller = { navigate: NavigateFn | null };

function getController(): Controller {
  if (typeof window === "undefined") return { navigate: null };
  const w = window as unknown as { __flTransition?: Controller };
  if (!w.__flTransition) w.__flTransition = { navigate: null };
  return w.__flTransition;
}

export function registerTransitionNavigate(fn: NavigateFn | null) {
  getController().navigate = fn;
}

/**
 * Run the page transition for `href`. Returns true when a provider handled it
 * (so the caller should preventDefault), false when no provider is mounted (let
 * the native link navigate normally).
 */
export function transitionNavigate(href: string): boolean {
  if (href === "/") return false;
  const controller = getController();
  if (controller.navigate) {
    controller.navigate(href);
    return true;
  }
  return false;
}
