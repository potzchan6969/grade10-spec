import type { Meta, StoryObj } from "@storybook/react-vite";
import { Chip } from "./chip";

const meta = {
  title: "Design System/Forms/Chip",
  component: Chip,
  tags: ["autodocs"],
  args: { children: "Chip" },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Neutral chip for applied filters on the Product List page. */
export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_8ead7aa1-7b68-420b-afc9-65d9399b3efb" },
  },
};

/** Brand-coloured chip with primary inner glow on hover. */
export const Primary: Story = {
  parameters: {
    verification: { caseId: "vc_974430ca-b89b-4d7d-813d-31e9b669b41d" },
  },
  args: { variant: "primary" },
};

/** Longer applied-filter label from the Product List page. */
export const AppliedFilter: Story = {
  parameters: {
    verification: { caseId: "vc_23fee786-e26c-4ab2-a70b-8058d9dbae61" },
  },
  args: { children: "Pokémon" },
};
