import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { StoreSectionHeader } from "./store-section-header";

const meta = {
  title: "Store Home/StoreSectionHeader",
  component: StoreSectionHeader,
  tags: ["autodocs"],
  args: {
    copy: { browseAll: "Browse all" },
    title: "Collections",
    browseAllHref: "#collections",
  },
} satisfies Meta<typeof StoreSectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { name: "Collections" }),
    ).toBeInTheDocument();
    expect(canvas.getByRole("link", { name: "Browse all" })).toHaveAttribute(
      "href",
      "#collections",
    );
  },
};

export const NoBrowseLink: Story = {
  args: { browseAllHref: undefined },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("link", { name: "Browse all" })).toBeNull();
  },
};
