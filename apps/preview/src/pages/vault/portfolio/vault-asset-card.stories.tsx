import { Text } from "@grade10/design-system/components/display/text";
import { Link } from "@grade10/design-system/components/forms/link";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  PORTFOLIO_ASSETS,
  VAULT_PORTFOLIO_HREF,
  type VaultAsset,
  vaultItemRelatedStoryId,
} from "../../vault-content";
import { navigateToStory } from "../../workbench-story-nav";
import { VaultAssetCard } from "./vault-asset-card";

/**
 * One collectible tile on the Vault Portfolio grid — Figma `Vault Asset
 * Card` (`7068:10249`). Only vaulted holdings render here — intake stays
 * on Submissions. Every card opens the asset detail page; the badge and
 * price line follow the asset's listing state.
 */
const meta = {
  title: "Vault/Portfolio/Blocks/VaultAssetCard",
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

/** Vaulted holding — no status badge and no price line. */
export const InVault: Story = {
  parameters: {
    verification: { caseId: "vc_10140eb8-df97-4dde-9d1b-721a1612e642" },
  },
  args: { asset: assetWithStatus("In Vault") },
  render: ({ asset }) => <LinkedCard asset={asset} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText("In Vault")).toBeNull();
    expect(canvas.queryByText("Intake estimate")).toBeNull();
    expect(canvas.getByRole("link", { name: "Vault Portfolio" })).toBeVisible();
  },
};

/** Fixed-price store listing — brand badge. */
export const Listed: Story = {
  parameters: {
    verification: { caseId: "vc_7d16d880-fea4-4801-869b-3339760784dc" },
  },
  args: { asset: assetWithStatus("Listed") },
  render: ({ asset }) => <LinkedCard asset={asset} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Listed")).toBeVisible();
    expect(canvas.queryByText("Listed price")).toBeNull();
  },
};

/** Bidding in progress — brand badge. */
export const LiveAuction: Story = {
  parameters: {
    verification: { caseId: "vc_6c3bbd5a-4f53-4ba8-a075-6a3082ba90ad" },
  },
  args: { asset: assetWithStatus("Live Auction") },
  render: ({ asset }) => <LinkedCard asset={asset} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Live Auction")).toBeVisible();
    expect(canvas.queryByText("Bid price")).toBeNull();
  },
};

/** Boneyard skeleton while the holdings fetch settles — also the capture target at the card's 288px grid width. */
export const BoneyardCapture: Story = {
  parameters: {
    verification: { caseId: "vc_6f9060c3-474a-4bf3-acb0-0334665eb46c" },
  },
  args: { asset: assetWithStatus("In Vault"), loading: true },
};

/** Price feed down — the estimate pauses with a warning icon and tooltip. */
export const EstimatePaused: Story = {
  parameters: {
    verification: { caseId: "vc_73dc2482-fae3-4864-80a3-c9dfc68ba409" },
  },
  args: { asset: { ...assetWithStatus("In Vault"), priceStale: true } },
  render: ({ asset }) => <LinkedCard asset={asset} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Est. paused")).toBeVisible();
    expect(
      canvas.getByLabelText("Why the daily estimate is paused"),
    ).toBeVisible();
  },
};

/** Withdrawal requested, admin approval pending — badge, no price line. */
export const RetrievalPending: Story = {
  parameters: {
    verification: { caseId: "vc_c5543946-2f51-4412-8184-a696a0300f8d" },
  },
  args: { asset: assetWithStatus("Retrieval Pending") },
  render: ({ asset }) => <LinkedCard asset={asset} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Retrieval Pending")).toBeVisible();
    expect(canvas.queryByText("Intake estimate")).toBeNull();
  },
};
