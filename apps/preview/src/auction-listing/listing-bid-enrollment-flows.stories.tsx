import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { BidPanelCountdownDemo } from "./bid-panel-countdown-demo";

const meta = {
  title: "Auction Listing/Bid Panel/Flows",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Countdown: Story = {
  render: () => <BidPanelCountdownDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const next = canvas.getByRole("button", { name: "Next" });

    expect(canvas.getByText("15 minutes")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Sign In to Bid" }),
    ).toBeVisible();
    expect(canvas.getByText("Time left")).toBeVisible();
    expect(canvas.getByText("Recent Bids")).toBeVisible();
    expect(
      canvas.queryByRole("button", { name: "Place Bid" }),
    ).not.toBeInTheDocument();

    await userEvent.click(next);
    expect(canvas.getByText("30 minutes · extension evaluation")).toBeVisible();

    await userEvent.click(next);
    expect(canvas.getByText("1 day 5 seconds · zero day")).toBeVisible();
    expect(canvas.getByText(/\dd/)).toBeVisible();

    await userEvent.click(next);
    await userEvent.click(next);
    await userEvent.click(next);
    expect(canvas.getByText("15 minutes · extension started")).toBeVisible();
    expect(canvas.getByText("Time left (auto-extended)")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Sign In to Bid" }),
    ).toBeVisible();

    await userEvent.click(canvas.getByRole("tab", { name: "Expanded" }));
    expect(
      canvas.getAllByRole("button", { name: "Sign In to Bid" }),
    ).toHaveLength(7);
  },
};
