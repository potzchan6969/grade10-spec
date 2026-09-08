import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToastClose } from "./toast-close";

const meta = {
  title: "Components/Toast Close",
  component: ToastClose,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof ToastClose>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Hover is a CSS pseudo-state — focus the control or hover it in the canvas. */
export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
};
