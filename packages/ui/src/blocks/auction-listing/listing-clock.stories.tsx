import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef } from "react";
import { expect, waitFor, within } from "storybook/test";
import { createFakeClock } from "./fixtures";
import {
  ClockProvider,
  useClockNow,
  useRemainingSeconds,
} from "./listing-clock";
import { ListingCountdownDisplay } from "./listing-countdown-display";

const START_MS = Date.UTC(2026, 8, 30, 12, 0, 0);
const DEADLINE_MS = START_MS + 10_000;

function RemainingProbe({ deadlineMs }: { deadlineMs: number | null }) {
  const renders = useRef(0);
  renders.current += 1;
  const seconds = useRemainingSeconds(deadlineMs);
  return (
    <p data-renders={renders.current} data-testid="probe">
      {seconds == null ? "none" : String(seconds)}
    </p>
  );
}

function MinuteProbe() {
  const renders = useRef(0);
  renders.current += 1;
  const minuteMs = useClockNow(60_000);
  return (
    <p data-renders={renders.current} data-testid="probe">
      {new Date(minuteMs).toISOString()}
    </p>
  );
}

const renderCount = (element: HTMLElement) =>
  Number(element.getAttribute("data-renders"));

const meta = {
  title: "Auction Listing/Clock",
  component: ListingCountdownDisplay,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Every store countdown reads one clock. The app passes its server clock through `ClockProvider`; without one, a frame loop on the device clock runs while something subscribes and the page is visible. Countdowns round up, so the last second reads 1 and 0 means the deadline has passed.",
      },
    },
  },
  args: { initialSeconds: 0 },
} satisfies Meta<typeof ListingCountdownDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

const roundUpClock = createFakeClock(START_MS);

export const RoundsUp: Story = {
  args: { closesAtMs: DEADLINE_MS },
  render: (args) => (
    <ClockProvider store={roundUpClock.store}>
      <ListingCountdownDisplay {...args} />
    </ClockProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const [leftMs, text] of [
      [1001, "0m 2s"],
      [1000, "0m 1s"],
      [200, "0m 1s"],
      [0, "0m 0s"],
      [-5000, "0m 0s"],
    ] as const) {
      roundUpClock.set(DEADLINE_MS - leftMs);
      await waitFor(() => expect(canvas.getByText(text)).toBeInTheDocument());
    }
  },
};

const wholeSecondClock = createFakeClock(START_MS);

export const RendersOnWholeSeconds: Story = {
  name: "Renders only when the whole second changes",
  render: () => (
    <ClockProvider store={wholeSecondClock.store}>
      <RemainingProbe deadlineMs={DEADLINE_MS} />
    </ClockProvider>
  ),
  play: async ({ canvasElement }) => {
    const probe = within(canvasElement).getByTestId("probe");
    wholeSecondClock.set(DEADLINE_MS - 5000);
    await waitFor(() => expect(probe).toHaveTextContent("5"));
    const before = renderCount(probe);

    for (const leftMs of [4900, 4500, 4001]) {
      wholeSecondClock.set(DEADLINE_MS - leftMs);
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(probe).toHaveTextContent("5");
    expect(renderCount(probe)).toBe(before);

    wholeSecondClock.set(DEADLINE_MS - 4000);
    await waitFor(() => expect(probe).toHaveTextContent("4"));
    expect(renderCount(probe)).toBeGreaterThan(before);
  },
};

const noDeadlineClock = createFakeClock(START_MS);

export const NoDeadline: Story = {
  name: "No deadline reads null",
  render: () => (
    <ClockProvider store={noDeadlineClock.store}>
      <RemainingProbe deadlineMs={null} />
    </ClockProvider>
  ),
  play: async ({ canvasElement }) => {
    const probe = within(canvasElement).getByTestId("probe");
    const before = renderCount(probe);
    noDeadlineClock.advance(5000);
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(probe).toHaveTextContent("none");
    expect(renderCount(probe)).toBe(before);
  },
};

const staticClock = createFakeClock(START_MS);

export const StaticWithoutCloseInstant: Story = {
  name: "Static seconds without a close instant",
  args: { closesAtMs: null, initialSeconds: 90 },
  render: (args) => (
    <ClockProvider store={staticClock.store}>
      <ListingCountdownDisplay {...args} />
    </ClockProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("1m 30s")).toBeInTheDocument();
    staticClock.advance(5000);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    expect(canvas.getByText("1m 30s")).toBeInTheDocument();
  },
};

const minuteClock = createFakeClock(START_MS);

export const MinuteUnit: Story = {
  name: "Minute displays change by the minute",
  render: () => (
    <ClockProvider store={minuteClock.store}>
      <MinuteProbe />
    </ClockProvider>
  ),
  play: async ({ canvasElement }) => {
    const probe = within(canvasElement).getByTestId("probe");
    minuteClock.set(START_MS);
    await waitFor(() =>
      expect(probe).toHaveTextContent("2026-09-30T12:00:00.000Z"),
    );
    const before = renderCount(probe);
    minuteClock.set(START_MS + 59_999);
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(renderCount(probe)).toBe(before);
    minuteClock.set(START_MS + 60_000);
    await waitFor(() =>
      expect(probe).toHaveTextContent("2026-09-30T12:01:00.000Z"),
    );
  },
};

export const DeviceClock: Story = {
  name: "Device clock without a provider",
  args: { closesAtMs: null },
  render: (args) => (
    <ListingCountdownDisplay {...args} closesAtMs={Date.now() + 2500} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText("0m 1s")).toBeInTheDocument(), {
      timeout: 3000,
    });
    await waitFor(() => expect(canvas.getByText("0m 0s")).toBeInTheDocument(), {
      timeout: 3000,
    });
  },
};
