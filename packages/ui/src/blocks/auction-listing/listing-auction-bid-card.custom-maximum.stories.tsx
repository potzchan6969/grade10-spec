import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { ListingAuctionBidCard } from "./listing-auction-bid-card";
import {
  BID_CARD_ARGS,
  BID_CARD_META,
  liveView,
} from "./listing-auction-bid-card.story-fixtures";

const meta = {
  component: ListingAuctionBidCard,
  title: "Auction/Bidding/Blocks/ListingAuctionBidCard/Custom Maximum",
  ...BID_CARD_META,
  args: { ...BID_CARD_ARGS, view: liveView() },
} satisfies Meta<typeof ListingAuctionBidCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Exercises the supplied HKD ceiling through native typing and paste.
 */
export const CustomMaximumCeiling: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Custom amount accepts the supplied HKD ceiling. A typed digit beyond it restores the previous draft, while paste clamps to the ceiling.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole("spinbutton", {
      name: "60,500 min.",
    });
    await userEvent.clear(field);
    await userEvent.type(field, "500");
    expect(field).toHaveValue(500);
    await userEvent.clear(field);
    await userEvent.type(field, "80000000");
    await userEvent.type(field, "1");
    expect(field).toHaveValue(80000000);
    await userEvent.clear(field);
    field.focus();
    await userEvent.paste("80000001");
    expect(field).toHaveValue(80000000);
    expect(canvas.queryByText(/^Min\.:/)).not.toBeInTheDocument();
  },
};

/**
 * A raise the server accepted clears the custom field. The raised maximum moves
 * the minimum above the submitted amount, so a kept draft would read as invalid.
 */
export const AcceptedRaiseClearsCustomField: Story = {
  render: (args) => {
    const [status, setStatus] = useState<"idle" | "pending">("idle");
    const [maximumMinor, setMaximumMinor] = useState(6_050_000);
    return (
      <ListingAuctionBidCard
        {...args}
        authorizationStatus={status}
        onCommitMaximum={(amountMinor) => {
          setStatus("pending");
          setTimeout(() => {
            setMaximumMinor(amountMinor);
            setStatus("idle");
          }, 50);
        }}
        view={liveView({
          standing: "leading-max",
          viewerMaximumMinor: maximumMinor,
        })}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole("spinbutton", {
      name: /min\./i,
    }) as HTMLInputElement;
    await userEvent.type(field, "70000");
    expect(field.value).toBe("70000");
    await userEvent.click(
      canvas.getByRole("button", { name: /^Raise maximum to/ }),
    );
    await waitFor(() => expect(field.value).toBe(""));
    expect(field).not.toHaveAttribute("aria-invalid", "true");
    expect(canvas.queryByRole("alert")).not.toBeInTheDocument();
  },
};

/**
 * Maximum at the currency ceiling: the entry group collapses to a status
 * row - chips, the custom field and the commit action leave the panel.
 *
 * Scenario: shared-ui-auction-listing-SC-64 - A maximum at the ceiling collapses the entry group
 */
export const MaximumAtCeiling: Story = {
  args: {
    view: liveView({
      currency: "HKD",
      standing: "leading-max",
      currentBidMinor: 5_800_000,
      viewerMaximumMinor: 8_000_000_000,
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Max: HK$80,000,000")).toBeInTheDocument();
    expect(
      canvas.getByText("This is the highest maximum this auction accepts."),
    ).toBeInTheDocument();
    expect(canvas.queryByRole("spinbutton")).not.toBeInTheDocument();
    expect(canvas.queryByRole("group")).not.toBeInTheDocument();
    expect(
      canvas.getByText("Buyer’s premium: 20% of the winning bid"),
    ).toBeInTheDocument();
  },
};

/**
 * No maximum held while the lot's minimum next bid passes the ceiling: the
 * collapsed row carries the ceiling amount.
 *
 * Scenario: shared-ui-auction-listing-SC-65 - A lot priced past the ceiling offers no entry
 */
export const LotAtCeilingWithoutMaximum: Story = {
  args: {
    view: liveView({
      currency: "HKD",
      standing: "none",
      currentBidMinor: 7_999_995_000,
      minBidMinor: 8_000_005_000,
      incrementMinor: 10_000,
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("HK$80,000,000")).toBeInTheDocument();
    expect(
      canvas.getByText(
        "Bidding has reached HK$80,000,000, the highest this auction accepts.",
      ),
    ).toBeInTheDocument();
    expect(canvas.queryByRole("spinbutton")).not.toBeInTheDocument();
    expect(canvas.queryByRole("group")).not.toBeInTheDocument();
  },
};

/**
 * Near the ceiling a stepped chip above it lands on it, captioned as the
 * limit, and chips merged onto one amount leave one chip.
 *
 * Scenario: shared-ui-auction-listing-SC-61 - A chip stepping past the ceiling is offered at the ceiling
 * Scenario: shared-ui-auction-listing-SC-62 - Chips that clamp to the same amount merge to one
 */
export const ChipsClampedAtCeiling: Story = {
  args: {
    view: liveView({
      currency: "HKD",
      standing: "leading-max",
      currentBidMinor: 5_800_000,
      viewerMaximumMinor: 7_999_970_000,
      incrementMinor: 10_000,
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = canvas.getByRole("group");
    const chips = within(group).getAllByRole("button");
    expect(chips).toHaveLength(3);
    expect(canvas.getByText("HK$79,999,800")).toBeInTheDocument();
    expect(canvas.getByText("HK$79,999,900")).toBeInTheDocument();
    expect(canvas.getByText("HK$80,000,000")).toBeInTheDocument();
    expect(canvas.getByText("Limit")).toBeInTheDocument();
    for (const chip of chips) {
      expect(chip).not.toHaveTextContent(/80,000,0[1-9]|8[1-9],/);
    }
  },
};
