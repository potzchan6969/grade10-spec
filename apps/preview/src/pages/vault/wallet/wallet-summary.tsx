import { Card } from "@grade10/design-system/components/display/card";
import { Button } from "@grade10/design-system/components/forms/button";
import { Link } from "@grade10/design-system/components/forms/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@grade10/design-system/components/overlays/tooltip";
import { Info } from "@phosphor-icons/react";
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
  onViewCashOuts,
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
  onViewCashOuts?: () => void;
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
    <Card
      aria-label="Rewards wallet"
      className={cn(
        "grid grid-cols-1 overflow-clip p-0 sm:grid-cols-2",
        className,
      )}
      data-slot="wallet-summary"
      padding={false}
      role="region"
    >
      <div className="flex flex-col gap-4 border-b border-border bg-background-subtle p-8 sm:border-r sm:border-b-0">
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
              Cash Out
            </Button>
          ) : (
            <Button
              size="md"
              type="button"
              variant="secondary"
              onClick={onSetUpPayout}
            >
              Set Up Payout
            </Button>
          )}
          <Button
            size="md"
            type="button"
            variant="outline"
            onClick={onViewActivity}
          >
            View Activity
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-8">
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
                  <Link variant="secondary" onClick={onViewCashOuts}>
                    {openCashOutCount}{" "}
                    {openCashOutCount === 1 ? "request" : "requests"}
                  </Link>
                ) : null}
              </span>
              <span className="flex items-center gap-1 font-sans text-base leading-6 font-medium whitespace-nowrap tabular-nums text-foreground">
                {segment.label === "Available" && hasPayoutMethod && !meetsMinimum ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger
                        aria-label={`Minimum ${formatUsd(minWithdrawalUsd)} to cash out`}
                        className="inline-flex size-4 items-center justify-center text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                        render={<button type="button" />}
                      >
                        <Info aria-hidden size={16} weight="bold" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Minimum {formatUsd(minWithdrawalUsd)} to cash out
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : null}
                {formatUsd(segment.amountHkd)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

export { WalletSummary };
