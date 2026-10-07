import { Alert } from "@grade10/design-system/components/display/alert";
import { Badge } from "@grade10/design-system/components/display/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@grade10/design-system/components/display/card";
import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { Footer } from "@grade10/design-system/components/layout/footer";
import { SiteHeader } from "@grade10/ui";
import { Package, Vault } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import {
  assetSubtitle,
  formatHkd,
  statusBadgeVariant,
  VAULT_FOOTER,
  VAULT_SITE_HEADER,
  type VaultAsset,
} from "./vault-content";

function VaultPageShell({
  children,
  wide = false,
}: {
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <SiteHeader {...VAULT_SITE_HEADER} />
      <main className="flex w-full flex-1 justify-center px-4 py-8 sm:px-6 md:px-8 md:py-10">
        <div
          className={
            wide
              ? "flex w-full max-w-6xl flex-col gap-8 md:gap-10"
              : "flex w-full max-w-5xl flex-col gap-8 md:gap-10"
          }
        >
          {children}
        </div>
      </main>
      <Footer {...VAULT_FOOTER} />
    </div>
  );
}

function AppointmentPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <SiteHeader {...VAULT_SITE_HEADER} />
      <main className="flex w-full flex-1 justify-center px-4 py-8 sm:px-6 md:px-8 md:py-10">
        <div className="flex w-full max-w-6xl flex-col gap-8 md:gap-10">
          {children}
        </div>
      </main>
      <Footer {...VAULT_FOOTER} />
    </div>
  );
}

function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="flex max-w-2xl flex-col gap-2">
        <h1 className="font-heading text-3xl font-medium tracking-tight text-balance md:text-4xl">
          {title}
        </h1>
        {description ? (
          <Text className="text-pretty text-secondary-foreground">
            {description}
          </Text>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>
      ) : null}
    </div>
  );
}

function PageSection({
  heading,
  count,
  children,
  className,
}: {
  heading: string;
  count?: number;
  children: ReactNode;
  className?: string;
}) {
  const headingId = heading;
  return (
    <section
      aria-labelledby={headingId}
      className={className ?? "flex flex-col gap-5"}
    >
      <div className="flex items-baseline justify-between gap-3 border-b border-border pb-3">
        <h2
          className="font-heading text-xl font-medium tracking-tight"
          id={headingId}
        >
          {heading}
        </h2>
        {count !== undefined ? (
          <Text className="text-secondary-foreground" size="sm">
            {count} {count === 1 ? "item" : "items"}
          </Text>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function SummaryStat({
  label,
  value,
  hint,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
}) {
  return (
    <Card className="gap-0" data-slot="vault-summary-stat">
      <CardHeader className="gap-1.5 pb-0">
        <CardDescription className="text-secondary-foreground">
          {label}
        </CardDescription>
        <CardTitle className="font-heading text-2xl font-medium tracking-tight tabular-nums md:text-3xl">
          {value}
        </CardTitle>
      </CardHeader>
      {hint ? (
        <CardContent className="pt-2">
          <Text className="text-secondary-foreground" size="xs">
            {hint}
          </Text>
        </CardContent>
      ) : (
        <div className="h-2" />
      )}
    </Card>
  );
}

function PortfolioSummary({
  itemCount,
  estimate,
  feeLabel,
  feeHint,
  valuationHint,
}: {
  itemCount: number;
  estimate: string;
  feeLabel: string;
  feeHint: string;
  valuationHint: string;
}) {
  return (
    <section
      aria-label="Portfolio summary"
      className="grid gap-3 sm:grid-cols-3 sm:gap-4"
    >
      <SummaryStat label="Items in vault" value={itemCount} />
      <SummaryStat
        label="Portfolio estimate"
        value={estimate}
        hint={valuationHint}
      />
      <SummaryStat label="Storage fees" value={feeLabel} hint={feeHint} />
    </section>
  );
}

/**
 * Collectible tile — photo leads; title then estimate. Whole card opens detail
 * (OpenSea / Origin grid pattern; no footer action row).
 */
function VaultAssetCard({
  asset,
  onOpen,
}: {
  asset: VaultAsset;
  onOpen?: () => void;
  /** @deprecated Kept for call-site compatibility; auction CTA lives on detail. */
  proposedListAction?: boolean;
}) {
  return (
    <Card
      className="group/vault-card gap-0 overflow-hidden py-0 transition-[border-color,transform] duration-200 ease-out hover:border-foreground/25 hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none"
      data-slot="vault-asset-card"
      padding={false}
    >
      <button
        className="relative flex w-full cursor-pointer flex-col text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        type="button"
        onClick={onOpen}
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
          <img
            alt={`${asset.name}, ${assetSubtitle(asset)}`}
            className="size-full object-cover transition-transform duration-300 ease-out group-hover/vault-card:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover/vault-card:scale-100"
            height={320}
            src={asset.imageSrc}
            width={240}
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/35 to-transparent" />
          <div className="absolute top-3 left-3">
            <Badge variant={statusBadgeVariant(asset.status)}>
              {asset.status}
            </Badge>
          </div>
        </div>
        <div className="flex flex-col gap-2 px-4 pt-3 pb-4">
          <div className="flex flex-col gap-0.5">
            <span className="line-clamp-2 font-heading text-base leading-snug font-medium">
              {asset.name}
            </span>
            <span className="line-clamp-1 text-sm text-secondary-foreground">
              {assetSubtitle(asset)}
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-heading text-lg font-medium tracking-tight tabular-nums">
              {formatHkd(asset.estimateHkd)}
            </span>
            <span className="shrink-0 text-xs text-secondary-foreground">
              {asset.valuationSource}
            </span>
          </div>
        </div>
      </button>
    </Card>
  );
}

function ProposalBanner({
  title = "Proposal notes",
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <Alert
      dismissible={false}
      layout="block"
      status="default"
      title={title}
      description={children}
      icon={<Vault aria-hidden size={20} weight="regular" />}
      data-slot="vault-proposal-banner"
    />
  );
}

function VaultEmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <EmptyState
      icon={<Package aria-hidden size={24} weight="regular" />}
      title={title}
      description={description}
      actions={
        <Button size="md" type="button" onClick={onAction}>
          {actionLabel}
        </Button>
      }
    />
  );
}

/** Label left, value right — adidas / Glow metadata row. */
function FactRow({
  label,
  value,
  hint,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-border py-3.5 last:border-b-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
      <Text
        className="shrink-0 text-secondary-foreground sm:w-40"
        size="sm"
      >
        {label}
      </Text>
      <div className="min-w-0 flex-1 sm:text-right">
        <div className="text-base font-medium tabular-nums break-words">
          {value}
        </div>
        {hint ? (
          <Text className="mt-0.5 text-secondary-foreground sm:text-right" size="xs">
            {hint}
          </Text>
        ) : null}
      </div>
    </div>
  );
}

export {
  AppointmentPageShell,
  FactRow,
  PageHeader,
  PageSection,
  PortfolioSummary,
  ProposalBanner,
  SummaryStat,
  VaultAssetCard,
  VaultEmptyState,
  VaultPageShell,
};
