import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  GRADING_IN_PROGRESS_ITEMS,
  VAULT_COMPLETED_ITEMS,
  VAULT_IN_PROGRESS_ITEMS,
} from "../intake-content";
import { IntakeItemCard } from "./intake-item-card";

const meta = {
  title: "Vault/Collector Pages/Parts/IntakeItemCard",
  component: IntakeItemCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    item: VAULT_IN_PROGRESS_ITEMS[0],
  },
} satisfies Meta<typeof IntakeItemCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InScanning: Story = {
  args: {
    item: VAULT_IN_PROGRESS_ITEMS[0],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("ITM-99482-01")).toBeVisible();
    expect(canvas.getByText("Vault – In Scanning")).toBeVisible();
    expect(canvas.getByText("PSA 10 (#63261275)")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "View in Vault" }),
    ).toBeDisabled();

    expect(
      canvas.getByRole("button", {
        name: /Scan of 1997 Pocket Monsters Carddass Charizard/,
      }),
    ).toBeVisible();
  },
};

export const Vaulted: Story = {
  args: {
    item: VAULT_COMPLETED_ITEMS[0],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Vault – Vaulted")).toBeVisible();
    expect(canvas.getByRole("button", { name: "View in Vault" })).toBeEnabled();
  },
};

/**
 * Boneyard skeleton while the submissions fetch settles — also the capture
 * target for `boneyard-js build` (story id `vault-collector-pages-parts-intakeitemcard--loading`,
 * at the card's full page width).
 */
export const Loading: Story = {
  args: { item: VAULT_IN_PROGRESS_ITEMS[0], loading: true },
  render: ({ item }) => (
    <div className="w-full max-w-5xl">
      <IntakeItemCard item={item} loading />
    </div>
  ),
};

export const GradingInTransit: Story = {
  args: {
    item: GRADING_IN_PROGRESS_ITEMS[0],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("ITM-99110-01")).toBeVisible();
    expect(canvas.getByText("Grading – In Transit")).toBeVisible();
    expect(canvas.queryByRole("button", { name: "View in Vault" })).toBeNull();
  },
};
