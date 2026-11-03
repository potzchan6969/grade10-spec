import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import {
  navigateToStory,
  TICKETING_STORY_IDS,
} from "../../workbench-story-nav";
import { BUYER, plain, T, t } from "../ticketing-words";
import { ReviewPage } from "./checkout-pages";

/** Pay leaves for Stripe's page; the workbench lands on the return. */
const payThenReturn = () =>
  window.setTimeout(
    () => navigateToStory(TICKETING_STORY_IDS.confirming),
    1200,
  );

/**
 * Check Your Order, the ReviewPhone board: the details read back with
 * Edit, the order with its code field and points, the tick, and Pay.
 */
const meta = {
  title: "Ticketing/Buying/Screens/Check Your Order",
  component: ReviewPage,
  parameters: {
    layout: "fullscreen",
    journeys: ["grade10-site-ticketing-buying-US-01"],
  },
  args: {
    onBack: () => navigateToStory(TICKETING_STORY_IDS.details),
    onEdit: () => navigateToStory(TICKETING_STORY_IDS.details),
    onPay: payThenReturn,
  },
} satisfies Meta<typeof ReviewPage>;

export default meta;
type Story = StoryObj<typeof meta>;

const GUEST_STATEMENT = plain(T.review.agreeGuest);

/** A guest before ticking: the guest's agreement keeps the tickets in a
 * Grade10 account for the email. */
export const Guest: Story = {
  parameters: {
    verification: { caseId: "vc_89246678-666b-4c6f-b79b-694d3cbecfd1" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("heading", { level: 1, name: T.review.title }),
    ).toBeVisible();
    await expect(canvas.getByText(BUYER.email)).toBeVisible();
    await expect(
      canvas.getByRole("checkbox", { name: GUEST_STATEMENT }),
    ).not.toBeChecked();
    await expect(
      canvas.getByText(
        t(T.review.pointsGuest, { points: "115", email: BUYER.email }),
      ),
    ).toBeVisible();
    await expect(
      canvas.getByRole("button", {
        name: t(T.review.pay, { amount: "HK$1,150.00" }),
      }),
    ).toBeVisible();
  },
};

/** Signed in: the Terms of Sale only, and the points go to the account. */
export const SignedIn: Story = {
  parameters: {
    verification: { caseId: "vc_af1c56d4-c5ee-4fb7-bab7-c6696daab5e3" },
  },
  name: "Signed in",
  args: { signedIn: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("checkbox", { name: plain(T.review.agreeSignedIn) }),
    ).toBeVisible();
    await expect(canvas.getByText(T.review.agreeSignedInNote)).toBeVisible();
  },
};

/** Pay pressed unticked: the card and the bar say to tick first, and
 * nothing is paid. */
export const NotAgreed: Story = {
  parameters: {
    verification: { caseId: "vc_f57879e3-0870-4d7d-abc9-aae5375fff3c" },
  },
  name: "Pay pressed unticked",
  args: { onPay: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", {
        name: t(T.review.pay, { amount: "HK$1,150.00" }),
      }),
    );
    await expect(await canvas.findByText(T.review.notAgreed)).toBeVisible();
    await expect(canvas.getByText(T.review.notAgreedBar)).toBeVisible();
    await expect(args.onPay).not.toHaveBeenCalled();
  },
};

/** A crowd at Pay: still trying after three seconds. */
export const Slow: Story = {
  parameters: {
    verification: { caseId: "vc_dca137fb-fd71-4b44-a342-a14c6dc3e9d5" },
  },
  name: "Slow after 3 s",
  args: { defaultAgreed: true, payState: "slow" },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText(T.review.slow)).toBeVisible();
  },
};

/** Ticked and paid: the payment page is on its way. */
export const OpeningPayment: Story = {
  parameters: {
    verification: { caseId: "vc_9ff59680-bd99-4953-bbb8-0c911585a233" },
  },
  name: "Opening payment",
  args: { defaultAgreed: true, payState: "opening" },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(T.review.opening),
    ).toBeVisible();
  },
};

/** The early bird ended while the buyer was here: what changed. */
export const EarlyBirdEnded: Story = {
  parameters: {
    verification: { caseId: "vc_ea3f212e-6345-4600-b8c2-f43746be256d" },
  },
  name: "Early bird ended here",
  args: { priceChanged: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText(t(T.review.priceChanged.title, { time: "23:59" })),
    ).toBeVisible();
    await expect(
      canvas.getByRole("button", {
        name: t(T.review.pay, { amount: "HK$1,400.00" }),
      }),
    ).toBeVisible();
  },
};

/** A free order: Get Tickets, nothing charged, no points. */
export const FreeOrder: Story = {
  parameters: {
    verification: { caseId: "vc_7f96b2c0-5055-47d8-b097-b6ca0d08d89a" },
  },
  name: "Free order",
  args: { code: "CREW4" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("button", { name: T.review.getTickets }),
    ).toBeVisible();
    await expect(canvas.getByText(T.review.notes.nothingCharged)).toBeVisible();
    await expect(
      canvas.getByText(t(T.promo.freeOrder, { code: "CREW4" })),
    ).toBeVisible();
  },
};
