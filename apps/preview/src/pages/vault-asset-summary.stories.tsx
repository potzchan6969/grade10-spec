import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { VaultAssetSummary } from "./vault-asset-summary";
import { VAULT_ASSET_DETAILS } from "./vault-content";

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
} satisfies Meta<typeof VaultAssetSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Graded asset summary — no grading prompt. */
export const Graded: Story = {
  args: {
    asset: VAULT_ASSET_DETAILS[0],
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

/** Raw asset summary — surfaces the grading value prompt. */
export const Raw: Story = {
  args: {
    asset: VAULT_ASSET_DETAILS[1],
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
