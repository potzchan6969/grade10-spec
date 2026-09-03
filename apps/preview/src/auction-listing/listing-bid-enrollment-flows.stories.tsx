import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { BIDDING_CASES, BidPanelBiddingDemo } from "./bid-panel-bidding-demo";
import { BidPanelCountdownDemo } from "./bid-panel-countdown-demo";
import { ListingBidEnrollmentInteractiveDemo } from "./listing-bid-enrollment-demo";

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
      canvas.queryByRole("button", { name: /^Place Bid/ }),
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

export const Bidding: Story = {
  render: () => <BidPanelBiddingDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const next = canvas.getByRole("button", { name: "Next" });

    expect(canvas.getAllByText("Starting bid").length).toBeGreaterThan(0);
    expect(canvas.getByText("Set your private maximum")).toBeVisible();
    expect(canvas.getByText("Min. bid")).toBeVisible();
    expect(canvas.queryByText("Highest bid")).not.toBeInTheDocument();
    expect(canvas.queryByText("Outbid")).not.toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: /^Place Bid/ }));
    await waitFor(() => {
      expect(
        within(document.body).getByRole("dialog", {
          name: "Confirm Auto-Bidding",
        }),
      ).toBeVisible();
    });
    const autoConfirm = within(document.body).getByRole("dialog", {
      name: "Confirm Auto-Bidding",
    });
    await userEvent.click(
      within(autoConfirm).getByRole("button", { name: "Cancel" }),
    );
    expect(
      within(document.body).queryByRole("dialog", {
        name: "Confirm Auto-Bidding",
      }),
    ).not.toBeInTheDocument();

    await userEvent.click(next);
    expect(canvas.getAllByText(/HK\$1,200/).length).toBeGreaterThan(0);

    await userEvent.click(next);
    expect(canvas.getAllByText(/HK\$1,250/).length).toBeGreaterThan(0);
    expect(canvas.getByText("2 bids")).toBeVisible();

    await userEvent.click(next);
    expect(canvas.getByText("Highest bid")).toBeVisible();
    expect(canvas.getAllByText(/HK\$1,300/).length).toBeGreaterThan(0);
    expect(canvas.getByText("You")).toBeVisible();

    await userEvent.click(next);
    expect(canvas.getByText("Outbid")).toBeVisible();
    expect(canvas.getAllByText(/HK\$1,400/).length).toBeGreaterThan(0);

    await userEvent.click(next);
    expect(canvas.getByText("Highest bid")).toBeVisible();

    await userEvent.click(next);
    expect(canvas.getByText("Outbid")).toBeVisible();
    expect(canvas.getAllByText(/HK\$1,600/).length).toBeGreaterThan(0);
    expect(canvas.getByText("6 bids")).toBeVisible();

    await userEvent.click(next);
    expect(canvas.getByText("Set a first maximum")).toBeVisible();
    expect(canvas.getByText("Set your private maximum")).toBeVisible();
    expect(canvas.getByText("Min. bid")).toBeVisible();

    await userEvent.click(next);
    expect(canvas.getByText("Leading with a maximum")).toBeVisible();
    expect(canvas.getByText("Highest bid")).toBeVisible();
    expect(canvas.getByText(/Raise your private maximum/)).toBeVisible();

    await userEvent.click(next);
    expect(canvas.getByText("Maximum overtaken")).toBeVisible();
    expect(canvas.getByText("Outbid")).toBeVisible();

    await userEvent.click(next);
    expect(canvas.getByText("Maximum accepted · not leading")).toBeVisible();
    expect(canvas.getByText("Outbid")).toBeVisible();

    await userEvent.click(canvas.getByRole("tab", { name: "Expanded" }));
    expect(
      canvas.getAllByRole("button", {
        name: /^(Place Bid|Raise maximum)/,
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
