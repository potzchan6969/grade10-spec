import { Alert } from "@grade10/design-system/components/display/alert";
import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { Link } from "@grade10/design-system/components/forms/link";
import { Footer } from "@grade10/design-system/components/layout/footer";
import { cn } from "@grade10/design-system/lib/utils";
import { LISTING_LOT_GRID_CLASS, SiteHeader } from "@grade10/ui";
import { Package, Vault } from "@phosphor-icons/react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { VAULT_FOOTER, VAULT_SITE_HEADER } from "./vault-content";

/**
 * Mount-time page entrance — sections rise 8px, cross-blur 2px and fade in
 * over 300ms on the smooth-out ease (transitions.dev tokens), staggered by
 * `delay-*` per section. Mount-only; reduced-motion renders instantly.
 */
const PAGE_ENTER_CLASS =
  "animate-in fade-in-0 slide-in-from-bottom-2 blur-in-[2px] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-backwards motion-reduce:animate-none";

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

/** Bottom rule only while stuck — at rest the bar sits flush with the page. */
function StickyTabBar({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      setStuck(!entry.isIntersecting);
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none h-px w-full"
        ref={sentinelRef}
      />
      <div
        className={cn(
          "sticky top-0 z-10 -mx-4 bg-background/95 px-4 py-3 backdrop-blur-sm supports-backdrop-filter:bg-background/90 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8",
          stuck && "border-b border-border",
          className,
        )}
      >
        {children}
      </div>
    </>
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

/**
 * The note a wireframe carries at its top: the design still to settle, and the
 * manual page the screen reads from. Not a block; drawn only in prototypes.
 */
function PrototypeNote({
  manualPath,
  settles,
}: {
  manualPath: string;
  settles: string;
}) {
  return (
    <aside
      aria-label="Not yet designed"
      className="flex flex-col gap-2 rounded-2xl border border-dashed border-border bg-muted/40 p-4"
      role="note"
    >
      <Text size="sm" weight="medium">
        Not yet designed
      </Text>
      <Text size="sm" tone="secondary">
        The design must still settle {settles} Manual page:{" "}
        <Link
          href={`https://spec.grade10-stg.com/p/grade10-site/${manualPath}`}
        >
          {manualPath}
        </Link>
        .
      </Text>
    </aside>
  );
}

/**
 * Clicks Next through a flow's cases, asserting each case's title as it shows,
 * then opens the Expanded view and asserts one card per case.
 */
async function walkFlowCases(
  canvasElement: HTMLElement,
  titles: readonly string[],
) {
  const canvas = within(canvasElement);
  for (const [index, title] of titles.entries()) {
    if (index > 0) {
      await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    }
    await waitFor(() => {
      expect(canvas.getAllByText(title).length).toBeGreaterThan(0);
    });
  }
  await userEvent.click(canvas.getByRole("tab", { name: "Expanded" }));
  for (const title of titles) {
    expect(canvas.getAllByText(title).length).toBeGreaterThan(0);
  }
  expect(canvasElement.querySelectorAll(".demo-flow-case")).toHaveLength(
    titles.length,
  );
}

export {
  AppointmentPageShell,
  FactRow,
  PAGE_ENTER_CLASS,
  PageHeader,
  PageSection,
  ProposalBanner,
  PrototypeNote,
  StickyTabBar,
  VaultEmptyState,
  VaultItemDetailPageShell,
  VaultPageShell,
  walkFlowCases,
};
