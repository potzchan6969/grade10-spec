import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { BIDDING_CASES, BidPanelBiddingDemo } from "./bid-panel-bidding-demo";
import { BidPanelCountdownDemo } from "./bid-panel-countdown-demo";
import { ListingBidEnrollmentInteractiveDemo } from "./listing-bid-enrollment-demo";

const meta = {
  title: "Auction Listing/Bid Panel/Flows",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function getStandingText(
  canvas: ReturnType<typeof within>,
  standing: "Leading" | "Outbid",
) {
  return canvas.getByText(
    (text: string) => text === standing || text.startsWith(`${standing} ·`),
  );
}

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
      canvas.queryByRole("button", { name: /^Set maximum/ }),
    ).not.toBeInTheDocument();

    await userEvent.click(next);
    expect(canvas.getByText("30 minutes")).toBeVisible();

    await userEvent.click(next);
    expect(canvas.getByText("1 day 5 seconds · zero day")).toBeVisible();
    expect(canvas.getByText(/\dd/)).toBeVisible();

    await userEvent.click(next);
    await userEvent.click(next);
    await userEvent.click(next);
    expect(canvas.getByText("15 minutes · extended bidding")).toBeVisible();
    expect(canvas.getByText("Time left (extended)")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Sign In to Bid" }),
    ).toBeVisible();

    await userEvent.click(canvas.getByRole("tab", { name: "Expanded" }));
    expect(
      canvas.getAllByRole("button", { name: "Sign In to Bid" }),
    ).toHaveLength(7);
  },
};

export const Bidding: Story = {
  render: () => <BidPanelBiddingDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const next = canvas.getByRole("button", { name: "Next" });

    expect(canvas.getAllByText("Starting bid").length).toBeGreaterThan(0);
    expect(canvas.getByText("Set your private maximum")).toBeVisible();
    expect(canvas.getByText("Min. bid")).toBeVisible();
    expect(
      canvas.getByText(
        "We bid only as needed up to your maximum. Hold matches it; you can raise, not lower or cancel.",
      ),
    ).toBeVisible();
    expect(canvas.queryByText("Leading")).not.toBeInTheDocument();
    expect(canvas.queryByText("Outbid")).not.toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: /^Set maximum/ }));

    await userEvent.click(next);
    expect(canvas.getAllByText(/HK\$48,000/).length).toBeGreaterThan(0);

    await userEvent.click(next);
    expect(canvas.getAllByText(/HK\$50,500/).length).toBeGreaterThan(0);
    expect(canvas.getByText("2 bids")).toBeVisible();

    await userEvent.click(next);
    expect(getStandingText(canvas, "Leading")).toBeVisible();
    expect(canvas.getAllByText(/HK\$53,000/).length).toBeGreaterThan(0);
    expect(canvas.getByText("You")).toBeVisible();

    await userEvent.click(next);
    expect(getStandingText(canvas, "Outbid")).toBeVisible();
    expect(canvas.getAllByText(/HK\$55,500/).length).toBeGreaterThan(0);

    await userEvent.click(next);
    expect(getStandingText(canvas, "Leading")).toBeVisible();

    await userEvent.click(next);
    expect(getStandingText(canvas, "Outbid")).toBeVisible();
    expect(canvas.getAllByText(/HK\$60,500/).length).toBeGreaterThan(0);
    expect(canvas.getByText("6 bids")).toBeVisible();

    await userEvent.click(next);
    expect(canvas.getByText("Set a first maximum")).toBeVisible();
    expect(canvas.getByText("Set your private maximum")).toBeVisible();
    expect(canvas.getByText("Min. bid")).toBeVisible();

    await userEvent.click(next);
    expect(canvas.getByText("Leading with a maximum")).toBeVisible();
    expect(getStandingText(canvas, "Leading")).toBeVisible();
    expect(canvas.getByText(/Raise your private maximum/)).toBeVisible();

    await userEvent.click(next);
    expect(canvas.getByText("Maximum overtaken")).toBeVisible();
    expect(getStandingText(canvas, "Outbid")).toBeVisible();

    await userEvent.click(next);
    expect(canvas.getByText("Maximum accepted · not leading")).toBeVisible();
    expect(getStandingText(canvas, "Outbid")).toBeVisible();

    await userEvent.click(canvas.getByRole("tab", { name: "Expanded" }));
    expect(
      canvas.getAllByRole("button", {
        name: /^(Bid now|Set maximum|Raise maximum)/,
      }),
    ).toHaveLength(BIDDING_CASES.length);
  },
};

export const Interactive: Story = {
  render: () => (
    <div className="mx-auto w-full max-w-md p-8">
      <ListingBidEnrollmentInteractiveDemo />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: "Sign In to Bid" }),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Reset" }));
  },
};
