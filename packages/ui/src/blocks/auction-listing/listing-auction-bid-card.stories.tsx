import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { ListingAuctionBidCard } from "./listing-auction-bid-card";
import {
  BID_CARD_ARGS,
  BID_CARD_META,
  HISTORY,
  liveView,
  NOW_MS,
} from "./listing-auction-bid-card.story-fixtures";

const meta = {
  component: ListingAuctionBidCard,
  title: "Auction/Bidding/Blocks/ListingAuctionBidCard",
  ...BID_CARD_META,
  args: { ...BID_CARD_ARGS, view: liveView() },
} satisfies Meta<typeof ListingAuctionBidCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Live lot: no winner crown, and the equal-max non-leader carries the tip.
 *
 * Scenario: shared-ui-auction-listing-SC-50 - Closed sold Recent bids show a winner crown
 * Scenario: shared-ui-auction-listing-SC-51 - Equal-max non-leader shows earlier-leads tip
 */
export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_7d5f059a-62f3-44a3-9c48-7285454baa46" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Current Bid")).toBeInTheDocument();
    expect(canvas.getByText("Set your private maximum")).toBeInTheDocument();
    expect(canvas.getByText("Min. bid")).toBeInTheDocument();
    expect(canvas.getByPlaceholderText("60,500 min.")).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: /^Set maximum to/ }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: /^Maximum /, pressed: true }),
    ).toBeInTheDocument();
    expect(canvas.getByText("Recent Bids")).toBeInTheDocument();
    expect(canvas.queryByLabelText("Winner")).not.toBeInTheDocument();
    expect(
      canvas.getByLabelText("When maximums match, the earlier one leads."),
    ).toBeInTheDocument();
  },
};

export const SignedOut: Story = {
  parameters: {
    verification: { caseId: "vc_6de5f3eb-15a4-4d50-ac03-47be2d49fa53" },
  },
  args: {
    bidEnrollment: "signed-out",
    history: HISTORY.map((row) => ({ ...row, isViewer: false })),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: "Sign In to Bid" }),
    ).toBeInTheDocument();
    expect(canvas.queryByText("Min. bid")).not.toBeInTheDocument();
    expect(canvas.queryByText("Leading")).not.toBeInTheDocument();
    expect(canvas.queryByText("Outbid")).not.toBeInTheDocument();
  },
};

const openSetupFromNeedsCard = fn();

const commitMaximumFromNeedsCard = fn();

export const NeedsCard: Story = {
  parameters: {
    verification: { caseId: "vc_0e873e8a-2a99-4d10-b20c-6a5a6b344db1" },
  },
  args: {
    bidEnrollment: "needs-card",
    onCommitMaximum: commitMaximumFromNeedsCard,
    onPlaceBid: openSetupFromNeedsCard,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const amountGroup = canvas.getByRole("group");
    for (const preset of within(amountGroup).getAllByRole("button")) {
      expect(preset).toBeDisabled();
    }
    expect(
      canvas.getByRole("spinbutton", { name: "60,500 min." }),
    ).toBeDisabled();

    await userEvent.click(
      canvas.getByRole("button", { name: "Link a card to bid" }),
    );
    expect(openSetupFromNeedsCard).toHaveBeenCalledOnce();
    expect(commitMaximumFromNeedsCard).not.toHaveBeenCalled();
  },
};

const commitMaximumWhenReady = fn();

export const Ready: Story = {
  parameters: {
    verification: { caseId: "vc_a9522883-a781-45a8-91d2-465e56461529" },
  },
  args: {
    bidEnrollment: "ready",
    onCommitMaximum: commitMaximumWhenReady,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const commitButton = canvas.getByRole("button", {
      name: /^Set maximum to/,
    });
    expect(commitButton).toBeEnabled();
    await userEvent.click(commitButton);
    expect(commitMaximumWhenReady).toHaveBeenCalledOnce();
    expect(commitMaximumWhenReady).toHaveBeenCalledWith(6_300_000);
  },
};

export const Outbid: Story = {
  parameters: {
    verification: { caseId: "vc_44c71f20-ae95-4ccf-9b22-567c3a6cd0f3" },
  },
  args: {
    view: liveView({
      standing: "outbid",
      currentBidMinor: 9_750_000,
      minBidMinor: 10_000_000,
      viewerMaximumMinor: 9_500_000,
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Outbid · US\$95,000/)).toBeInTheDocument();
  },
};

