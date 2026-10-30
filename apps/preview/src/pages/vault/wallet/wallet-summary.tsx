import { Card } from "@grade10/design-system/components/display/card";
import { Button } from "@grade10/design-system/components/forms/button";
import { Link } from "@grade10/design-system/components/forms/link";
import { cn } from "@grade10/design-system/lib/utils";
import { formatHkd, formatUsd } from "../../vault-content";

/**
 * The collector's vault wallet — cash-out stats over the portfolio. Left:
 * the available balance and the acts on it; right: everything earned, split
 * into what is available, in cash-out and cashed out as a stacked bar.
 * Cash out runs by bank transfer recorded after the money moves. Three
 * states: ready (balance at or over the minimum), below the minimum
 * (disabled CTA with the floor named), and no payout method yet (set-up
 * CTA first).
 */
function WalletSummary({
  dailyIncentiveUsd,
  availableUsd,
  earnedAllTimeUsd,
  inCashOutUsd,
  cashedOutUsd,
  openCashOutCount,
  minWithdrawalUsd,
  hasPayoutMethod,
  onCashOut,
  onViewActivity,
  onSetUpPayout,
  className,
}: {
  dailyIncentiveUsd: number;
  availableUsd: number;
  earnedAllTimeUsd: number;
  inCashOutUsd: number;
  cashedOutUsd: number;
  openCashOutCount: number;
  minWithdrawalUsd: number;
  hasPayoutMethod: boolean;
  onCashOut?: () => void;
  onViewActivity?: () => void;
  onSetUpPayout?: () => void;
  className?: string;
}) {
  const meetsMinimum = availableUsd >= minWithdrawalUsd;

  const SEGMENTS = [
    { label: "Available", amountHkd: availableUsd, swatch: "bg-primary" },
    {
      label: "In cash-out",
      amountHkd: inCashOutUsd,
      swatch: "bg-secondary",
    },
    { label: "Cashed out", amountHkd: cashedOutUsd, swatch: "bg-foreground" },
  ];

  return (
    <div
      aria-label="Rewards wallet"
      className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2", className)}
      data-slot="wallet-summary"
      role="region"
    >
      <Card className="flex flex-col gap-4 bg-background-subtle p-8">
        <p className="font-sans text-sm leading-5 font-medium uppercase text-secondary-foreground">
          Incentives available
        </p>
        <div className="flex flex-1 flex-col items-start justify-center gap-2">
          <p className="flex items-baseline gap-1 whitespace-nowrap text-foreground tabular-nums">
            <span className="font-sans text-3xl leading-9 font-semibold">
              US$
            </span>
            <span className="font-sans text-6xl leading-15 font-medium">
              {availableUsd.toLocaleString("en-HK")}
            </span>
          </p>
          <p className="font-sans text-sm leading-5 text-pretty text-secondary-foreground">
            Receive ~US${dailyIncentiveUsd.toLocaleString("en-HK")} daily while
            your items are in vault.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasPayoutMethod ? (
            <Button
              disabled={!meetsMinimum}
              size="md"
              type="button"
              onClick={onCashOut}
            >
              Cash out
            </Button>
          ) : (
            <Button
              size="md"
              type="button"
              variant="secondary"
              onClick={onSetUpPayout}
            >
              Set up payout
            </Button>
          )}
          <Button
            size="md"
            type="button"
            variant="outline"
            onClick={onViewActivity}
          >
            View activity
          </Button>
        </div>
        {hasPayoutMethod && !meetsMinimum ? (
          <p className="font-sans text-sm leading-5 text-secondary-foreground">
            Minimum {formatUsd(minWithdrawalUsd)} to cash out
          </p>
        ) : null}
      </Card>

      <Card className="flex flex-col gap-4 p-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between whitespace-nowrap">
            <p className="font-sans text-sm leading-5 font-medium uppercase text-secondary-foreground">
              Earned all time
            </p>
            <p className="font-sans text-xl leading-7 font-semibold tabular-nums text-foreground">
              {formatUsd(earnedAllTimeUsd)}
            </p>
          </div>
          <div
            aria-label={`Available ${formatUsd(availableUsd)}, in cash-out ${formatUsd(inCashOutUsd)}, cashed out ${formatUsd(cashedOutUsd)}`}
            className="grid h-2.5 w-full gap-1 overflow-clip rounded-(--radius-full)"
            role="img"
            style={{
              gridTemplateColumns: `${availableUsd}fr ${inCashOutUsd}fr ${cashedOutUsd}fr`,
            }}
          >
            {SEGMENTS.map((segment) => (
              <span
                aria-hidden
                className={cn("rounded-(--radius-xs)", segment.swatch)}
                key={segment.label}
              />
            ))}
          </div>
        </div>
        <ul className="flex flex-col">
          {SEGMENTS.map((segment, index) => (
            <li
              className={cn(
                "flex items-center justify-between pt-3",
                index < SEGMENTS.length - 1 && "border-b border-border pb-3",
              )}
              key={segment.label}
            >
              <span className="flex items-center gap-2">
                <span
                  aria-hidden
                  className={cn("size-2.5 rounded-(--radius-xs)", segment.swatch)}
                />
                <span className="font-sans text-base leading-6 whitespace-nowrap text-foreground">
                  {segment.label}
                </span>
                {segment.label === "In cash-out" && openCashOutCount > 0 ? (
                  <Link variant="secondary">
                    {openCashOutCount}{" "}
                    {openCashOutCount === 1 ? "request" : "requests"}
                  </Link>
                ) : null}
              </span>
              <span className="font-sans text-base leading-6 font-medium whitespace-nowrap tabular-nums text-foreground">
                {formatUsd(segment.amountHkd)}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

export { WalletSummary };
