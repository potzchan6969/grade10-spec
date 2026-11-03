import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { VaultAssetStatus } from "./vault-asset-status";

/**
 * The badge layered over a vault asset card image — Figma `Vault Asset
 * status` (`7068:9960`). Only live listing states surface a badge;
 * In Vault renders nothing.
 */
const meta = {
  title: "Vault/Portfolio/Blocks/VaultAssetStatus",
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
  parameters: {
    verification: { caseId: "vc_fee22dd8-e96b-4cf9-95af-b00a133dc0bc" },
  },
  args: { status: "Live Auction" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Live Auction")).toBeVisible();
  },
};

export const Listed: Story = {
  parameters: {
    verification: { caseId: "vc_c3ca655e-0544-406a-b4a4-b68b1dd9d552" },
  },
  args: { status: "Listed" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Listed")).toBeVisible();
  },
};

/** Owner requested withdrawal; admin approval pending. */
export const RetrievalPending: Story = {
  parameters: {
    verification: { caseId: "vc_0b5d7dfd-0c7e-40d5-8fc1-fac62b0ced3e" },
  },
  args: { status: "Retrieval Pending" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Retrieval Pending")).toBeVisible();
  },
};

/** In Vault shows no badge — the card itself is the state. */
export const InVault: Story = {
  parameters: {
    verification: { caseId: "vc_8df24616-7628-4d96-b381-c9aa73746ec0" },
  },
  args: { status: "In Vault" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText("In Vault")).toBeNull();
  },
};
