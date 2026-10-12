import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import type { VaultAssetSummaryProps } from "./vault-asset-summary";
import { VaultAssetSummary } from "./vault-asset-summary";
import { VAULT_ASSET_DETAILS } from "./vault-content";

/** Controls-panel flags mapped to the component's callback props. */
type SummaryFlags = {
  listForAuction: boolean;
  listForSale: boolean;
};

/**
 * Status badge, title, estimated value, value-potential warning, and listing
 * CTAs for the vault asset detail page.
 */
const meta = {
  title: "Vault/Asset Summary",
  component: VaultAssetSummary,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="flex w-full max-w-lg flex-col">
        <Story />
      </div>
    ),
  ],
  args: {
    listForAuction: true,
    listForSale: true,
  },
  render: ({ listForAuction, listForSale, ...args }) => (
    <VaultAssetSummary
      {...args}
      onListForAuction={listForAuction ? () => {} : undefined}
      onListForSale={listForSale ? () => {} : undefined}
    />
  ),
} satisfies Meta<VaultAssetSummaryProps & SummaryFlags>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Graded asset summary — every feature wired, no grading prompt. */
export const Graded: Story = {
  args: {
    asset: VAULT_ASSET_DETAILS[0],
    showEstimateChange: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { name: VAULT_ASSET_DETAILS[0].name }),
    ).toBeVisible();
    expect(canvas.getByText("Secured in Vault")).toBeVisible();
    expect(canvas.getByText("Estimated value since intake")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "List for Auction" }),
    ).toBeVisible();
    expect(canvas.getByRole("button", { name: "List for Sale" })).toBeVisible();
    expect(canvas.queryByText("Submit for Grading")).toBeNull();
  },
};

/** Raw asset summary — every feature wired, surfaces the grading value prompt. */
export const Raw: Story = {
  args: {
    asset: VAULT_ASSET_DETAILS[1],
    showEstimateChange: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Value Potential")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Submit for Grading" }),
    ).toBeVisible();
    expect(canvas.getByText("List for Auction")).toBeVisible();
    expect(canvas.getByText("List for Sale")).toBeVisible();
  },
};

/**
 * Soft launch — the change figure and both listing CTAs stay hidden until
 * their features ship; each flag flips on its own timeline.
 */
export const GradedSoftLaunch: Story = {
  args: {
    asset: VAULT_ASSET_DETAILS[0],
    listForAuction: false,
    listForSale: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText("▲ 12.4%")).toBeNull();
    expect(
      canvas.queryByRole("button", { name: "List for Auction" }),
    ).toBeNull();
    expect(canvas.queryByRole("button", { name: "List for Sale" })).toBeNull();
  },
};

/** Soft launch on a raw asset — the grading prompt still shows. */
export const RawSoftLaunch: Story = {
  args: {
    asset: VAULT_ASSET_DETAILS[1],
    listForAuction: false,
    listForSale: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Value Potential")).toBeVisible();
    expect(
      canvas.queryByRole("button", { name: "List for Auction" }),
    ).toBeNull();
    expect(canvas.queryByRole("button", { name: "List for Sale" })).toBeNull();
  },
};
