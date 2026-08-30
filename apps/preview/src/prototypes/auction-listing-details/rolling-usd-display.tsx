import { useLayoutEffect, useRef } from "react";
import { RollingDigit } from "./digit-pop-in";
import { formatUsd, formatUsdNumeric } from "./format-usd";

type RollingUsdDisplayProps = {
  amountMinor: number;
};

function RollingUsdDisplay({ amountMinor }: RollingUsdDisplayProps) {
  const prevMinorRef = useRef(amountMinor);
  const shouldAnimate = amountMinor > prevMinorRef.current;
  const formatted = formatUsdNumeric(amountMinor);
  const accessibleText = formatUsd(amountMinor);

  useLayoutEffect(() => {
    prevMinorRef.current = amountMinor;
  }, [amountMinor]);

  return (
    <span className="countdown-display">
      <span className="sr-only">{accessibleText}</span>
      <span aria-hidden="true" className="inline-flex items-baseline">
        <span>US$</span>
        <span className="inline-flex items-baseline tabular-nums">
          {formatted.split("").map((char, index) =>
            /\d/.test(char) ? (
              <RollingDigit
                animate={shouldAnimate}
                digit={char}
                key={`d-${index}-${formatted.length}`}
              />
            ) : (
              <span className="inline-block" key={`s-${index}`}>{char}</span>
            ),
          )}
        </span>
      </span>
    </span>
  );
}

export { RollingUsdDisplay };
