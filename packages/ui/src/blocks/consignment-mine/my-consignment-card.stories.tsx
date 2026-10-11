import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { MINE_CARD_COPY, MINE_SUMMARIES } from "./fixtures";
import { MyConsignmentCard } from "./my-consignment-card";

const [ON_SALE, OWED, PAID] = MINE_SUMMARIES;

const meta = {
  title: "Consignment Mine/MyConsignmentCard",
  component: MyConsignmentCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { copy: MINE_CARD_COPY, consignment: ON_SALE, onOpen: fn() },
} satisfies Meta<typeof MyConsignmentCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** On sale, nothing owed or paid: one row, and Open reports its reference. */
export const OnSale: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Consignment CN-2026-0042")).toBeInTheDocument();
    expect(canvas.getByText("2 items")).toBeInTheDocument();
    expect(canvas.queryByText("Your payout")).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "Open" }));
    expect(args.onOpen).toHaveBeenCalledWith("CN-2026-0042");
  },
};

/** A payout on its way: the owed row reads. */
export const Owed: Story = {
  args: { consignment: OWED },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Owed to you: HK$5,525.00")).toBeInTheDocument();
  },
};

/** Closed and paid: the paid row reads. */
export const Paid: Story = {
  args: { consignment: PAID },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Paid to you: HK$18,400.00")).toBeInTheDocument();
  },
};
