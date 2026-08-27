import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { IMAGE } from "./fixtures";
import { OrderHistoryLineItem } from "./order-history-line-item";

const meta = {
  title: "Store Order History/OrderHistoryLineItem",
  component: OrderHistoryLineItem,
  tags: ["autodocs"],
  args: {
    product: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5) × 2",
    total: "HK$210",
    imageSrc: IMAGE,
    imageAlt: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5)",
  },
} satisfies Meta<typeof OrderHistoryLineItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText("Pokémon TCG Sealed Booster Box – Abyss Eye (M5) × 2"),
    ).toBeVisible();
    expect(canvas.getByText("HK$210")).toBeVisible();
    const image = canvas.getByRole("img", {
      name: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5)",
    });
    expect(image).toBeVisible();

    const well = canvasElement.querySelector(
      '[data-slot="order-history-line-item-image"]',
    );
    const root = canvasElement.querySelector(
      '[data-slot="order-history-line-item"]',
    );
    expect(well).toBeTruthy();
    expect(root).toBeTruthy();
    const wellBox = well!.getBoundingClientRect();
    const rootBox = root!.getBoundingClientRect();
    // Square well whose height fills the row (Figma self-stretch + aspect 1).
    // Allow 2px for the card's border box vs the stretched content edge.
    expect(Math.round(wellBox.width)).toBe(Math.round(wellBox.height));
    expect(Math.abs(wellBox.height - rootBox.height)).toBeLessThanOrEqual(2);
  },
};

export const WithoutImage: Story = {
  args: { imageSrc: undefined, imageAlt: undefined },
};
