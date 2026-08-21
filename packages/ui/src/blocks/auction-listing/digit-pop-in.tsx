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

  const glyphs = chars.map((ch, index) => ({
    ch,
    id: `${index}-${ch}`,
    stagger: index === last - 1 ? "1" : index === last ? "2" : undefined,
  }));

  return (
    <span ref={groupRef} className="t-digit-group">
      <span className="sr-only">{text}</span>
      {glyphs.map((glyph) => (
        <span
          aria-hidden="true"
          className="t-digit"
          data-stagger={glyph.stagger}
          key={glyph.id}
        >
          {glyph.ch}
        </span>
      ))}
    </span>
  );
}

/** Split a string through DigitPopIn; leave other nodes alone. */
function popInValue(value: ReactNode): ReactNode {
  return typeof value === "string" ? <DigitPopIn text={value} /> : value;
}

export { DigitPopIn, popInValue };
