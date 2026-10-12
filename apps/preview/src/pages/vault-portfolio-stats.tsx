import { Card } from "@grade10/design-system/components/display/card";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";

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
    <div className={cn("flex min-w-0 flex-col gap-1 p-5 sm:p-6", className)}>
      <dt className="font-heading text-sm leading-5 font-medium uppercase text-secondary-foreground">
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
 * Portfolio headline figures — provisional treatment on `7068:7718`
 * (`7102:1514`). The estimate is the hero on a subtle wash; storage fees
 * read as the supporting fact on the right. Item count is deliberately
 * omitted — the tab badges already carry it. Below `sm` the two figures
 * stack in one column.
 */
function VaultPortfolioStats({
  totalEstimateHkd,
  feeLabel,
  feeHint,
  className,
}: {
  totalEstimateHkd: number;
  feeLabel: string;
  feeHint?: string;
  className?: string;
}) {
  return (
    <Card
      aria-label="Portfolio summary"
      className={className}
      data-slot="vault-portfolio-stats"
      padding={false}
      role="region"
    >
      <dl className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-y-0">
        <Stat
          className="bg-background-subtle sm:border-border sm:border-r"
          label="Total estimated value"
        >
          <span className="flex flex-wrap items-baseline gap-1">
            <span className="text-lg leading-7">HK$</span>
            <span className="text-4xl leading-10 sm:text-5xl sm:leading-12">
              {totalEstimateHkd.toLocaleString("en-HK")}
            </span>
          </span>
        </Stat>
        <Stat hint={feeHint} label="Storage fees">
          <span className="text-2xl leading-8 sm:text-3xl sm:leading-9">
            {feeLabel}
          </span>
        </Stat>
      </dl>
    </Card>
  );
}

export { VaultPortfolioStats };
