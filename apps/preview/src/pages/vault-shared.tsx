import { Alert } from "@grade10/design-system/components/display/alert";
import { Badge } from "@grade10/design-system/components/display/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
          <Text className="text-pretty" tone="secondary">
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
    <div className="flex min-w-0 flex-col gap-1.5 border-border py-1 not-last:border-b sm:border-b-0 sm:not-last:border-r sm:px-6 sm:first:pl-0 sm:last:pr-0 sm:not-last:border-border">
      <Text size="sm" tone="secondary">
        {label}
      </Text>
      <p className="font-heading text-2xl font-medium tracking-tight tabular-nums md:text-3xl">
        {value}
      </p>
      {hint ? (
        <Text size="xs" tone="secondary">
          {hint}
        </Text>
      ) : null}
    </div>
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
      className="grid gap-4 rounded-(--radius-2xl) border border-border bg-card p-5 sm:grid-cols-3 sm:gap-0 sm:p-6"
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

function VaultAssetCard({
  asset,
  onOpen,
  proposedListAction = false,
}: {
  asset: VaultAsset;
  onOpen?: () => void;
  proposedListAction?: boolean;
}) {
  return (
    <Card
      className="group/vault-card overflow-hidden transition-[border-color] duration-150 ease-out hover:border-foreground/20 motion-reduce:transition-none"
      data-slot="vault-asset-card"
      padding={false}
    >
      <button
        className="relative block w-full cursor-pointer text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        type="button"
        onClick={onOpen}
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
          <img
            alt={`${asset.name}, ${assetSubtitle(asset)}`}
            className="size-full object-cover transition-transform duration-300 ease-out group-hover/vault-card:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover/vault-card:scale-100"
            height={320}
            src={asset.imageSrc}
            width={240}
          />
          <div className="absolute top-3 left-3">
            <Badge variant={statusBadgeVariant(asset.status)}>
              {asset.status}
            </Badge>
          </div>
        </div>
        <CardHeader className="gap-1 px-4 pt-4">
          <CardTitle className="line-clamp-2 text-base">{asset.name}</CardTitle>
          <CardDescription>{assetSubtitle(asset)}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1 px-4 pb-4">
          <p className="text-base font-medium tabular-nums">
            {formatHkd(asset.estimateHkd)}
          </p>
          <Text size="xs" tone="secondary">
            Source: {asset.valuationSource}
          </Text>
          {asset.vaultId ? (
            <Text className="font-mono" size="xs" tone="secondary">
              {asset.vaultId}
            </Text>
          ) : null}
        </CardContent>
      </button>
      {(onOpen || proposedListAction) && (
        <CardFooter className="flex flex-wrap gap-2 border-t border-border bg-background p-4">
          {onOpen ? (
            <Button
              size="sm"
              type="button"
              variant="secondary"
              onClick={onOpen}
            >
              View details
            </Button>
          ) : null}
          {proposedListAction ? (
            <Button
              disabled
              size="sm"
              type="button"
              title="Proposed — not day one"
            >
              List for Auction
            </Button>
          ) : null}
        </CardFooter>
      )}
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
    <div className="flex flex-col gap-1 border-b border-border py-3 last:border-b-0">
      <Text size="sm" tone="secondary">
        {label}
      </Text>
      <div className="text-base font-medium tabular-nums">{value}</div>
      {hint ? (
        <Text size="xs" tone="secondary">
          {hint}
        </Text>
      ) : null}
    </div>
  );
}

export {
  AppointmentPageShell,
  FactRow,
  PageHeader,
  PortfolioSummary,
  ProposalBanner,
  SummaryStat,
  VaultAssetCard,
  VaultEmptyState,
  VaultPageShell,
};
