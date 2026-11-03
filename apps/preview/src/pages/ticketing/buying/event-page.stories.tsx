import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import {
  navigateToStory,
  TICKETING_STORY_IDS,
} from "../../workbench-story-nav";
import { SHOW, T, t } from "../ticketing-words";
import { EventPage, EventPageMessage } from "./event-page";

/**
 * The event page on a computer, one story per state on the Main board: the
 * passes, Fast Pass and Your Order beside them. Continue opens Your
 * Details.
 */
const meta = {
  title: "Ticketing/Buying/Screens/Event",
  component: EventPage,
  parameters: {
    layout: "fullscreen",
    journeys: [
      "grade10-site-ticketing-buying-US-01",
      "grade10-site-ticketing-buying-US-03",
    ],
  },
  args: {
    mode: "earlyBird",
    onContinue: () => navigateToStory(TICKETING_STORY_IDS.details),
    onViewYourTickets: () => navigateToStory(TICKETING_STORY_IDS.yourTickets),
  },
} satisfies Meta<typeof EventPage>;

export default meta;
type Story = StoryObj<typeof meta>;

const CHOSEN = { qty: { adult2: 2, child2: 1 } } as const;

/** Early bird, signed out, nothing chosen: struck-through full prices and
 * Continue waiting for a ticket. */
export const EarlyBird: Story = {
  parameters: {
    verification: { caseId: "vc_67925fed-d17a-42de-b308-096ef8993354" },
  },
  name: "Early bird",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("heading", { level: 1, name: SHOW.name }),
    ).toBeVisible();
    await expect(
      canvas.getByRole("article", { name: "VIP Pass" }),
    ).toBeVisible();
    await expect(canvas.getByText(T.event.order.intro)).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: T.event.order.continue }),
    ).toBeDisabled();
    await expect(canvas.getByText(T.event.order.pointsSignedOut)).toBeVisible();
  },
};

/** After the early bird: full prices, nothing struck through. */
export const OnSale: Story = {
  parameters: {
    verification: { caseId: "vc_7b4bf885-aee3-4304-986d-efd313a906a8" },
  },
  name: "On sale",
  args: { mode: "onSale" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText("HK$380.00")).not.toBeInTheDocument();
    await expect(
      canvas.getAllByText("HK$480.00").some((price) => price.checkVisibility()),
    ).toBe(true);
  },
};

/** Two adults and a child chosen: the lines, the saving and the Fast Pass
 * prompt in Your Order. */
export const Chosen: Story = {
  parameters: {
    verification: { caseId: "vc_eebd08f6-17b0-4412-b0c2-b9d52b5df90f" },
  },
  args: { choice: CHOSEN },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const order = canvas.getByRole("complementary", {
      name: T.event.order.title,
    });
    await expect(within(order).getByText("HK$950.00")).toBeVisible();
    await expect(
      within(order).getByText(
        t(T.event.order.youSave, { amount: "HK$250.00" }),
      ),
    ).toBeVisible();
    await expect(
      within(order).getByRole("button", { name: T.event.order.addBothDays }),
    ).toBeVisible();
    await expect(
      within(order).getByRole("button", { name: T.event.order.continue }),
    ).toBeEnabled();
  },
};

/** Add both days from Your Order: every ticket on the pass gets Fast Pass,
 * and its line comes off with ✕. */
export const FastPassForEveryone: Story = {
  parameters: {
    verification: { caseId: "vc_21aad4fb-deef-4b89-b942-2730cd85a160" },
  },
  name: "Fast Pass for everyone",
  args: { choice: CHOSEN },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const order = canvas.getByRole("complementary", {
      name: T.event.order.title,
    });
    await userEvent.click(
      within(order).getByRole("button", { name: T.event.order.addBothDays }),
    );
    const line = t(T.event.order.fastPassLine, { count: 6 });
    await expect(within(order).getByText(line)).toBeVisible();
    await expect(within(order).getByText("HK$1,550.00")).toBeVisible();
    await userEvent.click(
      within(order).getByRole("button", {
        name: t(T.event.order.removeLine, { line }),
      }),
    );
    await expect(within(order).queryByText(line)).not.toBeInTheDocument();
  },
};

/** The VIP pass chosen: Fast Pass is included, so no prompt. */
export const Vip: Story = {
  parameters: {
    verification: { caseId: "vc_b0fa8200-b171-4ce2-95c5-6095ea7b7d99" },
  },
  name: "VIP",
  args: { choice: { qty: { vip: 2 } } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(T.event.vip.fastPassEveryDay)).toBeVisible();
    await expect(
      canvas.queryByRole("group", { name: T.event.order.upsellTitle }),
    ).not.toBeInTheDocument();
  },
};

/** Before the sale: when each pass goes on sale, and no stepper. */
export const NotStarted: Story = {
  parameters: {
    verification: { caseId: "vc_193c32cf-c7a2-4783-a099-b91b61474b2f" },
  },
  name: "Not started",
  args: { mode: "notStarted" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getAllByText(
        t(T.event.pass.onSaleAt, { date: "Mon 16 Nov, 12:00" }),
      )[0],
    ).toBeVisible();
    await expect(canvas.queryByRole("spinbutton")).not.toBeInTheDocument();
  },
};

