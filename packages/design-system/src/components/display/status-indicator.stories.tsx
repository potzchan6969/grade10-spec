import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusIndicator } from "./status-indicator";

const meta = {
  title: "Design System/Display/StatusIndicator",
  component: StatusIndicator,
  tags: ["autodocs"],
  argTypes: {
    type: { control: "inline-radio", options: ["dot", "count"] },
    variant: {
      control: "inline-radio",
      options: ["default", "error", "brand"],
    },
  },
} satisfies Meta<typeof StatusIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_83373b3a-3fe7-47b2-b725-6b7dd1c4ea43" },
  },
};

export const DotError: Story = {
  parameters: {
    verification: { caseId: "vc_7325ecb0-41de-4fd0-95a1-f30b0a0b4e7e" },
  },
  args: { variant: "error" },
};

export const DotBrand: Story = {
  parameters: {
    verification: { caseId: "vc_5a67cac0-aacd-496d-be2c-c745e2e50f1e" },
  },
  args: { variant: "brand" },
};

/** Count contents are consumer-supplied — Figma's default `1` is not a fallback. */
export const Count: Story = {
  parameters: {
    verification: { caseId: "vc_ee67dc79-e888-47fb-bf79-b4a7391846a9" },
  },
  args: { type: "count", children: "1" },
};

export const CountError: Story = {
  parameters: {
    verification: { caseId: "vc_ec76639b-cbbf-490f-8cb5-12934b8accc7" },
  },
  args: { type: "count", variant: "error", children: "1" },
};

export const CountBrand: Story = {
  parameters: {
    verification: { caseId: "vc_d962bf99-5ee9-4569-a12b-dddc3bccb9bc" },
  },
  args: { type: "count", variant: "brand", children: "1" },
};

export const CountSupplied: Story = {
  parameters: {
    verification: { caseId: "vc_50d25b36-dbd5-4f2f-9d8b-2431b65ac794" },
  },
  args: { type: "count", children: "12" },
};
