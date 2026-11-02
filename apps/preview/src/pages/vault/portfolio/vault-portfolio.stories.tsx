import { Badge } from "@grade10/design-system/components/display/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@grade10/design-system/components/display/tabs";
import { Button } from "@grade10/design-system/components/forms/button";
import { cn } from "@grade10/design-system/lib/utils";
import { Vault } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useRef, useState } from "react";
import { expect, waitFor, within } from "storybook/test";
import { activeIntakeSubmissionCount } from "../../intake-content";
import {
  DAILY_INCENTIVES,
  INTAKE_TRACKER_STORY_ID,
  PAYOUT_METHOD,
  PAYOUT_REQUESTS,
  PORTFOLIO_ASSETS,
  PORTFOLIO_SUMMARY,
  VAULT_BOOK_VISIT_STORY_ID,
  type VaultPayoutRequest,
  vaultItemRelatedStoryId,
} from "../../vault-content";
import {
  animateEnter,
  PAGE_ENTER_CLASS,
  PageHeader,
  StickyTabBar,
  VaultEmptyState,
  VaultPageShell,
} from "../../vault-shared";
import { navigateToStory } from "../../workbench-story-nav";
import { ActiveIntakeAlert } from "./active-intake-alert";
import { RewardsLedger } from "./rewards-ledger";
import { VaultAssetList } from "./vault-asset-list";
import { WalletSummary } from "./wallet-summary";
import { WithdrawalDetails } from "./withdrawal-details";
import { WithdrawalDialog } from "./withdrawal-dialog";

/** Simulated holdings fetch — the workbench recipe's ready beat. */
const HOLDINGS_LOAD_MS = 350;

