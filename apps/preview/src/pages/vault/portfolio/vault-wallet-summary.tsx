import { Card } from "@grade10/design-system/components/display/card";
import { Button } from "@grade10/design-system/components/forms/button";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";
import { formatHkd } from "../../vault-content";

function Stat({
  label,
  hint,
  className,
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-1.5 bg-card p-6 sm:p-8",
        className,
      )}
    >
      <dt className="font-heading text-sm leading-5 font-medium tracking-wider uppercase text-secondary-foreground">
        {label}
      </dt>
      <dd className="font-heading font-medium tracking-tight tabular-nums text-card-foreground">
        {children}
      </dd>
      {hint ? (
        <dd className="text-xs leading-4 text-pretty text-secondary-foreground">
          {hint}
        </dd>
      ) : null}
    </div>
  );
}

/**
 * The collector's vault wallet — rewards accrued on items in custody. Hero
 * figure is the withdrawable balance; payout runs by bank transfer recorded
 * after the money moves, like every other money row. Three states: ready
 * (balance at or over the minimum), below the minimum (disabled CTA with
 * the floor named), and no payout method yet (set-up CTA first). Below `sm`
 * the cells stack in one column.
 */
function VaultWalletSummary({
  rewardsAvailableHkd,
  earnedAllTimeHkd,
  totalEstimateHkd,
  withdrawnHkd,
  minWithdrawalHkd,
  hasPayoutMethod,
  onWithdraw,
  onSetUpPayout,
  className,
}: {
  rewardsAvailableHkd: number;
  earnedAllTimeHkd: number;
  totalEstimateHkd: number;
  withdrawnHkd: number;
  minWithdrawalHkd: number;
  hasPayoutMethod: boolean;
  onWithdraw?: () => void;
  onSetUpPayout?: () => void;
  className?: string;
}) {
  const meetsMinimum = rewardsAvailableHkd >= minWithdrawalHkd;

  return (
    <Card
      aria-label="Vault wallet"
      className={className}
      data-slot="vault-wallet-summary"
      padding={false}
      role="region"
    >
      <dl className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex min-w-0 flex-col gap-1.5 bg-background-subtle p-6 sm:p-8">
          <dt className="font-heading text-sm leading-5 font-medium tracking-wider uppercase text-secondary-foreground">
            Rewards available
          </dt>
          <dd className="font-heading font-medium tracking-tight tabular-nums text-card-foreground">
            <span className="flex flex-wrap items-baseline gap-1">
              <span className="text-lg leading-7">HK$</span>
              <span className="text-4xl leading-10 sm:text-5xl sm:leading-12">
                {rewardsAvailableHkd.toLocaleString("en-HK")}
              </span>
            </span>
          </dd>
          <dd className="text-xs leading-4 text-pretty text-secondary-foreground">
            Earns daily while your items are in the vault
          </dd>
          <div className="mt-3 flex flex-col items-start gap-1.5">
            {hasPayoutMethod ? (
              <Button
                disabled={!meetsMinimum}
                size="sm"
                type="button"
                onClick={onWithdraw}
              >
                Withdraw
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
            {hasPayoutMethod && !meetsMinimum ? (
              <p className="text-xs text-secondary-foreground">
                Minimum {formatHkd(minWithdrawalHkd)} to withdraw
              </p>
            ) : null}
          </div>
        </div>
        <Stat label="Earned all-time">
          <span className="text-2xl leading-8 sm:text-3xl sm:leading-9">
            {formatHkd(earnedAllTimeHkd)}
          </span>
        </Stat>
        <Stat label="Total estimated value">
          <span className="text-2xl leading-8 sm:text-3xl sm:leading-9">
            {formatHkd(totalEstimateHkd)}
          </span>
        </Stat>
        <Stat hint="Paid to your bank account" label="Withdrawn to date">
          <span className="text-2xl leading-8 sm:text-3xl sm:leading-9">
            {formatHkd(withdrawnHkd)}
          </span>
        </Stat>
      </dl>
    </Card>
  );
}

export { VaultWalletSummary };
