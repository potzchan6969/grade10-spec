import type { Meta, StoryObj } from "@storybook/react-vite";
import { Chip } from "./chip";

const meta = {
  title: "Components/Chip",
  component: Chip,
  tags: ["autodocs"],
  args: { children: "Chip" },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Neutral chip for applied filters on the Product List page. */
export const Default: Story = {};

/** Brand-coloured chip with primary inner glow on hover. */
export const Primary: Story = {
  args: { variant: "primary" },
};

/** Longer applied-filter label from the Product List page. */
export const AppliedFilter: Story = {
  args: { children: "Pokémon" },
};