function VaultPortfolioPage({
  empty = false,
  intakeSubmissionCount = activeIntakeSubmissionCount(),
  loading = false,
}: {
  empty?: boolean;
  /** Open intake submissions — omit to use the live intake fixture count. */
  intakeSubmissionCount?: number;
  /** Hold the holdings list in skeletons to exercise the loading state. */
  loading?: boolean;
}) {
  const assets = empty ? [] : PORTFOLIO_ASSETS;
  const [fetching, setFetching] = useState(!empty);

  useEffect(() => {
    if (empty) return;
    const timeout = window.setTimeout(
      () => setFetching(false),
      HOLDINGS_LOAD_MS,
    );
    return () => window.clearTimeout(timeout);
  }, [empty]);

  const holdingsLoading = loading || fetching;
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [detailsRequest, setDetailsRequest] =
    useState<VaultPayoutRequest | null>(null);
  const [pageTab, setPageTab] = useState<
    "assets" | "incentives" | "withdrawal"
  >("assets");
  const tabsRef = useRef<HTMLDivElement>(null);
  const openCashOuts = PAYOUT_REQUESTS.filter(
    (request) =>
      request.status === "Pending" || request.status === "Processing",
  ).length;

  /* Enter: the active panel's sections rise in on each tab switch. */
  // biome-ignore lint/correctness/useExhaustiveDependencies: pageTab and empty are what re-run the rise
  useEffect(() => {
    const panel = tabsRef.current?.querySelector(
      '[role="tabpanel"][data-state="active"]',
    ) as HTMLElement | null;
    animateEnter(panel);
  }, [pageTab, empty]);

  return (
    <VaultPageShell wide>
      <div className={PAGE_ENTER_CLASS}>
        <PageHeader
          title="Vault Portfolio"
          actions={
            empty ? undefined : (
              <Button
                leading={<Vault aria-hidden size={16} />}
                size="md"
                type="button"
                variant="outline"
                onClick={() => navigateToStory(VAULT_BOOK_VISIT_STORY_ID)}
              >
                Submit to Vault
              </Button>
            )
          }
        />
      </div>

      <div className="flex flex-col gap-15">
        {!empty && (
          <div className={cn(PAGE_ENTER_CLASS, "delay-[30ms]")}>
            <WalletSummary
              availableUsd={PORTFOLIO_SUMMARY.rewardsAvailableUsd}
              cashedOutUsd={PORTFOLIO_SUMMARY.cashedOutUsd}
              dailyIncentiveUsd={PORTFOLIO_SUMMARY.dailyIncentiveUsd}
              earnedAllTimeUsd={PORTFOLIO_SUMMARY.earnedAllTimeUsd}
              hasPayoutMethod={PORTFOLIO_SUMMARY.hasPayoutMethod}
              inCashOutUsd={PORTFOLIO_SUMMARY.inCashOutUsd}
              minWithdrawalUsd={PORTFOLIO_SUMMARY.minWithdrawalUsd}
              openCashOutCount={openCashOuts}
              onCashOut={() => setWithdrawOpen(true)}
              onViewActivity={() => {
                setPageTab("incentives");
                tabsRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              onViewCashOuts={() => {
                setPageTab("withdrawal");
                tabsRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
            />
          </div>
        )}

        <Tabs
          className="gap-0"
          ref={tabsRef as never}
          value={pageTab}
          onValueChange={(value) =>
            setPageTab(value as "assets" | "incentives" | "withdrawal")
          }
        >
          <StickyTabBar className="border-b border-border pb-0 pt-1">
            <TabsList
              aria-label="Portfolio sections"
              className="justify-start overflow-x-auto overflow-y-hidden"
              variant="list"
            >
              <TabsTrigger value="assets">
                Assets
                <Badge size="sm">{PORTFOLIO_SUMMARY.itemCount}</Badge>
              </TabsTrigger>
              <TabsTrigger value="incentives">Incentives</TabsTrigger>
              <TabsTrigger value="withdrawal">
                Withdrawal
                {openCashOuts > 0 ? (
                  <Badge size="sm">{openCashOuts} open</Badge>
                ) : null}
              </TabsTrigger>
            </TabsList>
          </StickyTabBar>
          <TabsContent
            className="mt-8 flex flex-col gap-6 outline-none"
            value="assets"
          >
            <div className={cn(PAGE_ENTER_CLASS, "delay-[60ms]")}>
              <ActiveIntakeAlert
                submissionCount={intakeSubmissionCount}
                onTrackProgress={() => navigateToStory(INTAKE_TRACKER_STORY_ID)}
              />
            </div>
            {empty ? (
              <VaultEmptyState
                title="No items in your vault"
                description="Book a store visit to vault your collectibles. Your items will appear here once verified and stored."
                actionLabel="Submit to Vault"
                onAction={() => navigateToStory(VAULT_BOOK_VISIT_STORY_ID)}
              />
            ) : (
              <VaultAssetList
                assets={assets}
                loading={holdingsLoading}
                onOpenAsset={(asset) =>
                  navigateToStory(vaultItemRelatedStoryId(asset))
                }
              />
            )}
          </TabsContent>
          <TabsContent className="mt-8 outline-none" value="incentives">
            <RewardsLedger
              dailyIncentives={DAILY_INCENTIVES}
              payoutRequests={PAYOUT_REQUESTS}
              tab="incentives"
              onOpenWithdrawal={setDetailsRequest}
            />
          </TabsContent>
          <TabsContent className="mt-8 outline-none" value="withdrawal">
            <RewardsLedger
              dailyIncentives={DAILY_INCENTIVES}
              payoutRequests={PAYOUT_REQUESTS}
              tab="withdrawal"
              onOpenWithdrawal={setDetailsRequest}
            />
          </TabsContent>
        </Tabs>
      </div>
      <WithdrawalDetails
        open={detailsRequest != null}
        request={detailsRequest}
        onOpenChange={(open) => {
          if (!open) setDetailsRequest(null);
        }}
      />
      <WithdrawalDialog
        availableUsd={PORTFOLIO_SUMMARY.rewardsAvailableUsd}
        hkdPerUsd={PORTFOLIO_SUMMARY.hkdPerUsd}
        minWithdrawalUsd={PORTFOLIO_SUMMARY.minWithdrawalUsd}
        payoutMethod={PAYOUT_METHOD}
        open={withdrawOpen}
        onOpenChange={setWithdrawOpen}
      />
    </VaultPageShell>
  );
}

const meta = {
  title: "Vault/Portfolio/Screens/Portfolio",
  component: VaultPortfolioPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof VaultPortfolioPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Filled: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Sections enter with a staggered animation — wait for them to settle.
    await waitFor(() => {
      expect(
        canvas.getByRole("heading", { level: 1, name: "Vault Portfolio" }),
      ).toBeVisible();
      expect(
        canvas.getByRole("button", { name: "Submit to Vault" }),
      ).toBeVisible();
      expect(canvas.getByText("Incentives available")).toBeVisible();
      expect(canvas.getByText("Earned all time")).toBeVisible();
      expect(canvas.getByText("In withdrawal")).toBeVisible();
      expect(canvas.getByText("Withdrawn")).toBeVisible();
      expect(canvas.getByText("Incentives & Withdrawal")).toBeVisible();
      expect(
        canvas.getByText("2 submissions currently in intake"),
      ).toBeVisible();
      expect(
        canvas.getByRole("button", { name: "Track Progress" }),
      ).toBeVisible();
      expect(canvas.getByRole("button", { name: "In Vault" })).toBeVisible();
      expect(
        canvas.getByRole("button", { name: "Live Auction" }),
      ).toBeVisible();
      expect(canvas.getByRole("button", { name: "Listed" })).toBeVisible();
    });
    expect(
      canvasElement.querySelectorAll('[data-slot="vault-asset-card"]').length,
    ).toBe(6);
    // Intake-stage assets never appear in holdings.
    expect(canvas.queryByText("Pre-check")).toBeNull();
  },
};

/** Holdings fetch in flight — Boneyard card skeletons under the tab bar. */
export const Loading: Story = {
  args: { loading: true },
  play: async ({ canvasElement }) => {
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[aria-label="Loading vault assets"]'),
      ).not.toBeNull(),
    );
    expect(
      canvasElement.querySelectorAll('[data-slot="vault-asset-card"]').length,
    ).toBe(6);
  },
};

export const Empty: Story = {
  args: { empty: true, intakeSubmissionCount: 0 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("No items in your vault")).toBeVisible();
    expect(canvas.queryByText(/currently in intake/)).toBeNull();
    expect(canvas.queryByText("Incentives available")).toBeNull();
  },
};

/** Empty vault with open intake — alert still surfaces above the empty state. */
export const EmptyWithIntake: Story = {
  args: { empty: true, intakeSubmissionCount: 2 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("No items in your vault")).toBeVisible();
    await waitFor(() =>
      expect(
        canvas.getByText("2 submissions currently in intake"),
      ).toBeVisible(),
    );
    expect(canvas.queryByText("Incentives available")).toBeNull();
  },
};
