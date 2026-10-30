import { Card } from "@grade10/design-system/components/display/card";
import { Button } from "@grade10/design-system/components/forms/button";
import { cn } from "@grade10/design-system/lib/utils";
import { formatHkd } from "../../vault-content";

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
  dailyIncentiveHkd,
  availableHkd,
  earnedAllTimeHkd,
  inCashOutHkd,
  cashedOutHkd,
  openCashOutCount,
  minWithdrawalHkd,
  hasPayoutMethod,
  onCashOut,
  onViewActivity,
  onSetUpPayout,
  className,
}: {
  dailyIncentiveHkd: number;
  availableHkd: number;
  earnedAllTimeHkd: number;
  inCashOutHkd: number;
  cashedOutHkd: number;
  openCashOutCount: number;
  minWithdrawalHkd: number;
  hasPayoutMethod: boolean;
  onCashOut?: () => void;
  onViewActivity?: () => void;
  onSetUpPayout?: () => void;
  className?: string;
}) {
  const meetsMinimum = availableHkd >= minWithdrawalHkd;

  const SEGMENTS = [
    { label: "Available", amountHkd: availableHkd, swatch: "bg-accent-foreground" },
    { label: "In cash-out", amountHkd: inCashOutHkd, swatch: "bg-muted" },
    { label: "Cashed out", amountHkd: cashedOutHkd, swatch: "bg-foreground" },
  ];
  const total = Math.max(earnedAllTimeHkd, 1);

  return (
    <div
      aria-label="Rewards wallet"
      className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2", className)}
      data-slot="wallet-summary"
      role="region"
    >
      <Card className="flex flex-col gap-2 p-6 sm:p-8">
        <p className="font-heading text-sm leading-5 font-medium tracking-wider uppercase text-secondary-foreground">
          Incentives available
        </p>
        <p className="font-heading font-medium tracking-tight tabular-nums text-card-foreground">
          <span className="flex flex-wrap items-baseline gap-1">
            <span className="text-lg leading-7">HK$</span>
            <span className="text-4xl leading-10 sm:text-5xl sm:leading-12">
              {availableHkd.toLocaleString("en-HK")}
            </span>
          </span>
        </p>
        <p className="text-xs leading-4 text-pretty text-secondary-foreground">
          Receive ~{formatHkd(dailyIncentiveHkd)} daily while your items are
          in vault.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {hasPayoutMethod ? (
            <Button
              disabled={!meetsMinimum}
              size="sm"
              type="button"
              onClick={onCashOut}
            >
              Cash out
            </Button>
          ) : (
            <Button
              size="sm"
              type="button"
              variant="secondary"
              onClick={onSetUpPayout}
            >
              Set up payout
            </Button>
          )}
          <Button
            size="sm"
            type="button"
            variant="outline"
            onClick={onViewActivity}
          >
            View activity
          </Button>
        </div>
        {hasPayoutMethod && !meetsMinimum ? (
          <p className="text-xs text-secondary-foreground">
            Minimum {formatHkd(minWithdrawalHkd)} to cash out
          </p>
        ) : null}
      </Card>

      <Card className="flex flex-col gap-4 p-6 sm:p-8">
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-heading text-sm leading-5 font-medium tracking-wider uppercase text-secondary-foreground">
            Earned all time
          </p>
          <p className="font-heading text-xl font-medium tracking-tight tabular-nums text-card-foreground">
            {formatHkd(earnedAllTimeHkd)}
          </p>
        </div>
        <div
          aria-label={`Available ${formatHkd(availableHkd)}, in cash-out ${formatHkd(inCashOutHkd)}, cashed out ${formatHkd(cashedOutHkd)}`}
          className="flex h-2 w-full gap-px overflow-hidden rounded-(--radius-full)"
          role="img"
        >
          {SEGMENTS.map((segment) => (
            <span
              aria-hidden
              className={segment.swatch}
              key={segment.label}
              style={{ width: `${(segment.amountHkd / total) * 100}%` }}
            />
          ))}
        </div>
        <ul className="flex flex-col divide-y divide-border">
          {SEGMENTS.map((segment) => (
            <li
              className="flex items-baseline justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
              key={segment.label}
            >
              <span className="flex items-center gap-2 text-sm text-secondary-foreground">
                <span
                  aria-hidden
                  className={cn("size-2.5 rounded-(--radius-xs)", segment.swatch)}
                />
                {segment.label}
                {segment.label === "In cash-out" && openCashOutCount > 0 ? (
                  <span className="text-xs text-secondary-foreground">
                    {" "}
                    {openCashOutCount}{" "}
                    {openCashOutCount === 1 ? "request" : "requests"}
                  </span>
                ) : null}
              </span>
              <span className="text-sm font-medium tabular-nums text-card-foreground">
                {formatHkd(segment.amountHkd)}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

export { WalletSummary };
