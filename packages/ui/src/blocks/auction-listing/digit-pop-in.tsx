/// <reference path="./digit-pop-in.css.d.ts" />

import type { ReactNode } from "react";
import { useLayoutEffect, useRef } from "react";

import "./digit-pop-in.css";

/**
 * Number pop-in: each character re-enters with blur when `text` changes.
 * First paint is static so a listing does not bounce on load.
 */
function DigitPopIn({ text }: { text: string }) {
  const groupRef = useRef<HTMLSpanElement>(null);
  const previous = useRef<string | null>(null);
  const digits = digitSlots(text);

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
      {digits.map(({ ch, key, stagger }) => (
        <span
          aria-hidden="true"
          className="t-digit"
          data-stagger={stagger}
          key={key}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}

function digitSlots(text: string) {
  const seen = new Map<string, number>();
  const chars = [...text];
  const last = chars.length - 1;
  return chars.map((ch, position) => {
    const n = (seen.get(ch) ?? 0) + 1;
    seen.set(ch, n);
    const stagger =
      position === last - 1 ? "1" : position === last ? "2" : undefined;
    return { ch, key: `${ch}-${n}`, stagger };
  });
}

/** Split a string through DigitPopIn; leave other nodes alone. */
function popInValue(value: ReactNode): ReactNode {
  return typeof value === "string" ? <DigitPopIn text={value} /> : value;
}

export { DigitPopIn, popInValue };
