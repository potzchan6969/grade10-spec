import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { MINE_TERMS_COPY, PINNED_TERMS } from "./fixtures";
import { MyConsignmentTerms } from "./my-consignment-terms";

const meta = {
  title: "Consignment Mine/MyConsignmentTerms",
  component: MyConsignmentTerms,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { copy: MINE_TERMS_COPY, terms: PINNED_TERMS },
} satisfies Meta<typeof MyConsignmentTerms>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Pinned: every term a row, the channels a line each. */
export const Pinned: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("region", { name: "Your terms" })).toBeVisible();
    expect(canvas.getByText("10% above that")).toBeInTheDocument();
    expect(canvas.getByText("At auction: At the sale")).toBeInTheDocument();
  },
};

/** No rate set for either channel. */
export const RatesNotSet: Story = {
  args: {
    terms: { ...PINNED_TERMS, storeCommission: [], auctionCommission: null },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getAllByText("Not set")).toHaveLength(2);
  },
};

/** Before the agreement is prepared. */
export const NotPinned: Story = {
  args: { terms: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText(
        "Your terms are pinned when your agreement is prepared.",
      ),
    ).toBeInTheDocument();
  },
};
