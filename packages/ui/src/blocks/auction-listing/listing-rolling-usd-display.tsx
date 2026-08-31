import { useLayoutEffect, useRef } from "react";
import { formatUsd, formatUsdNumeric } from "./format-usd";
import { RollingDigit } from "./listing-countdown-digit";

type ListingRollingUsdDisplayProps = {
  amountMinor: number;
};

function ListingRollingUsdDisplay({
  amountMinor,
}: ListingRollingUsdDisplayProps) {
  const prevMinorRef = useRef(amountMinor);
  const shouldAnimate = amountMinor > prevMinorRef.current;
  const cells = formatUsdNumeric(amountMinor)
    .split("")
    .map((char, index, all) => ({ char, place: all.length - index }));
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
          {cells.map(({ char, place }) =>
            /\d/.test(char) ? (
              <RollingDigit animate={shouldAnimate} digit={char} key={place} />
            ) : (
              <span className="inline-block" key={place}>
                {char}
              </span>
            ),
          )}
        </span>
      </span>
    </span>
  );
}

export type { ListingRollingUsdDisplayProps };
export { ListingRollingUsdDisplay };
