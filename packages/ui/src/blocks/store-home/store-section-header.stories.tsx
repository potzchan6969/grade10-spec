import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { StoreSectionHeader } from "./store-section-header";

const meta = {
  title: "Store/Home/Blocks/StoreSectionHeader",
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
  parameters: {
    verification: { caseId: "vc_22231a2d-ad35-44bc-8fc1-6965746f06fc" },
  },
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
  parameters: {
    verification: { caseId: "vc_42464416-7cdc-4983-abd0-597b41031325" },
  },
  args: { browseAllHref: undefined },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("link", { name: "Browse all" })).toBeNull();
  },
};

/** shared-ui-store-home-SC-10: a heading over a set with nothing to browse
 * names no word for a link it never draws — even handed a destination, the
 * absent word alone keeps the link off. */
export const NoBrowseLabel: Story = {
  parameters: {
    verification: { caseId: "vc_d7dedb65-cc5d-42f9-9aba-fefcb4c5e886" },
  },
  args: { copy: {} },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { name: "Collections" }),
    ).toBeInTheDocument();
    expect(canvas.queryByRole("link")).toBeNull();
  },
};
