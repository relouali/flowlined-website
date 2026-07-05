export type LottieColorPair = {
  /** Main stroke / gradient start — matches the section title ink. */
  primary: string;
  /** Gradient end — same hue as primary, composited on white like title muted text. */
  secondary: string;
};

const ORIGINAL_PRIMARY = [0.070588238537, 0.074509806931, 0.192156866193];
const ORIGINAL_CONTROL_PRIMARY = [0, 0.102, 0.137];
const ORIGINAL_SECONDARY = [0.031372550875, 0.658823549747, 0.541176497936];
const ORIGINAL_CONTROL_SECONDARY = [0.804, 0.875, 0.929];

function parseHex(hex: string): [number, number, number] {
  const normalized = hex.replace("#", "");
  return [
    parseInt(normalized.slice(0, 2), 16) / 255,
    parseInt(normalized.slice(2, 4), 16) / 255,
    parseInt(normalized.slice(4, 6), 16) / 255,
  ];
}

/** Title muted text uses ink at reduced opacity on a white panel. */
export function inkMutedOnWhite(hex: string, opacity: number): string {
  const [r, g, b] = parseHex(hex);
  const toByte = (channel: number) =>
    Math.round((1 - opacity) * 255 + opacity * channel * 255);

  const rr = toByte(r).toString(16).padStart(2, "0");
  const gg = toByte(g).toString(16).padStart(2, "0");
  const bb = toByte(b).toString(16).padStart(2, "0");
  return `#${rr}${gg}${bb}`;
}

function toLottieRgba(hex: string, alpha = 1): [number, number, number, number] {
  const [r, g, b] = parseHex(hex);
  return [r, g, b, alpha];
}

function colorsMatch(a: number[], b: readonly number[], tolerance = 0.02) {
  return (
    a.length >= 3 &&
    Math.abs(a[0] - b[0]) < tolerance &&
    Math.abs(a[1] - b[1]) < tolerance &&
    Math.abs(a[2] - b[2]) < tolerance
  );
}

function replaceKnownColor(
  color: number[],
  primary: [number, number, number, number],
  secondary: [number, number, number, number],
) {
  if (colorsMatch(color, ORIGINAL_PRIMARY) || colorsMatch(color, ORIGINAL_CONTROL_PRIMARY)) {
    return [...primary];
  }

  if (
    colorsMatch(color, ORIGINAL_SECONDARY) ||
    colorsMatch(color, ORIGINAL_CONTROL_SECONDARY)
  ) {
    return [...secondary];
  }

  return color;
}

function walk(node: unknown, primary: [number, number, number, number], secondary: [number, number, number, number]) {
  if (!node || typeof node !== "object") return;

  if (Array.isArray(node)) {
    node.forEach((item) => walk(item, primary, secondary));
    return;
  }

  const record = node as Record<string, unknown>;

  if (record.nm === "primary" || record.nm === "secondary") {
    const effects = record.ef;
    if (Array.isArray(effects) && effects[0] && typeof effects[0] === "object") {
      const colorEffect = effects[0] as { v?: { k?: number[] } };
      if (Array.isArray(colorEffect.v?.k)) {
        colorEffect.v.k =
          record.nm === "primary" ? [...primary] : [...secondary];
      }
    }
  }

  if (
    record.c &&
    typeof record.c === "object" &&
    record.c !== null &&
    "k" in record.c &&
    Array.isArray((record.c as { k: number[] }).k)
  ) {
    const colorProp = record.c as { k: number[] };
    colorProp.k = replaceKnownColor(colorProp.k, primary, secondary);
  }

  Object.values(record).forEach((value) => walk(value, primary, secondary));
}

export function remapLottieColors<T extends object>(
  animationData: T,
  colors: LottieColorPair,
): T {
  const primary = toLottieRgba(colors.primary);
  const secondary = toLottieRgba(colors.secondary);
  const clone = structuredClone(animationData);
  walk(clone, primary, secondary);
  return clone;
}

/** Problem section icons — light-blue accent → white gradient, echoing the
    section gradient hues while staying visible on the dark background. */
export const PROBLEM_SECTION_LOTTIE_COLORS: LottieColorPair = {
  primary: "#cddfed",
  secondary: "#ffffff",
};
