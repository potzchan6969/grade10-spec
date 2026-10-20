import { cn } from "@grade10/design-system/lib/utils";
import { useReducedMotion } from "motion/react";
import { type ReactNode, useEffect, useRef, useState } from "react";

// The same enter reveal the About page uses: a 400ms rise-and-focus that
// reduced-motion visitors skip entirely. Below the fold the same transition
// fires when the section scrolls into view instead of on mount.
const REVEAL =
  "translate-y-3 opacity-0 blur-[3px] transition-[opacity,transform,filter] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:filter-none motion-reduce:transition-none";
const REVEALED = "translate-y-0 opacity-100 filter-none";

/**
 * A block that reveals on first intersection with the viewport. Reduced
 * motion renders it already revealed.
 */
function Reveal({
  children,
  className,
  delayMs = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  as?: "div" | "section" | "li";
}) {
  const reduceMotion = useReducedMotion();
  const [revealed, setRevealed] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || revealed || reduceMotion) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [revealed, reduceMotion]);

  const isRevealed = revealed || Boolean(reduceMotion);
  return (
    <Tag
      className={cn(REVEAL, isRevealed && REVEALED, className)}
      ref={ref as never}
      style={{ transitionDelay: isRevealed ? `${delayMs}ms` : "0ms" }}
    >
      {children}
    </Tag>
  );
}

export { REVEAL, REVEALED, Reveal };
