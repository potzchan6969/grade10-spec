/// <reference path="./digit-pop-in.css.d.ts" />
import { useLayoutEffect, useRef } from "react";

import type { ReactNode } from "react";

import "./digit-pop-in.css";

/**
 * Number pop-in: each character re-enters with blur when `text` changes.
 * First paint is static so a listing does not bounce on load.
 */
function DigitPopIn({ text }: { text: string }) {
  const groupRef = useRef<HTMLSpanElement>(null);
  const previous = useRef<string | null>(null);
  const chars = [...text];
  const last = chars.length - 1;

  useLayoutEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    const isRefresh = previous.current !== null && previous.current !== text;
    previous.current = text;
    if (!isRefresh) return;
    group.classList.remove("is-animating");
    void group.offsetHeight;
    group.classList.add("is-animating");
  }, [text]);

  return (
    <span ref={groupRef} className="t-digit-group">
      <span className="sr-only">{text}</span>
      {chars.map((ch, i) => {
        const stagger =
          i === last - 1 ? "1" : i === last ? "2" : undefined;
        return (
          <span
            aria-hidden="true"
            className="t-digit"
            data-stagger={stagger}
            key={`${i}-${ch}`}
          >
            {ch}
          </span>
        );
      })}
    </span>
  );
}

/** Split a string through DigitPopIn; leave other nodes alone. */
function popInValue(value: ReactNode): ReactNode {
  return typeof value === "string" ? <DigitPopIn text={value} /> : value;
}

export { DigitPopIn, popInValue };
