import type { Meta, StoryObj } from "@storybook/react-vite";
import { StoreHeader } from "./store-header";

const meta = {
  title: "Components/StoreHeader",
  component: StoreHeader,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof StoreHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Omit `promo` and the utility bar is the top edge. */
export const WithoutPromo: Story = { args: { promo: null } };
