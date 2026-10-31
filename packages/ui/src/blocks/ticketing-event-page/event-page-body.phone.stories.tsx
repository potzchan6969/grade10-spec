import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { EventPageBody } from "./event-page-body";
import { EventPageDemo } from "./event-page-body.story-fixtures";

/** The event page at 390 px, one story per state on the EventPhone board.
 * The body reads its own width, so the 390 px frame lays it out as a phone:
 * passes, then Good to know, then Your Order, with the order bar pinned to
 * the foot once a ticket is chosen. */
const meta = {
  title: "Ticketing/Buying/Blocks/EventPageBody/Phone",
  component: EventPageBody,
  parameters: { layout: "fullscreen" },
  /* Each story renders the page stand-in, which composes the body. */
  args: { copy: { passes: "Passes" }, header: null },
  decorators: [
    (Story) => (
      <div className="w-[390px] bg-background text-foreground">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EventPageBody>;

export default meta;
type Story = StoryObj<typeof meta>;

const CHOSEN = { qty: { adult2: 2, child2: 1 } } as const;

/** Early bird, signed out, nothing chosen: struck-through full prices, no
 * bar, Your Order last. */
export const Default: Story = {
  render: () => <EventPageDemo mode="earlyBird" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("heading", { level: 1, name: "[Show Name]" }),
    ).toBeVisible();
    await expect(
      canvas.getByRole("article", { name: "VIP Pass" }),
    ).toBeVisible();
    await expect(canvas.getAllByText("HK$480.00")[0]).toBeInTheDocument();
    await expect(
      canvas.queryByRole("region", { name: "Order total" }),
    ).not.toBeInTheDocument();
    await expect(
      canvas.getByRole("button", { name: "Continue" }),
    ).toBeDisabled();
  },
};

/** Two adults and a child on the Two-Day pass: the bar pins with the total,
 * the saving and the jump to Your Order. */
export const Chosen: Story = {
  render: () => <EventPageDemo choice={CHOSEN} mode="earlyBird" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bar = canvas.getByRole("region", { name: "Order total" });
    await expect(within(bar).getByText("HK$950.00")).toBeVisible();
    await expect(within(bar).getByText("You save HK$250.00")).toBeVisible();
    await expect(
      within(bar).getByRole("link", { name: "3 tickets, see order" }),
    ).toHaveAttribute("href", "#order");
    await expect(
      canvas.getByRole("button", {
        name: "Add Fast Pass for Everyone, 2 days",
      }),
    ).toBeVisible();
  },
};

/** `+ Fast Pass` for everyone grows into the pill with both days, and Your
 * Order gains the Fast Pass line. */
export const FastPassEveryone: Story = {
  name: "Fast Pass Everyone",
  render: () => <EventPageDemo choice={CHOSEN} mode="earlyBird" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", {
        name: "Add Fast Pass for Everyone, 2 days",
      }),
    );
    const pill = canvas.getByRole("group", {
      name: "Fast Pass days for Everyone",
    });
    await expect(within(pill).getByText("2 days")).toBeVisible();
    await expect(
      within(pill).getByRole("button", {
        name: "One more Fast Pass day for Everyone",
      }),
    ).toBeDisabled();
    await expect(canvas.getAllByText("+HK$600.00")[0]).toBeInTheDocument();
    await expect(canvas.getByText("Fast Pass × 6 days")).toBeInTheDocument();
    const bar = canvas.getByRole("region", { name: "Order total" });
    await expect(within(bar).getByText("HK$1,550.00")).toBeVisible();
  },
};

/** Choose per person: one pill per ticket, the tally, the nudge and Add for
 * everyone, which covers everyone every day. */
export const FastPassPerPerson: Story = {
  name: "Fast Pass Per Person",
  render: () => (
    <EventPageDemo
      choice={{ ...CHOSEN, fast: { two: { all: 1 } } }}
      mode="earlyBird"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Choose per person" }),
    );
    await expect(
      canvas.getByRole("group", { name: "Fast Pass for each ticket" }),
    ).toBeVisible();
    await userEvent.click(
      canvas.getByRole("button", { name: "Remove Fast Pass for Child" }),
    );
    await expect(
      canvas.getByText("2 of 6 Fast Passes: HK$200.00."),
    ).toBeVisible();
    await expect(
      canvas.getByText("4 more cover everyone, every day."),
    ).toBeVisible();
    await userEvent.click(
      canvas.getByRole("button", { name: "Add for everyone (+HK$400.00)" }),
    );
    await expect(canvas.getByText("Everyone skips the queue.")).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: "Same for everyone" }),
    ).toBeVisible();
  },
};

