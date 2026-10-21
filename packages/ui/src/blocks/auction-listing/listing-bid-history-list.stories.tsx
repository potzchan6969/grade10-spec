import { Button } from "@grade10/design-system/components/forms/button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import {
  FIXTURE_ACTIVITY_TIME_COPY,
  FIXTURE_SHIPPED_LOCALE,
  FIXTURE_TIME_ZONE,
} from "../../lib/datetime-fixtures";
import { createFakeClock } from "./fixtures";
import { ListingBidHistoryList } from "./listing-bid-history-list";
import { ClockProvider } from "./listing-clock";
import type { ListingBidHistoryRow } from "./types";

const STORY_NOW_MS = Date.now();
const STORY_CLOCK = createFakeClock(STORY_NOW_MS);

const LONG_HISTORY: ListingBidHistoryRow[] = Array.from(
  { length: 12 },
  (_, index) => ({
    id: `bid-${index}`,
    initials: `bidder${index + 1}@example.com`,
    amountMinor: 6_000_000 - index * 250_000,
    acceptedAtMs: STORY_NOW_MS - (index + 1) * 5 * 60_000,
  }),
);

const meta = {
  title: "Auction/Bidding/Blocks/ListingBidHistoryList",
  component: ListingBidHistoryList,
  parameters: { layout: "padded" },
  args: {
    copy: { you: "You", empty: "No bids yet." },
    currency: "USD",
    locale: FIXTURE_SHIPPED_LOCALE,
    timeZone: FIXTURE_TIME_ZONE,
    activityTimeCopy: FIXTURE_ACTIVITY_TIME_COPY,
    heading: "Recent bids",
    rows: LONG_HISTORY,
  },
} satisfies Meta<typeof ListingBidHistoryList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Newest first; the list animates a row in when a new bid lands. */
export const Default: Story = {};

function ScrollableHistory() {
  const [rows, setRows] = useState(LONG_HISTORY);
  const nextIdRef = useRef(0);
  const arrive = () =>
    setRows((current) => [
      {
        id: `bid-new-${nextIdRef.current++}`,
        initials: "top@example.com",
        amountMinor: 7_500_000,
        acceptedAtMs: Date.now(),
      },
      ...current,
    ]);
  return (
    <div className="flex w-80 flex-col items-start gap-4">
      <Button onClick={arrive} variant="secondary">
        A higher bid lands
      </Button>
      <section
        aria-label="Recent bids"
        className="max-h-48 w-full overflow-y-auto rounded-lg border border-border p-4"
        data-slot="history-scroll-slot"
        // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable region must take focus so a keyboard can scroll it.
        tabIndex={0}
      >
        <ClockProvider store={STORY_CLOCK.store}>
          <ListingBidHistoryList
            activityTimeCopy={FIXTURE_ACTIVITY_TIME_COPY}
            copy={{ you: "You", empty: "No bids yet." }}
            currency="USD"
            entranceMode="fade"
            heading="Recent bids"
            locale={FIXTURE_SHIPPED_LOCALE}
            rows={rows}
            timeZone={FIXTURE_TIME_ZONE}
          />
        </ClockProvider>
      </section>
    </div>
  );
}

/**
 * A reader scrolled deep into older bids sees the new row pulled back into
 * view — the list scrolls to the entering bid instead of leaving the newest
 * row above the fold.
 */
export const NewBidScrollsIntoView: Story = {
  name: "New bid scrolls into view",
  render: () => <ScrollableHistory />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const slot = canvasElement.querySelector<HTMLElement>(
      '[data-slot="history-scroll-slot"]',
    );
    expect(slot).not.toBeNull();
    if (!slot) return;
    // The workbench stubs scrollIntoView; record the call to prove the list
    // asks the browser to surface the entering row.
    const scrolled: Element[] = [];
    const native = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function scrolledSpy(
      this: Element,
      arg?: boolean | ScrollIntoViewOptions,
    ) {
      scrolled.push(this);
      return native?.call(this, arg);
    };
    try {
      slot.scrollTop = slot.scrollHeight;
      expect(slot.scrollTop).toBeGreaterThan(0);
      await userEvent.click(
        canvas.getByRole("button", { name: "A higher bid lands" }),
      );
      await waitFor(() => {
        const newRow = slot.querySelector<HTMLElement>(
          '[data-bid-row-id="bid-new-0"]',
        );
        expect(newRow).not.toBeNull();
        expect(scrolled).toContain(newRow);
      });
      expect(canvas.getByText("US$75,000")).toBeInTheDocument();
    } finally {
      Element.prototype.scrollIntoView = native;
    }
  },
};
