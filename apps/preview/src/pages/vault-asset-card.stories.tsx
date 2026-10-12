import { Text } from "@grade10/design-system/components/display/text";
import { Link } from "@grade10/design-system/components/forms/link";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { VaultAssetCard } from "./vault-asset-card";
import {
  PORTFOLIO_ASSETS,
  VAULT_PORTFOLIO_HREF,
  type VaultAsset,
  vaultItemRelatedStoryId,
} from "./vault-content";
import { navigateToStory } from "./workbench-story-nav";

/**
 * One collectible tile on the Vault Portfolio grid — Figma `Vault Asset
 * Card` (`7068:10249`). Only vaulted holdings render here — intake stays
 * on Submissions. Every card opens the asset detail page; the badge and
 * price line follow the asset's listing state.
 */
const meta = {
  title: "Vault/Asset Card",
  component: VaultAssetCard,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="flex w-72 flex-col gap-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof VaultAssetCard>;

export default meta;
type Story = StoryObj<typeof meta>;

function assetWithStatus(status: VaultAsset["status"]): VaultAsset {
  const asset = PORTFOLIO_ASSETS.find((a) => a.status === status);
  if (!asset) throw new Error(`No fixture for status ${status}`);
  return asset;
}

function LinkedCard({ asset }: { asset: VaultAsset }) {
  return (
    <>
      <VaultAssetCard
        asset={asset}
        onOpen={() => navigateToStory(vaultItemRelatedStoryId(asset))}
      />
      <Text className="text-secondary-foreground" size="xs">
        Related:{" "}
        <Link href={VAULT_PORTFOLIO_HREF} size="xs">
          Vault Portfolio
        </Link>
      </Text>
    </>
  );
}

/** Vaulted holding — no status badge; intake estimate on the price line. */
export const InVault: Story = {
  args: { asset: assetWithStatus("In Vault") },
  render: ({ asset }) => <LinkedCard asset={asset} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText("In Vault")).toBeNull();
    expect(canvas.getByText("Intake estimate")).toBeVisible();
    expect(canvas.getByRole("link", { name: "Vault Portfolio" })).toBeVisible();
  },
};

/** Fixed-price store listing — brand badge, LISTED PRICE. */
export const Listed: Story = {
  args: { asset: assetWithStatus("Listed") },
  render: ({ asset }) => <LinkedCard asset={asset} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Listed")).toBeVisible();
    expect(canvas.getByText("Listed price")).toBeVisible();
  },
};

/** Bidding in progress — brand badge, BID PRICE. */
export const LiveAuction: Story = {
  args: { asset: assetWithStatus("Live Auction") },
  render: ({ asset }) => <LinkedCard asset={asset} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Live Auction")).toBeVisible();
    expect(canvas.getByText("Bid price")).toBeVisible();
  },
};

/** Boneyard skeleton while the holdings fetch settles. */
export const Loading: Story = {
  args: { asset: assetWithStatus("In Vault"), loading: true },
  render: ({ asset }) => <VaultAssetCard asset={asset} loading />,
};

/** Boneyard capture target — `loading` at the card's 288px grid width. */
export const BoneyardCapture: Story = {
  args: { asset: assetWithStatus("In Vault"), loading: true },
};

/** Withdrawal requested, admin approval pending — intake estimate stays. */
export const RetrievalPending: Story = {
  args: { asset: assetWithStatus("Retrieval Pending") },
  render: ({ asset }) => <LinkedCard asset={asset} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Retrieval Pending")).toBeVisible();
    expect(canvas.getByText("Intake estimate")).toBeVisible();
  },
};
