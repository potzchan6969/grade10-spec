import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToastClose } from "./toast-close";

const meta = {
  title: "Design System/Overlays/ToastClose",
  component: ToastClose,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof ToastClose>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_1230bd67-755a-4d68-890d-8c0266106ddd" },
  },
};

/** Hover is a CSS pseudo-state — focus the control or hover it in the canvas. */
export const Hover: Story = {
  parameters: {
    verification: { caseId: "vc_f82b5c83-f624-4cb0-bb3a-f92fd1e4be54" },
    pseudo: { hover: true },
  },
};
