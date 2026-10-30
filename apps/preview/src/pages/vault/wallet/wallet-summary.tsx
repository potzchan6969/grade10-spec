import { Card } from "@grade10/design-system/components/display/card";
import { Text } from "@grade10/design-system/components/display/text";
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
 * The collector's vault wallet — withdrawal stats over the portfolio. Left:
 * the available balance and the acts on it; right: everything earned, split
 * into what is available, in withdrawal and withdrawn as a stacked bar.
 * Withdraw runs by bank transfer recorded after the money moves. Three
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
      label: "In withdrawal",
      amountHkd: inCashOutUsd,
      swatch: "bg-secondary",
    },
    { label: "Withdrawn", amountHkd: cashedOutUsd, swatch: "bg-foreground" },
  ];

  return (
    <Card
      aria-label="Rewards wallet"
      className={cn(
        "grid grid-cols-1 gap-0 overflow-clip p-0 sm:grid-cols-2",
        className,
      )}
      data-slot="wallet-summary"
      padding={false}
      role="region"
    >
      <div className="flex flex-col gap-4 border-b border-border bg-background-subtle p-4 sm:p-8 sm:border-r sm:border-b-0">
        <Text className="uppercase" size="sm" tone="secondary" weight="medium">
          Incentives available
        </Text>
        <div className="flex flex-1 flex-col items-start justify-center gap-2">
          <p className="flex items-baseline gap-1 whitespace-nowrap text-foreground tabular-nums">
            <span className="font-sans text-2xl leading-8 font-semibold sm:text-3xl sm:leading-9">
              US$
            </span>
            <span className="font-sans text-5xl leading-13 font-medium sm:text-6xl sm:leading-15">
              {availableUsd.toLocaleString("en-HK")}
            </span>
          </p>
          <Text size="sm" tone="secondary">
            Receive ~US${dailyIncentiveUsd.toLocaleString("en-HK")} daily while
            your items are in vault.
          </Text>
        </div>
        <div className="flex items-center gap-2">
          {hasPayoutMethod ? (
            <Button
              disabled={!meetsMinimum}
              size="md"
              type="button"
              onClick={onCashOut}
            >
              Withdraw
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

      <div className="flex flex-col gap-4 p-4 sm:-ml-px sm:p-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between whitespace-nowrap">
            <Text
              className="uppercase"
              size="sm"
              tone="secondary"
              weight="medium"
            >
              Earned all time
            </Text>
            <p className="font-sans text-xl leading-7 font-semibold tabular-nums text-foreground">
              {formatUsd(earnedAllTimeUsd)}
            </p>
          </div>
          <div
            aria-label={`Available ${formatUsd(availableUsd)}, in withdrawal ${formatUsd(inCashOutUsd)}, withdrawn ${formatUsd(cashedOutUsd)}`}
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
                <Text as="span" className="whitespace-nowrap">
                  {segment.label}
                </Text>
                {segment.label === "In withdrawal" && openCashOutCount > 0 ? (
                  <Link render={<button type="button" onClick={onViewCashOuts} />} variant="secondary">
                    {openCashOutCount}{" "}
                    {openCashOutCount === 1 ? "request" : "requests"}
                  </Link>
                ) : null}
              </span>
              <Text
                as="span"
                className="flex items-center gap-1 whitespace-nowrap tabular-nums"
                weight="medium"
              >
                {segment.label === "Available" && hasPayoutMethod && !meetsMinimum ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger
                        aria-label={`Minimum ${formatUsd(minWithdrawalUsd)} to withdraw`}
                        className="inline-flex size-4 items-center justify-center text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                        render={<button type="button" />}
                      >
                        <Info aria-hidden size={16} weight="bold" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Minimum {formatUsd(minWithdrawalUsd)} to withdraw
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : null}
                {formatUsd(segment.amountHkd)}
              </Text>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

export { WalletSummary };
