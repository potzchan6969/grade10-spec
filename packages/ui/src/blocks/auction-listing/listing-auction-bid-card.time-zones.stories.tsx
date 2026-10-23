import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { FIXTURE_ALT_TIME_ZONE } from "../../lib/datetime-fixtures";
import { ListingAuctionBidCard } from "./listing-auction-bid-card";
import {
  BID_CARD_ARGS,
  BID_CARD_META,
  liveView,
  NOW_MS,
} from "./listing-auction-bid-card.story-fixtures";
import type { ListingAuctionBidView } from "./types";

const meta = {
  component: ListingAuctionBidCard,
  title: "Auction/Bidding/Blocks/ListingAuctionBidCard/Time Zones",
  ...BID_CARD_META,
  args: { ...BID_CARD_ARGS, view: liveView() },
} satisfies Meta<typeof ListingAuctionBidCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The deadline line of an open lot names the viewer's own zone: the same close
 * reads `20:00 HKT` in Hong Kong (`DeadlineZoneHongKong`) and `08:00 EDT` here.
 *
 * Scenario: shared-dates-and-times-SC-12 - The auction page shows a close
 * Scenario: shared-dates-and-times-SC-29 - Two collectors read different collector clocks
 * Case: shared-dates-and-times-US1-TC10-1
 */
export const ViewerZoneNewYork: Story = {
  parameters: {
    verification: { caseId: "vc_120367d6-8c53-4c07-bc3f-f21138fa1b1e" },
  },
  args: {
    timeZone: FIXTURE_ALT_TIME_ZONE,
    view: liveView({ deadlineAtMs: Date.UTC(2027, 8, 1, 12, 0) }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Ends 1 Sep 2027, 08:00 EDT")).toBeInTheDocument();
    expect(canvas.queryByText(/HKT|\bUTC\b/)).not.toBeInTheDocument();
  },
};

const SEPTEMBER_2027_CLOSE_MS = Date.UTC(2027, 8, 1, 12, 0);

const SEPTEMBER_2027_OPEN_MS = Date.UTC(2027, 7, 29, 12, 0);

function closedView(
  overrides: Partial<ListingAuctionBidView> = {},
): ListingAuctionBidView {
  return liveView({
    live: false,
    closed: true,
    showBidActions: false,
    priceLabel: "Winning bid",
    countdown: "",
    countdownSeconds: null,
    closesAtMs: null,
    deadlineAtMs: SEPTEMBER_2027_CLOSE_MS,
    opensAtMs: SEPTEMBER_2027_OPEN_MS,
    ...overrides,
  });
}

/**
 * The deadline line of an open lot names the viewer's zone.
 *
 * Scenario: shared-dates-and-times-SC-12 - The auction page shows a close
 * Case: shared-dates-and-times-US1-TC10-1
 */
export const DeadlineZoneHongKong: Story = {
  parameters: {
    verification: { caseId: "vc_61713e9b-0acc-40ee-8e65-345098b904bc" },
  },
  args: { view: liveView({ deadlineAtMs: SEPTEMBER_2027_CLOSE_MS }) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Ends 1 Sep 2027, 20:00 HKT")).toBeInTheDocument();
    expect(canvas.queryByText(/\bUTC\b/)).not.toBeInTheDocument();
  },
};

/**
 * A closed lot with a known opening time shows its close as a clock in the
 * wide block ("Closed at 20:00 HKT") and as a date and clock in the compact
 * summary line, and both name the viewer's zone.
 *
 * Scenario: shared-dates-and-times-SC-14 - A closed listing
 * Case: shared-dates-and-times-US1-TC11-1
 */
export const ClosedZoneHongKong: Story = {
  parameters: {
    verification: { caseId: "vc_f999db6b-f4b9-4b63-9450-45fb4cc9c5ba" },
  },
  args: { history: [], view: closedView() },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/^Closed at 20:00 HKT\. Ran /)).toBeInTheDocument();
    expect(
      canvas.getByText(/^Closed at 1 Sep 2027 20:00 HKT\. Ran /),
    ).toBeInTheDocument();
    expect(canvas.queryByText(/\bUTC\b|\bEDT\b/)).not.toBeInTheDocument();
  },
};

