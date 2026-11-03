import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { G10LogoMono } from "./g10-logo-mono";

const meta = {
  title: "Design System/Display/G10LogoMono",
  component: G10LogoMono,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    className: "h-7 w-auto text-foreground",
  },
} satisfies Meta<typeof G10LogoMono>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Nav height: Figma draws the mark at `Size/size-7` (28px) in the bar. */
export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_c797f5c6-a825-45f7-8981-c5ad900a9278" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("img", { name: "Grade10" })).toBeInTheDocument();
  },
};

/** Footer height: Figma draws the mark at `Size/size-5` (20px) in the logo frame. */
export const FooterSize: Story = {
  parameters: {
    verification: { caseId: "vc_07215118-2a26-4d2e-a739-204630ae4ba1" },
  },
  args: { className: "h-5 w-auto text-primary-foreground" },
  decorators: [
    (Story) => (
      <div className="bg-background-inverse p-8">
        <Story />
      </div>
    ),
  ],
};

/** A parent that already names the home link can silence the mark. */
export const Decorative: Story = {
  parameters: {
    verification: { caseId: "vc_a4a203d8-abb6-4818-9029-2e43ce84e474" },
  },
  args: { "aria-hidden": true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("img")).toBeNull();
  },
};
