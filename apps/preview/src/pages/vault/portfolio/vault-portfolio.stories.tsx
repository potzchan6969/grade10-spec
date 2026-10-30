import { Button } from "@grade10/design-system/components/forms/button";
import { cn } from "@grade10/design-system/lib/utils";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { expect, waitFor, within } from "storybook/test";
import { activeIntakeSubmissionCount } from "../../intake-content";
import { Badge } from "@grade10/design-system/components/display/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@grade10/design-system/components/display/tabs";
import {
  DAILY_INCENTIVES,
  INTAKE_TRACKER_STORY_ID,
  PAYOUT_METHOD,
  PAYOUT_REQUESTS,
  PORTFOLIO_ASSETS,
  PORTFOLIO_SUMMARY,
  VAULT_BOOK_VISIT_STORY_ID,
  vaultItemRelatedStoryId,
} from "../../vault-content";
import {
  PAGE_ENTER_CLASS,
  PageHeader,
  VaultEmptyState,
  VaultPageShell,
} from "../../vault-shared";
import { navigateToStory } from "../../workbench-story-nav";
import { ActiveIntakeAlert } from "./active-intake-alert";
import { VaultAssetList } from "./vault-asset-list";
import { CashOutDialog } from "../wallet/cash-out-dialog";
import { RewardsLedger } from "../wallet/rewards-ledger";
import { WalletSummary } from "../wallet/wallet-summary";

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
  const [pageTab, setPageTab] = useState<"assets" | "rewards">("assets");
  const openCashOuts = PAYOUT_REQUESTS.filter(
    (request) => request.status === "Pending review" || request.status === "Processing",
  ).length;

  return (
    <VaultPageShell wide>
      <div className={PAGE_ENTER_CLASS}>
        <PageHeader
          title="Vault Portfolio"
          actions={
            empty ? undefined : (
              <Button
                type="button"
                onClick={() => navigateToStory(VAULT_BOOK_VISIT_STORY_ID)}
              >
                Submit to Vault
              </Button>
            )
          }
        />
      </div>

      <div className="flex flex-col gap-12">
        {!empty && (
          <div className={cn(PAGE_ENTER_CLASS, "delay-[30ms]")}>
            <WalletSummary
              availableHkd={PORTFOLIO_SUMMARY.rewardsAvailableHkd}
              cashedOutHkd={PORTFOLIO_SUMMARY.cashedOutHkd}
              dailyIncentiveHkd={PORTFOLIO_SUMMARY.dailyIncentiveHkd}
              earnedAllTimeHkd={PORTFOLIO_SUMMARY.earnedAllTimeHkd}
              hasPayoutMethod={PORTFOLIO_SUMMARY.hasPayoutMethod}
              inCashOutHkd={PORTFOLIO_SUMMARY.inCashOutHkd}
              minWithdrawalHkd={PORTFOLIO_SUMMARY.minWithdrawalHkd}
              openCashOutCount={openCashOuts}
              onCashOut={() => setWithdrawOpen(true)}
              onViewActivity={() => setPageTab("rewards")}
            />
          </div>
        )}

        <Tabs
          className="gap-8"
          value={pageTab}
          onValueChange={(value) => setPageTab(value as "assets" | "rewards")}
        >
          <TabsList aria-label="Portfolio sections" className="w-full justify-start border-b border-border" variant="list">
            <TabsTrigger value="assets">
              Assets
              <Badge size="sm">{PORTFOLIO_SUMMARY.itemCount}</Badge>
            </TabsTrigger>
            <TabsTrigger value="rewards">
              Rewards & Cash-out
              {openCashOuts > 0 ? (
                <Badge size="sm">{openCashOuts} open</Badge>
              ) : null}
            </TabsTrigger>
          </TabsList>
          <TabsContent
            className="mt-0 flex flex-col gap-6 outline-none"
            value="assets"
          >
            <div className={cn(PAGE_ENTER_CLASS, "delay-[60ms]")}>
              <ActiveIntakeAlert
                submissionCount={intakeSubmissionCount}
                onTrackProgress={() =>
                  navigateToStory(INTAKE_TRACKER_STORY_ID)
                }
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
          <TabsContent className="mt-0 outline-none" value="rewards">
            <RewardsLedger
              dailyIncentives={DAILY_INCENTIVES}
              payoutRequests={PAYOUT_REQUESTS}
            />
          </TabsContent>
        </Tabs>
      </div>
      <CashOutDialog
        availableHkd={PORTFOLIO_SUMMARY.rewardsAvailableHkd}
        minWithdrawalHkd={PORTFOLIO_SUMMARY.minWithdrawalHkd}
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
      expect(canvas.getByText("Rewards available")).toBeVisible();
      expect(canvas.getByText("Earned all-time")).toBeVisible();
      expect(canvas.getByText("Total estimated value")).toBeVisible();
      expect(canvas.getByText("Withdrawn to date")).toBeVisible();
      expect(canvas.getByText("Cash-out requests")).toBeVisible();
      expect(canvas.getByText("Pending review")).toBeVisible();
      expect(
        canvas.getByText("2 submissions currently in intake"),
      ).toBeVisible();
      expect(
        canvas.getByRole("button", { name: "Track Progress" }),
      ).toBeVisible();
      expect(canvas.getByRole("tab", { name: /All Assets 6/ })).toBeVisible();
      expect(canvas.getByRole("tab", { name: /In Vault 2/ })).toBeVisible();
      expect(canvas.getByRole("tab", { name: /Live Auction 2/ })).toBeVisible();
      expect(canvas.getByRole("tab", { name: /Listed 2/ })).toBeVisible();
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
    expect(canvas.queryByText("Rewards available")).toBeNull();
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
    expect(canvas.queryByText("Rewards available")).toBeNull();
  },
};