/**
 * Scenario: shared-dates-and-times-SC-14 - A closed listing
 * Case: shared-dates-and-times-US1-TC11-1
 */
export const ClosedZoneNewYork: Story = {
  parameters: {
    verification: { caseId: "vc_4f5f694e-9153-4064-b649-02aef0f3fd18" },
  },
  args: {
    history: [],
    timeZone: FIXTURE_ALT_TIME_ZONE,
    view: closedView(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/^Closed at 08:00 EDT\. Ran /)).toBeInTheDocument();
    expect(
      canvas.getByText(/^Closed at 1 Sep 2027 08:00 EDT\. Ran /),
    ).toBeInTheDocument();
    expect(canvas.queryByText(/HKT|\bUTC\b/)).not.toBeInTheDocument();
  },
};

/**
 * Below `sm` the summary line shows a clock whether or not the opening time is
 * known, so it names the zone either way.
 *
 * Scenario: shared-dates-and-times-SC-14 - A closed listing
 * Case: shared-dates-and-times-US1-TC11-1
 */
export const ClosedSummaryWithoutOpeningTimeHongKong: Story = {
  parameters: {
    verification: { caseId: "vc_dafeaea3-25cb-49a4-9447-b3781f46b6a6" },
  },
  args: { history: [], view: closedView({ opensAtMs: undefined }) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Closed 1 Sep 2027 20:00 HKT")).toBeInTheDocument();
  },
};

/**
 * Scenario: shared-dates-and-times-SC-14 - A closed listing
 * Case: shared-dates-and-times-US1-TC11-1
 */
