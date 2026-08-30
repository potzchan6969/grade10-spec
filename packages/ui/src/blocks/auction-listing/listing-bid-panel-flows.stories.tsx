import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { AutomaticBiddingListingDemo } from "./automatic-bidding-demo";
import { LiveCountdownDemo } from "./live-countdown-demo";

const meta = {
  title: "Auction Listing/ListingBidPanel/Flows",
  component: LiveCountdownDemo,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof LiveCountdownDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Countdown: Story = {
  render: () => <LiveCountdownDemo />,
};

export const FirstMaximum: Story = {
  render: () => <AutomaticBiddingListingDemo mode="first" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Place Bid" }));

    expect(
      canvas.getByRole("heading", { name: "Set your automatic maximum" }),
    ).toBeInTheDocument();
    expect(canvas.getByText("Current bid: HK$1,200.00")).toBeInTheDocument();
    expect(
      canvas.getByText(
        "We'll bid automatically only as needed, up to your maximum.",
      ),
    ).toBeInTheDocument();

    const maximum = canvas.getByRole("spinbutton", {
      name: "Maximum amount",
    });
    await userEvent.type(maximum, "8000");
    await userEvent.click(canvas.getByRole("button", { name: "Set maximum" }));

    expect(
      canvas.getByText(
        "Your card hold covers HK$8,000.00. You may pay less if the auction ends below your maximum.",
      ),
    ).toBeInTheDocument();
  },
};

export const RaiseMaximum: Story = {
  render: () => <AutomaticBiddingListingDemo mode="leading" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole("button", { name: "Raise maximum" }),
    );

    expect(
      canvas.getByRole("heading", { name: "Raise your automatic maximum" }),
    ).toBeInTheDocument();
    expect(canvas.getByText("Current bid: HK$4,800.00")).toBeInTheDocument();
    expect(canvas.getByText("Your maximum: HK$8,000.00")).toBeInTheDocument();

    const maximum = canvas.getByRole("spinbutton", {
      name: "Maximum amount",
    });
    await userEvent.type(maximum, "10000");
    await userEvent.click(
      canvas.getByRole("button", { name: "Raise maximum" }),
    );

    expect(
      canvas.getByText(
        "Your card hold covers HK$10,000.00. You may pay less if the auction ends below your maximum.",
      ),
    ).toBeInTheDocument();
  },
};

export const OvertakenMaximum: Story = {
  render: () => <AutomaticBiddingListingDemo mode="overtaken" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Your maximum is unchanged")).toBeInTheDocument();
    expect(canvas.getByText("Outbid")).toBeInTheDocument();
    expect(canvas.getByText("HK$8,000.00")).toBeInTheDocument();
  },
};

export const AcceptedNotLeadingMaximum: Story = {
  render: () => <AutomaticBiddingListingDemo mode="accepted-not-leading" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Accepted — not leading")).toBeInTheDocument();
    expect(canvas.getByText("Accepted")).toBeInTheDocument();
    expect(canvas.queryByText("Error")).toBeNull();
  },
};
