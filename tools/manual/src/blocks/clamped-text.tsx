import { useEffect, useRef, useState } from "react";
import { InlineMarkdown } from "./inline-markdown";

const CLAMP: Record<2 | 3 | 4, string> = {
  2: "line-clamp-2",
  3: "line-clamp-3",
  4: "line-clamp-4",
};

/**
 * Store prose on a card, cut to a few lines and openable in place. The toggle
 * appears only when there is something behind the clamp — measured, because
 * whether four lines run out depends on the column, not on the character count.
 */
export function ClampedText({
  text,
  lines,
  className = "",
}: {
  text: string;
  lines: 2 | 3 | 4;
  className?: string;
}) {
  const body = useRef<HTMLParagraphElement>(null);
  const [open, setOpen] = useState(false);
  const [clipped, setClipped] = useState(false);

  useEffect(() => {
    const element = body.current;
    // Open, nothing is clipped by definition — the answer measured while
    // clamped is the one that keeps the collapse control on screen.
    if (!element || open) return;
    const measure = () =>
      setClipped(element.scrollHeight - element.clientHeight > 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [open]);

  return (
    <>
      <p
        className={`max-w-[70ch] text-muted-foreground text-sm leading-snug ${open ? "" : CLAMP[lines]} ${className}`}
        ref={body}
      >
        <InlineMarkdown text={text} />
      </p>
      {clipped ? (
        <button
          aria-expanded={open}
          className="mt-0.5 cursor-pointer text-secondary-foreground text-xs underline decoration-border-strong underline-offset-2 hover:text-foreground"
          onClick={() => setOpen((on) => !on)}
          type="button"
        >
          {open ? "Show less" : "Read more"}
        </button>
      ) : null}
    </>
  );
}