/** Two VIP Passes: Fast Pass is included, so no Fast Pass control or prompt. */
export const Vip: Story = {
  name: "VIP",
  render: () => <EventPageDemo choice={{ qty: { vip: 2 } }} mode="earlyBird" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText("Fast Pass every day, included."),
    ).toBeVisible();
    await expect(canvas.queryByText(/wristband/i)).not.toBeInTheDocument();
    await expect(
      canvas.queryByRole("group", { name: "Skip the queue with Fast Pass" }),
    ).not.toBeInTheDocument();
    const bar = canvas.getByRole("region", { name: "Order total" });
    await expect(within(bar).getByText("HK$2,560.00")).toBeVisible();
  },
};

/** Day 2: the two-day passes and VIP ended in grey with Sales Ended; the
 * One-Day pass sells for today at its full price. */
export const EventDay2: Story = {
  name: "Event Day 2",
  render: () => <EventPageDemo mode="eventDay2" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("On Today")).toBeVisible();
    const two = canvas.getByRole("article", { name: "General Pass (Two-Day)" });
    await expect(within(two).getByText("Sales Ended")).toBeVisible();
    await expect(
      within(two).getByText("Sales ended when Sun 13 Dec began"),
    ).toBeVisible();
    await expect(within(two).queryByRole("spinbutton")).not.toBeInTheDocument();
    const one = canvas.getByRole("article", { name: "General Pass (One-Day)" });
    await expect(within(one).getByText("Today, Sun 13 Dec")).toBeVisible();
  },
};

/** Eight tickets on one email: every + stops and both places say why. */
export const AtTheLimit: Story = {
  name: "At the Limit",
  render: () => (
    <EventPageDemo
      choice={{ qty: { adult2: 6, child2: 2 } }}
      mode="earlyBird"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getAllByText("One email can buy up to 8 tickets for this event."),
    ).toHaveLength(2);
    for (const button of canvas.getAllByRole("button", { name: /^One more / }))
      await expect(button).toBeDisabled();
    const bar = canvas.getByRole("region", { name: "Order total" });
    await expect(within(bar).getByText("HK$2,660.00")).toBeVisible();
  },
};

/** An early-access pass before its public sale, to a buyer no access rule
 * lets in: `Opens …` and no stepper. */
export const EarlyAccessOpens: Story = {
  name: "Early Access Opens",
  render: () => <EventPageDemo earlyAccess="opens" mode="earlyBird" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const pass = canvas.getByRole("article", {
      name: "Members’ Pass (Two-Day)",
    });
    await expect(
      within(pass).getByText("Opens Mon 16 Nov, 12:00"),
    ).toBeVisible();
    await expect(
      within(pass).queryByRole("spinbutton"),
    ).not.toBeInTheDocument();
    await expect(
      within(pass).queryByText("For you now"),
    ).not.toBeInTheDocument();
  },
};

/** The same pass to a signed-in buyer an access rule lets in: `For you
 * now`, a stepper up to the rule's limit, and what the rule allows. */
export const EarlyAccessForYou: Story = {
  name: "Early Access For You",
  render: () => (
    <EventPageDemo
      choice={{ qty: { earlyAdult: 2 } }}
      earlyAccess="forYou"
      mode="earlyBird"
      signedIn
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const pass = canvas.getByRole("article", {
      name: "Members’ Pass (Two-Day)",
    });
    await expect(within(pass).getByText("For you now")).toBeVisible();
    await expect(within(pass).getByText("Yours to buy: up to 4")).toBeVisible();
    await expect(
      within(pass).getByRole("spinbutton", {
        name: "How many tickets: Members’ Pass (Two-Day), Adult",
      }),
    ).toHaveValue("2");
    await expect(within(pass).queryByText(/^Opens /)).not.toBeInTheDocument();
  },
};

/** A restricted event's page to its own audience: the preview notice says
 * orders are real. */
export const RestrictedPreview: Story = {
  name: "Restricted Preview",
  render: () => <EventPageDemo mode="earlyBird" preview signedIn />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText("Preview: only staff and allowed addresses can buy."),
    ).toBeVisible();
    await expect(canvas.queryByText("Early access?")).not.toBeInTheDocument();
  },
};

/** A canceled event: the badge and the refund notice; no passes, no order. */
export const Canceled: Story = {
  render: () => <EventPageDemo mode="canceled" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("This event is canceled.")).toBeVisible();
    await expect(canvas.queryByRole("article")).not.toBeInTheDocument();
    await expect(
      canvas.queryByRole("heading", { name: "Your Order" }),
    ).not.toBeInTheDocument();
    await expect(
      canvas.getByRole("list", { name: "Good to know" }),
    ).toBeVisible();
  },
};

/** Signed in and already holding tickets: the banner leads to them. */
export const HoldingTickets: Story = {
  name: "Holding Tickets",
  render: () => <EventPageDemo holding mode="earlyBird" signedIn />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText("You have tickets for this show."),
    ).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: "View Your Tickets" }),
    ).toBeVisible();
    await expect(canvas.getByText("Paid tickets earn points.")).toBeVisible();
  },
};