/** The second day of the show: the two-day passes stopped selling when it
 * began, the one-day pass admits today. */
export const EventDay2: Story = {
  parameters: {
    verification: { caseId: "vc_578e23c3-6ee8-41f3-b4b2-d6475f3f0e2d" },
  },
  name: "Event day 2",
  args: { mode: "eventDay2" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(T.event.badge.onToday)).toBeVisible();
    const two = canvas.getByRole("article", { name: "General Pass (Two-Day)" });
    await expect(
      within(two).getByText(
        t(T.event.pass.salesEndedWhen, { day: "Sun 13 Dec" }),
      ),
    ).toBeVisible();
  },
};

/** Eight tickets on one email: every + stops and both places say why. */
export const AtTheLimit: Story = {
  parameters: {
    verification: { caseId: "vc_9dee37aa-3873-4ef8-8f5d-200b9a25b5f3" },
  },
  name: "At the limit",
  args: { choice: { qty: { adult2: 6, child2: 2 } } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getAllByText(t(T.event.limit, { count: SHOW.limit })).length,
    ).toBeGreaterThan(0);
    for (const button of canvas.getAllByRole("button", { name: /^One more / }))
      await expect(button).toBeDisabled();
  },
};

/** An early-access pass before its public sale, to a buyer no access rule
 * lets in: when it opens, and no stepper. */
export const EarlyAccessOpens: Story = {
  parameters: {
    verification: { caseId: "vc_e8f43e28-6649-4c47-99c0-426220b68e02" },
  },
  name: "Early access opens later",
  args: { earlyAccess: "opens" },
  play: async ({ canvasElement }) => {
    const pass = within(canvasElement).getByRole("article", {
      name: "Members’ Pass (Two-Day)",
    });
    await expect(
      within(pass).getByText(
        t(T.event.earlyAccess.opens, { date: "Mon 16 Nov, 12:00" }),
      ),
    ).toBeVisible();
    await expect(
      within(pass).queryByRole("spinbutton"),
    ).not.toBeInTheDocument();
  },
};

/** The same pass to a signed-in buyer an access rule lets in now. */
export const EarlyAccessForYou: Story = {
  parameters: {
    verification: { caseId: "vc_9bd0183c-8d51-498b-b202-3519d9d84a16" },
  },
  name: "Early access, for you now",
  args: {
    earlyAccess: "forYou",
    signedIn: true,
    choice: { qty: { earlyAdult: 2 } },
  },
  play: async ({ canvasElement }) => {
    const pass = within(canvasElement).getByRole("article", {
      name: "Members’ Pass (Two-Day)",
    });
    await expect(
      within(pass).getByText(T.event.earlyAccess.forYouNow),
    ).toBeVisible();
    await expect(
      within(pass).getByText(t(T.event.earlyAccess.yoursToBuy, { count: 4 })),
    ).toBeVisible();
  },
};

/** The early bird with a later price set: each pass says when it ends. */
export const EarlyBirdEnds: Story = {
  parameters: {
    verification: { caseId: "vc_a2274dbc-ee5c-47f6-89b7-6742a9c9ff80" },
  },
  name: "Early bird ends",
  args: { earlyBirdEnds: true },
  play: async ({ canvasElement }) => {
    const two = within(canvasElement).getByRole("article", {
      name: "General Pass (Two-Day)",
    });
    await expect(
      within(two).getByText(
        t(T.event.pass.earlyBirdEnds, { date: "Sun 29 Nov, 23:59" }),
      ),
    ).toBeVisible();
  },
};

const vip = (canvasElement: HTMLElement) =>
  within(within(canvasElement).getByRole("article", { name: "VIP Pass" }));

/** VIP sold out, signed in: how many to wait for and Join. */
export const WaitingLineJoin: Story = {
  parameters: {
    verification: { caseId: "vc_81ed0966-801e-49a8-b15c-32e7c19e530b" },
  },
  name: "Waiting line, join",
  args: { mode: "onSale", signedIn: true, waitingLine: "join" },
  play: async ({ canvasElement }) => {
    const card = vip(canvasElement);
    await expect(card.getByText(T.event.pass.soldOut)).toBeVisible();
    await expect(
      card.getByRole("button", { name: T.event.pass.joinWaitingLine }),
    ).toBeVisible();
  },
};

/** Join pressed while tickets came back: the line stays shut. */
export const WaitingLineJoinRefused: Story = {
  parameters: {
    verification: { caseId: "vc_bd8b1103-b949-469f-896f-10553e5142bb" },
  },
  name: "Waiting line, join refused",
  args: { mode: "onSale", signedIn: true, waitingLine: "joinRefused" },
  play: async ({ canvasElement }) => {
    await expect(vip(canvasElement).getByRole("alert")).toHaveTextContent(
      t(T.refusals.ticketsLeft.title, { count: 2 }),
    );
  },
};