export const Leading: Story = {
  parameters: {
    verification: { caseId: "vc_8ee05417-f337-432f-b4c5-bd8011607b9c" },
  },
  args: {
    view: liveView({
      standing: "leading-max",
      viewerMaximumMinor: 9_500_000,
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Leading · US\$58,000/)).toBeInTheDocument();
    expect(canvas.getByText("Raise your private maximum")).toBeInTheDocument();
    expect(canvas.getByText(/Max: US\$95,000/)).toBeInTheDocument();
    expect(canvas.queryByText("Min. bid")).not.toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: /^Raise maximum to/ }),
    ).toBeInTheDocument();
    expect(canvas.getAllByText(/vs max/)).toHaveLength(3);
    expect(canvas.queryByText(/vs current/)).not.toBeInTheDocument();
    expect(canvas.getByText("US$97,500")).toBeInTheDocument();
    expect(canvas.getByText("US$100,000")).toBeInTheDocument();
    expect(canvas.getByText("US$105,000")).toBeInTheDocument();
    expect(canvas.queryByText("US$95,001")).not.toBeInTheDocument();
    expect(canvas.getByPlaceholderText("95,001 min.")).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: /^Raise maximum to US\$100,000/ }),
    ).toBeInTheDocument();
  },
};

export const ExtendedBidding: Story = {
  args: {
    view: liveView({
      extended: true,
      countdown: "29m 58s",
      countdownSeconds: 1798,
    }),
  },
  parameters: {
    verification: { caseId: "vc_f288430a-1b66-467c-877a-681baa5cb007" },
    docs: {
      description: {
        story:
          "Past scheduled close with extended bidding on. Time left label reads Time left (extended); the info tooltip explains the post-close timer restart.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getAllByText("Time left (extended)").length).toBeGreaterThan(
      0,
    );
    expect(
      canvas.getAllByLabelText(
        /After the scheduled close, each bid restarts a 30-minute timer/,
      ).length,
    ).toBeGreaterThan(0);
  },
};

export const Opens: Story = {
  parameters: {
    verification: { caseId: "vc_db10fed5-4715-436e-9f2a-b100d39c20a4" },
  },
  args: {
    history: [],
    bidEnrollment: undefined,
    view: liveView({
      headerLabel: "Opens soon",
      live: false,
      opens: true,
      hasBids: false,
      showBidActions: false,
      priceLabel: "",
      currentBidMinor: 4_800_000,
      bidCount: 0,
      bidCountLabel: "0 bids",
      countdown: "2D 4H 12M 0S",
      countdownSeconds: 2 * 24 * 60 * 60 + 4 * 60 * 60 + 12 * 60,
      countdownFormat: "long",
      closesAtMs: null,
      deadlineAtMs: NOW_MS + 2 * 24 * 60 * 60 * 1000,
      standing: "none",
      minBidMinor: 4_800_000,
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText("Opens soon")).not.toBeInTheDocument();
    expect(canvas.getByText("Opens in")).toBeInTheDocument();
    expect(canvas.queryByText("Starting bid")).not.toBeInTheDocument();
    const reachable = canvas
      .queryAllByText("No bids yet")
      .filter((element) => element.closest("[inert]") == null);
    expect(reachable).toHaveLength(0);
  },
};

export const LiveNoBids: Story = {
  parameters: {
    verification: { caseId: "vc_ff0b6a9e-3d49-4b45-9ffd-ec3eb81a0d89" },
  },
  args: {
    history: [],
    view: liveView({
      hasBids: false,
      priceLabel: "Starting bid",
      currentBidMinor: 4_800_000,
      bidCount: 0,
      bidCountLabel: "0 bids",
      standing: "none",
      minBidMinor: 4_800_000,
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Starting bid")).toBeInTheDocument();
    expect(canvas.getAllByText("No bids yet").length).toBeGreaterThan(0);
    expect(canvas.getByText("Min. bid").closest("button")).toHaveTextContent(
      "US$48,000",
    );
  },
};

export const SuspendedBidderRefusal: Story = {
  parameters: {
    verification: { caseId: "vc_67c29cdb-5d2d-4a5d-92aa-0cef012655d6" },
  },
  name: "Suspended bidder refusal (TBC)",
  args: {
    authorizationStatus: "error",
    authorizationMessage:
      "Your account remains suspended from auction bidding. Contact Grade10 support if you need help.",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText(
        "Your account remains suspended from auction bidding. Contact Grade10 support if you need help.",
      ),
    ).toBeVisible();
    expect(
      canvas.getByRole("button", { name: /^Set maximum to/ }),
    ).toBeVisible();
    expect(canvas.getByText("Recent Bids")).toBeVisible();
  },
};
