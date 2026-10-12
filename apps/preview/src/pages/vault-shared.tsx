import { Alert } from "@grade10/design-system/components/display/alert";
import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { Footer } from "@grade10/design-system/components/layout/footer";
import { LISTING_LOT_GRID_CLASS, SiteHeader } from "@grade10/ui";
import { Package, Vault } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { VAULT_FOOTER, VAULT_SITE_HEADER } from "./vault-content";

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

function VaultItemDetailPageShell({
  children,
  header,
}: {
  children: ReactNode;
  header?: ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SiteHeader {...VAULT_SITE_HEADER} />
      <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 pb-16 sm:px-8">
        <div className="flex flex-col gap-8 pt-8 sm:gap-12 lg:pt-12">
          {header}
          <div className={LISTING_LOT_GRID_CLASS}>{children}</div>
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
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance md:text-4xl">
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
      <Text className="shrink-0 text-secondary-foreground sm:w-40" size="sm">
        {label}
      </Text>
      <div className="min-w-0 flex-1 sm:text-right">
        <div className="text-base font-medium tabular-nums break-words">
          {value}
        </div>
        {hint ? (
          <Text
            className="mt-0.5 text-secondary-foreground sm:text-right"
            size="xs"
          >
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
  ProposalBanner,
  VaultEmptyState,
  VaultItemDetailPageShell,
  VaultPageShell,
};
