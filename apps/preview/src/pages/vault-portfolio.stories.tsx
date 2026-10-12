import { Button } from "@grade10/design-system/components/forms/button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ActiveIntakeAlert } from "./active-intake-alert";
import { activeIntakeSubmissionCount } from "./intake-content";
import { VaultAssetList } from "./vault-asset-list";
import {
  INTAKE_TRACKER_STORY_ID,
  PORTFOLIO_ASSETS,
  PORTFOLIO_SUMMARY,
  VAULT_BOOK_VISIT_STORY_ID,
  vaultItemRelatedStoryId,
} from "./vault-content";
import { VaultPortfolioStats } from "./vault-portfolio-stats";
import { PageHeader, VaultEmptyState, VaultPageShell } from "./vault-shared";
import { navigateToStory } from "./workbench-story-nav";

function VaultPortfolioPage({
  empty = false,
  intakeSubmissionCount = activeIntakeSubmissionCount(),
}: {
  empty?: boolean;
  /** Open intake submissions — omit to use the live intake fixture count. */
  intakeSubmissionCount?: number;
}) {
  const assets = empty ? [] : PORTFOLIO_ASSETS;

  return (
    <VaultPageShell wide>
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

      <div className="flex flex-col gap-8">
        {!empty && (
          <VaultPortfolioStats
            feeHint={PORTFOLIO_SUMMARY.feeHint}
            feeLabel={PORTFOLIO_SUMMARY.feeLabel}
            totalEstimateHkd={PORTFOLIO_SUMMARY.totalEstimateHkd}
          />
        )}

        <ActiveIntakeAlert
          submissionCount={intakeSubmissionCount}
          onTrackProgress={() => navigateToStory(INTAKE_TRACKER_STORY_ID)}
        />

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
  title: "Pages/Vault/Portfolio",
  component: VaultPortfolioPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof VaultPortfolioPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Filled: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "Vault Portfolio" }),
    ).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Submit to Vault" }),
    ).toBeVisible();
    expect(canvas.getByText("Total estimated value")).toBeVisible();
    expect(canvas.getByText("Storage fees")).toBeVisible();
    expect(canvas.getByText("Complimentary")).toBeVisible();
    expect(canvas.getByText("2 submissions currently in intake")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Track Progress" }),
    ).toBeVisible();
    expect(canvas.getByRole("tab", { name: /All Assets 6/ })).toBeVisible();
    expect(canvas.getByRole("tab", { name: /In Vault 2/ })).toBeVisible();
    expect(canvas.getByRole("tab", { name: /Live Auction 2/ })).toBeVisible();
    expect(canvas.getByRole("tab", { name: /Listed 2/ })).toBeVisible();
    expect(
      canvasElement.querySelectorAll('[data-slot="vault-asset-card"]').length,
    ).toBe(6);
    // Intake-stage assets never appear in holdings.
    expect(canvas.queryByText("Pre-check")).toBeNull();
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
    expect(canvas.getByText("2 submissions currently in intake")).toBeVisible();
    expect(canvas.queryByText("Total estimated value")).toBeNull();
    expect(canvas.queryByText("Storage fees")).toBeNull();
  },
};
