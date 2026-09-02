import { useLayoutEffect, useRef } from "react";
import {
  formatMoney,
  formatMoneyNumeric,
  formatMoneyPrefix,
} from "../../lib/format-money";
import { RollingDigit } from "./listing-countdown-digit";

type ListingRollingMoneyDisplayProps = {
  amountMinor: number;
  currency: string;
  locale?: string;
};

function ListingRollingMoneyDisplay({
  amountMinor,
  currency,
  locale,
}: ListingRollingMoneyDisplayProps) {
  const prevMinorRef = useRef(amountMinor);
  const shouldAnimate = amountMinor > prevMinorRef.current;
  const prefix = formatMoneyPrefix(currency, { locale });
  const cells = formatMoneyNumeric(amountMinor, currency, locale)
    .split("")
    .map((char, index, all) => ({ char, place: all.length - index }));
  const accessibleText = formatMoney(amountMinor, currency, { locale });

  useLayoutEffect(() => {
    prevMinorRef.current = amountMinor;
  }, [amountMinor]);

  return (
    <span className="countdown-display">
      <span className="sr-only">{accessibleText}</span>
      <span aria-hidden="true" className="inline-flex items-baseline">
        <span>{prefix}</span>
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

export type { ListingRollingMoneyDisplayProps };
export { ListingRollingMoneyDisplay };
