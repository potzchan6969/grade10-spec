import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import {
  GRADING_IN_PROGRESS_ITEMS,
  VAULT_COMPLETED_ITEMS,
  VAULT_IN_PROGRESS_ITEMS,
} from "./intake-content";
import { IntakeItemCard } from "./intake-item-card";

const meta = {
  title: "Pages/Submissions/Item Card",
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
    expect(canvas.getByText("In Scanning")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Vault receipt" }),
    ).toBeDisabled();

    const scanButton = canvas.getByRole("button", {
      name: /Scan of 1997 Pocket Monsters Carddass Charizard/,
    });
    scanButton.focus();
    await userEvent.keyboard(" ");
    await waitFor(() => {
      expect(
        within(document.body).getByRole("dialog", {
          name: "1997 Pocket Monsters Carddass Charizard",
        }),
      ).toBeVisible();
    });
  },
};

export const Vaulted: Story = {
  args: {
    item: VAULT_COMPLETED_ITEMS[0],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Vaulted")).toBeVisible();
    expect(canvas.getByRole("button", { name: "Vault receipt" })).toBeEnabled();
    expect(
      canvas.getByRole("button", { name: "View in vault portfolio" }),
    ).toBeVisible();
  },
};

export const GradingInTransit: Story = {
  args: {
    item: GRADING_IN_PROGRESS_ITEMS[0],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("ITM-99110-01")).toBeVisible();
    expect(canvas.getByText("In Transit")).toBeVisible();
    expect(canvas.queryByRole("button", { name: "Vault receipt" })).toBeNull();
  },
};

export const Interactive: Story = {
  args: {
    item: VAULT_IN_PROGRESS_ITEMS[0],
    onOpen: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const cardLink = canvas.getByRole("link", {
      name: /1997 Pocket Monsters Carddass Charizard/,
    });
    cardLink.focus();
    await userEvent.keyboard("{Enter}");
    expect(args.onOpen).toHaveBeenCalledTimes(1);
  },
};