/** In the line: how many, the band, and Leave. */
export const WaitingLinePlace: Story = {
  parameters: {
    verification: { caseId: "vc_d3c61268-d413-45c9-baa7-ef465ed46817" },
  },
  name: "Waiting line, in it",
  args: { mode: "onSale", signedIn: true, waitingLine: "place" },
  play: async ({ canvasElement }) => {
    const card = vip(canvasElement);
    await expect(
      card.getByRole("region", { name: T.event.waitingLine.place.title }),
    ).toBeVisible();
    await expect(
      card.getByRole("button", { name: T.event.waitingLine.place.leave }),
    ).toBeVisible();
  },
};

/** Tickets came back and are held: until when, Accept and Decline. */
export const WaitingLineOffer: Story = {
  parameters: {
    verification: { caseId: "vc_63ed8216-0718-4e0e-9dcc-c4a1c46e228d" },
  },
  name: "Waiting line, offer",
  args: { mode: "onSale", signedIn: true, waitingLine: "offer" },
  play: async ({ canvasElement }) => {
    const card = vip(canvasElement);
    await expect(
      card.getByRole("button", { name: T.event.waitingLine.offer.accept }),
    ).toBeEnabled();
    await expect(
      card.getByRole("button", { name: T.event.waitingLine.offer.decline }),
    ).toBeEnabled();
  },
};

/** The offer lapsed: joining again goes to the back. */
export const WaitingLineOfferEnded: Story = {
  parameters: {
    verification: { caseId: "vc_56177bbd-ea3c-4c52-8867-019e52e8ec29" },
  },
  name: "Waiting line, offer ended",
  args: { mode: "onSale", signedIn: true, waitingLine: "offerEnded" },
  play: async ({ canvasElement }) => {
    await expect(
      vip(canvasElement).getByText(T.event.waitingLine.offerEnded),
    ).toBeVisible();
  },
};

/** A restricted event's page to its own audience: orders placed now are
 * real. */
export const RestrictedPreview: Story = {
  parameters: {
    verification: { caseId: "vc_daae536f-6cd5-49c5-926e-402a3b50b476" },
  },
  name: "Restricted preview",
  args: { preview: true, signedIn: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(T.event.restricted.title),
    ).toBeVisible();
  },
};

/** Signed in and already holding tickets: the banner leads to them. */
export const HoldingTickets: Story = {
  parameters: {
    verification: { caseId: "vc_d7cbe7cd-1c07-4676-bd23-cba7d9685c47" },
  },
  name: "Holding tickets",
  args: { holding: true, signedIn: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(T.event.youHaveTickets)).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: T.event.viewYourTickets }),
    ).toBeVisible();
    await expect(canvas.getByText(T.event.order.pointsPaidOnly)).toBeVisible();
  },
};

/** The show is over: every pass reads Sales Ended and there is no order. */
export const Ended: Story = {
  parameters: {
    verification: { caseId: "vc_8a4ab20e-9dbf-4f2f-a4fa-2d1a835d68d6" },
  },
  args: { mode: "eventOver" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(T.event.endedNotice.title)).toBeVisible();
    await expect(
      canvas.queryByRole("complementary", { name: T.event.order.title }),
    ).not.toBeInTheDocument();
  },
};

/** A cancelled event: the badge and the refund notice; no passes. */
export const Cancelled: Story = {
  parameters: {
    verification: { caseId: "vc_d1a83a4e-8409-4caf-bef8-655677df1d07" },
  },
  args: { mode: "cancelled" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(T.event.cancelledNotice.title)).toBeVisible();
    await expect(canvas.queryByRole("article")).not.toBeInTheDocument();
  },
};

/** The event on its way. */
export const Loading: Story = {
  parameters: {
    verification: { caseId: "vc_af93fe68-28cd-4fb7-b685-9f8b799761a0" },
  },
  render: () => <EventPageMessage kind="loading" />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("status", { name: T.event.loading }),
    ).toBeInTheDocument();
  },
};

/** No event at this address, signed out: Sign In, for a preview link. */
export const NoEvent: Story = {
  parameters: {
    verification: { caseId: "vc_0b4107e4-3c75-4b12-a994-e7fba021066c" },
  },
  name: "No event",
  render: () => <EventPageMessage kind="missing" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("heading", { name: T.event.notFound.title }),
    ).toBeVisible();
    await expect(
      canvas.getByText(T.event.notFound.bodySignedOut),
    ).toBeVisible();
  },
};

/** A restricted event this signed-in account is outside of. */
export const NotOpenToYou: Story = {
  parameters: {
    verification: { caseId: "vc_9d0cf415-c0f4-41de-a0ce-70e2e72d381b" },
  },
  name: "Not open to you yet",
  render: () => <EventPageMessage kind="closed" signedIn />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("heading", {
        name: T.event.notOpen.title,
      }),
    ).toBeVisible();
  },
};