export const ClosedSummaryWithoutOpeningTimeNewYork: Story = {
  parameters: {
    verification: { caseId: "vc_cce4650c-56d0-4128-8c4b-0220cb12ab69" },
  },
  args: {
    history: [],
    timeZone: FIXTURE_ALT_TIME_ZONE,
    view: closedView({ opensAtMs: undefined }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Closed 1 Sep 2027 08:00 EDT")).toBeInTheDocument();
  },
};

const DAY_ALONE_CLOSE_MS = Date.UTC(2027, 8, 1, 23, 30);

/**
 * With no opening time the wide closed block shows the close as a day alone.
 * The day is the viewer's, and no zone name follows it.
 *
 * Scenario: shared-dates-and-times-SC-38 - A deadline that shows only a day names no zone
 * Case: shared-dates-and-times-US1-TC18-1
 */
export const ClosedDayAloneHongKong: Story = {
  parameters: {
    verification: { caseId: "vc_c0e640d9-c4b9-450f-8acf-ac15f8506cba" },
  },
  args: {
    history: [],
    view: closedView({
      deadlineAtMs: DAY_ALONE_CLOSE_MS,
      opensAtMs: undefined,
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("2 Sep 2027")).toBeInTheDocument();
    expect(canvas.queryByText(/^Closed at \d\d:\d\d/)).not.toBeInTheDocument();
    expect(canvas.queryByText("1 Sep 2027")).not.toBeInTheDocument();
  },
};

/**
 * Scenario: shared-dates-and-times-SC-38 - A deadline that shows only a day names no zone
 * Case: shared-dates-and-times-US1-TC18-1
 */
export const ClosedDayAloneNewYork: Story = {
  parameters: {
    verification: { caseId: "vc_ec5d193c-2e12-465b-b2c0-3cce7580f431" },
  },
  args: {
    history: [],
    timeZone: FIXTURE_ALT_TIME_ZONE,
    view: closedView({
      deadlineAtMs: DAY_ALONE_CLOSE_MS,
      opensAtMs: undefined,
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("1 Sep 2027")).toBeInTheDocument();
    expect(canvas.queryByText(/^Closed at \d\d:\d\d/)).not.toBeInTheDocument();
    expect(canvas.queryByText("2 Sep 2027")).not.toBeInTheDocument();
  },
};

/** The countdown's text, `4h 59m 59s`: a duration, never a clock. */
const DURATION = /^(\d+\s?[dhms]\s?)+$/i;

const NAMES_A_ZONE = /HKT|EDT|EST|GMT|UTC/;

/**
 * The time left and the label above it carry no zone; only the dated deadline
 * line under them does.
 *
 * Scenario: shared-dates-and-times-SC-32 - A relative remaining time carries no zone
 * Case: shared-dates-and-times-US1-TC13-1
 */
export const OpenLotTimeLeftNamesNoZone: Story = {
  parameters: {
    verification: { caseId: "vc_528dafd6-66a4-4e13-9cbf-a06992bc45b9" },
  },
  args: {
    timeZone: FIXTURE_ALT_TIME_ZONE,
    view: liveView({
      countdownSeconds: 5 * 60 * 60,
      closesAtMs: NOW_MS + 5 * 60 * 60 * 1000,
      deadlineAtMs: NOW_MS + 5 * 60 * 60 * 1000,
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getAllByText("Time left").length).toBeGreaterThan(0);
    const left = canvas.getAllByText(DURATION);
    expect(left.length).toBeGreaterThan(0);
    for (const element of left) {
      expect(element.textContent).not.toMatch(NAMES_A_ZONE);
    }
    for (const named of canvas.getAllByText(/\bE[DS]T\b/)) {
      expect(named.textContent).toMatch(/^Ends /);
    }
  },
};

/**
 * Scenario: shared-dates-and-times-SC-32 - A relative remaining time carries no zone
 * Case: shared-dates-and-times-US1-TC13-1
 */
export const ScheduledLotOpensInNamesNoZone: Story = {
  parameters: {
    verification: { caseId: "vc_829a64b0-fbfd-45d5-bec0-2066102ad8b5" },
  },
  args: {
    history: [],
    bidEnrollment: undefined,
    timeZone: FIXTURE_ALT_TIME_ZONE,
    view: liveView({
      headerLabel: "Opens soon",
      live: false,
      opens: true,
      hasBids: false,
      showBidActions: false,
      priceLabel: "",
      bidCount: 0,
      bidCountLabel: "0 bids",
      countdownSeconds: 5 * 60 * 60,
      countdownFormat: "long",
      closesAtMs: null,
      deadlineAtMs: NOW_MS + 5 * 60 * 60 * 1000,
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Opens in")).toBeInTheDocument();
    const left = canvas.getAllByText(DURATION);
    expect(left.length).toBeGreaterThan(0);
    for (const element of left) {
      expect(element.textContent).not.toMatch(NAMES_A_ZONE);
    }
    for (const named of canvas.getAllByText(/\bE[DS]T\b/)) {
      expect(named.textContent).toMatch(/^Opens [^i]/);
    }
  },
};

/**
 * A row that carries a display text shows that text as supplied, with no date
 * or zone beside it; a row with only an accepted instant shows its local moment.
 *
 * Scenario: shared-ui-auction-listing-SC-57 - A supplied display text replaces a row's formatted time
 * Case: shared-ui-auction-listing-US1-TC58-1
 */
export const DisplayTextReplacesARowsTime: Story = {
  parameters: {
    verification: { caseId: "vc_704281c6-fc0a-43d8-a387-424a4aad5c1e" },
  },
  args: {
    history: [
      {
        id: "bid-display-text",
        initials: "john@example.com",
        amountMinor: 5_800_000,
        acceptedAtMs: Date.UTC(2026, 8, 1, 13, 0),
        timeOverride: "DISPLAY-TEXT-MARKER",
      },
      {
        id: "bid-instant-only",
        initials: "mike@example.com",
        amountMinor: 5_550_000,
        acceptedAtMs: Date.UTC(2026, 8, 1, 12, 0),
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("DISPLAY-TEXT-MARKER")).toBeInTheDocument();
    expect(canvas.getByText("1 Sep 2026, 20:00")).toBeInTheDocument();
    expect(canvas.queryByText("1 Sep 2026, 21:00")).not.toBeInTheDocument();
  },
};
