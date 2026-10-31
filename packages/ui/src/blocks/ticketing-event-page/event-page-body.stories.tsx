import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { EventPageBody } from "./event-page-body";
import { EventPageDemo } from "./event-page-body.story-fixtures";

/** The event page on a wide screen, one story per sale state on the Main
 * board: the passes beside Your Order. */
const meta = {
  title: "Ticketing/Buying/Blocks/EventPageBody/Desktop",
  component: EventPageBody,
  parameters: { layout: "fullscreen" },
  /* Each story renders the page stand-in, which composes the body. */
  args: { copy: { passes: "Passes" }, header: null },
  decorators: [
    (Story) => (
      <div className="min-w-[1024px] bg-background text-foreground">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EventPageBody>;

export default meta;
type Story = StoryObj<typeof meta>;

const CHOSEN = { qty: { adult2: 2, child2: 1 } } as const;
const onContinue = fn();

/** Early bird with three tickets chosen: struck prices on every row and
 * line, the Fast Pass prompt, and the saving under the total. */
export const EarlyBird: Story = {
  name: "Early Bird",
  render: () => (
    <EventPageDemo choice={CHOSEN} mode="earlyBird" onContinue={onContinue} />
  ),
  play: async ({ canvasElement }) => {
    onContinue.mockClear();
    const canvas = within(canvasElement);
    const order = canvas.getByRole("complementary", { name: "Your Order" });
    await expect(
      within(order).getByText("2 × General Pass (Two-Day), Adult"),
    ).toBeVisible();
    await expect(within(order).getByText("HK$960.00")).toBeVisible();
    await expect(within(order).getByText("You save HK$250.00")).toBeVisible();
    await expect(
      within(order).getByText("HK$300 a day for 3 people"),
    ).toBeVisible();
    await userEvent.click(
      within(order).getByRole("button", { name: "Add both days" }),
    );
    await expect(within(order).getByText("Fast Pass × 6 days")).toBeVisible();
    await expect(within(order).getByText("HK$1,550.00")).toBeVisible();
    await userEvent.click(
      within(order).getByRole("button", { name: "Remove Fast Pass × 6 days" }),
    );
    await expect(within(order).getByText("HK$950.00")).toBeVisible();
    await userEvent.click(
      within(order).getByRole("button", { name: "Continue" }),
    );
    await expect(onContinue).toHaveBeenCalledOnce();
  },
};

/** On sale at full price, nothing chosen: no struck prices, Continue waits. */
export const OnSale: Story = {
  name: "On Sale",
  render: () => <EventPageDemo mode="onSale" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText("HK$380.00")).not.toBeInTheDocument();
    await expect(canvas.getAllByText("HK$480.00")[0]).toBeInTheDocument();
    await expect(
      canvas.getByText(
        "Choose how many of each pass. You pay on the next step, by card or WeChat Pay.",
      ),
    ).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: "Continue" }),
    ).toBeDisabled();
  },
};

/** Before the public sale: each pass shows when it goes on sale and a
 * countdown, with no steppers. */
export const NotStarted: Story = {
  name: "Not Started",
  render: () => <EventPageDemo mode="notStarted" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getAllByText("On sale Mon 16 Nov, 12:00").length,
    ).toBeGreaterThan(1);
    await expect(canvas.getAllByText("Opens in 1 day 21:42:10")).toHaveLength(
      2,
    );
    await expect(canvas.queryByRole("spinbutton")).not.toBeInTheDocument();
  },
};

/** Day 2 of the event: two-day passes ended, the One-Day pass sells today. */
export const EventDay2: Story = {
  name: "Event Day 2",
  render: () => <EventPageDemo mode="eventDay2" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText("Sat 12 Dec and Sun 13 Dec 2026 (today)"),
    ).toBeVisible();
    await expect(canvas.getAllByText("Sales Ended")).toHaveLength(2);
    await expect(canvas.getAllByRole("spinbutton")).toHaveLength(2);
  },
};

/** The event is over: every pass ended, no order, no sign-in hints. */
export const Ended: Story = {
  render: () => <EventPageDemo mode="eventOver" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("This event has ended.")).toBeVisible();
    await expect(canvas.getAllByText("Sales Ended")).toHaveLength(3);
    await expect(
      canvas.queryByRole("complementary", { name: "Your Order" }),
    ).not.toBeInTheDocument();
    await expect(canvas.queryByText("Early access?")).not.toBeInTheDocument();
  },
};

/** A canceled event: the refund notice, no passes. */
export const Canceled: Story = {
  render: () => <EventPageDemo mode="canceled" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Canceled")).toBeVisible();
    await expect(canvas.getByText("This event is canceled.")).toBeVisible();
    await expect(canvas.queryByRole("article")).not.toBeInTheDocument();
  },
};

/** Signed in, holding tickets, with an early-access pass open to them. */
export const SignedIn: Story = {
  name: "Signed In",
  render: () => (
    <EventPageDemo
      choice={CHOSEN}
      earlyAccess="forYou"
      holding
      mode="earlyBird"
      signedIn
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText("You have tickets for this show."),
    ).toBeVisible();
    await expect(
      canvas.getByText("Earn about 950 points on this order."),
    ).toBeVisible();
    await expect(canvas.getByText("For you now")).toBeVisible();
  },
};
