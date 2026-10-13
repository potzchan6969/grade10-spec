import { Button } from "@grade10/design-system/components/forms/button";
import { cn } from "@grade10/design-system/lib/utils";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { expect, waitFor, within } from "storybook/test";
import {
  INTAKE_TRACKER_STORY_ID,
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
import { activeIntakeSubmissionCount } from "../intake-content";
import { ActiveIntakeAlert } from "./active-intake-alert";
import { VaultAssetList } from "./vault-asset-list";
import { VaultPortfolioStats } from "./vault-portfolio-stats";

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

      <div className="flex flex-col gap-8">
        {!empty && (
          <div className={cn(PAGE_ENTER_CLASS, "delay-[30ms]")}>
            <VaultPortfolioStats
              feeHint={PORTFOLIO_SUMMARY.feeHint}
              feeLabel={PORTFOLIO_SUMMARY.feeLabel}
              totalEstimateHkd={PORTFOLIO_SUMMARY.totalEstimateHkd}
            />
          </div>
        )}

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
      </div>
    </VaultPageShell>
  );
}

const meta = {
  title: "Vault/Portfolio/Portfolio",
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
      expect(canvas.getByText("Total estimated value")).toBeVisible();
      expect(canvas.getByText("Storage fees")).toBeVisible();
      expect(canvas.getByText("Complimentary")).toBeVisible();
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
    expect(canvas.queryByText("Total estimated value")).toBeNull();
    expect(canvas.queryByText("Storage fees")).toBeNull();
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
    expect(canvas.queryByText("Total estimated value")).toBeNull();
    expect(canvas.queryByText("Storage fees")).toBeNull();
  },
};
