import { type RefObject, useEffect, useRef, useState } from "react";
import { sanitizeSvg } from "./sanitize-svg";

export type InlineSvgState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; svg: SVGSVGElement }
  | { status: "unavailable"; reason: string };

/** Fetches an SVG the manual serves and mounts it as live DOM under `host`,
 * so its own styles read the page's theme tokens and its `data-step` marks
 * can be lit. The drawing's own width rides along as `--svg-width`, for a
 * rule that sizes by it. No `src` is an idle hook, so a caller can hold one
 * unconditionally. */
export function useInlineSvg(src: string | null): {
  host: RefObject<HTMLDivElement | null>;
  state: InlineSvgState;
} {
  const host = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<InlineSvgState>({ status: "idle" });

  useEffect(() => {
    if (src === null) {
      setState({ status: "idle" });
      return;
    }
    setState({ status: "loading" });
    const controller = new AbortController();
    const url = `/${src.replace(/^\/+/, "")}`;

    fetch(url, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`${url} answered ${response.status}`);
        return response.text();
      })
      .then((text) => {
        const svg = sanitizeSvg(text);
        if (!svg) throw new Error(`${url} is not an SVG`);
        const mount = host.current;
        if (!mount) return;
        svg.style.setProperty("--svg-width", String(svg.viewBox.baseVal.width));
        mount.replaceChildren(svg);
        setState({ status: "ready", svg });
      })
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return;
        setState({
          status: "unavailable",
          reason: cause instanceof Error ? cause.message : String(cause),
        });
      });

    return () => controller.abort();
  }, [src]);

  return { host, state };
}
