import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { VaultAssetStatus } from "./vault-asset-status";

/**
 * The badge layered over a vault asset card image — Figma `Vault Asset
 * status` (`7068:9960`). Only live listing states surface a badge;
 * In Vault renders nothing.
 */
const meta = {
  title: "Vault/Asset Status",
  component: VaultAssetStatus,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="relative h-24 w-40 rounded-2xl border border-border bg-background-subtle">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof VaultAssetStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LiveAuction: Story = {
  args: { status: "Live Auction" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Live Auction")).toBeVisible();
  },
};

export const Listed: Story = {
  args: { status: "Listed" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Listed")).toBeVisible();
  },
};

/** Owner requested withdrawal; admin approval pending. */
export const RetrievalPending: Story = {
  args: { status: "Retrieval Pending" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Retrieval Pending")).toBeVisible();
  },
};

/** In Vault shows no badge — the card itself is the state. */
export const InVault: Story = {
  args: { status: "In Vault" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText("In Vault")).toBeNull();
  },
};
