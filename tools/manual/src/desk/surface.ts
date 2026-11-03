import { useCallback, useState } from "react";
import { SURFACES, type Surface } from "../api/desk.ts";
import { browserKeyStore } from "../editor/config.ts";

const KEY = "manual.desk.surface";

/** Mobile first on a phone, Web on a computer, until the tester picks. */
export function defaultSurface(): Surface {
  try {
    return window.matchMedia("(pointer: coarse) and (max-width: 48rem)").matches
      ? "mobile"
      : "web";
  } catch {
    return "web";
  }
}

export function readSurface(): Surface {
  const stored = browserKeyStore.get(KEY);
  return SURFACES.includes(stored as Surface)
    ? (stored as Surface)
    : defaultSurface();
}

/** The surface this device marks, chosen once and kept on it. */
export function useSurface(): [Surface, (next: Surface) => void] {
  const [surface, setSurface] = useState<Surface>(readSurface);
  const choose = useCallback((next: Surface) => {
    browserKeyStore.set(KEY, next);
    setSurface(next);
  }, []);
  return [surface, choose];
}
