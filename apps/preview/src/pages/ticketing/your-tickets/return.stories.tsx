import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import {
  navigateToStory,
  TICKETING_STORY_IDS,
} from "../../workbench-story-nav";
import { BUYER, T, t } from "../ticketing-words";
import { ReturnScreen } from "./order-screens";

/**
 * Back from Stripe, the ReturnPhone board: the wait while the payment is
 * confirmed, and every way the return can settle other than paid (paid is
 * the Order screen's Paid). On Confirming the payment lands after a few
 * seconds and the order opens.
 */
const meta = {
  title: "Ticketing/Your Tickets/Screens/Return",
  component: ReturnScreen,
  parameters: {
    layout: "fullscreen",
    journeys: ["grade10-site-ticketing-buying-US-01"],
  },
  args: {
    state: "confirming",
    onChooseAgain: () => navigateToStory(TICKETING_STORY_IDS.event),
    onSignIn: () => navigateToStory(TICKETING_STORY_IDS.yourTicketsSignedOut),
  },
} satisfies Meta<typeof ReturnScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The wait: nothing closes it. */
export const Confirming: Story = {
  parameters: {
    verification: { caseId: "vc_dcf8ecad-e604-41d6-8c3a-e85cebca2cbe" },
  },
  args: {
    landsAfter: 4,
    /* Only in the workbench's own window: a test run stays put. */
    onLanded: () => {
      if (window.top?.location.search.includes("path=/story/"))
        navigateToStory(TICKETING_STORY_IDS.paid);
    },
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    const dialog = await body.findByRole("dialog", {
      name: T.return.confirming.title,
    });
    await waitFor(() => expect(dialog).toBeVisible());
    await expect(
      body.queryByRole("button", { name: T.common.close }),
    ).not.toBeInTheDocument();
  },
};

/** A minute on: the tickets follow by email, and it may close. */
export const SafeToClose: Story = {
  parameters: {
    verification: { caseId: "vc_db1127f3-d33b-4b2b-b824-f8b318c29f9b" },
  },
  name: "Safe to close",
  args: { state: "safeToClose" },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    const dialog = await body.findByRole("dialog", {
      name: T.return.stillConfirming.title,
    });
    await waitFor(() =>
      expect(
        within(dialog).getByText(
          t(T.common.reference, { reference: BUYER.reference }),
        ),
      ).toBeVisible(),
    );
    await expect(
      within(dialog).getAllByRole("button", { name: T.common.close }).length,
    ).toBeGreaterThan(0);
  },
};

/** Went back from Stripe: the tickets let go, nothing charged. */
export const WentBack: Story = {
  parameters: {
    verification: { caseId: "vc_a3d617be-5082-4b66-9d57-080d74730604" },
  },
  name: "Went back",
  args: { state: "wentBack" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("heading", { name: T.return.wentBack.title }),
    ).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: T.return.wentBack.action }),
    ).toBeVisible();
  },
};

/** The hold ran out before paying. */
export const HoldRanOut: Story = {
  parameters: {
    verification: { caseId: "vc_3f6dc298-35c3-4a07-a8ff-281e340d68ec" },
  },
  name: "Hold ran out",
  args: { state: "holdRanOut" },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("heading", {
        name: t(T.return.holdRanOut.title, { minutes: 15 }),
      }),
    ).toBeVisible();
  },
};

/** Paid after the hold ended and the tickets had gone: refunding. */
export const PaidTooLate: Story = {
  parameters: {
    verification: { caseId: "vc_cbb08ca2-8406-4a8b-91a0-39eeccf4ab88" },
  },
  name: "Paid too late",
  args: { state: "paidTooLate" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("heading", { name: T.return.paidTooLate.title }),
    ).toBeVisible();
    await expect(canvas.getByText(T.return.paidTooLate.badge)).toBeVisible();
  },
};

/** Another browser, or a shared link: sign in with the order's email. */
export const OtherBrowser: Story = {
  parameters: {
    verification: { caseId: "vc_cb38f98b-a4bf-468e-a31c-9557a415372d" },
  },
  name: "Other browser",
  args: { state: "otherBrowser" },
  play: async ({ canvasElement }) => {
    await expect(
      within(within(canvasElement).getByRole("main")).getByRole("button", {
        name: T.common.signInWithEmail,
      }),
    ).toBeVisible();
  },
};

/** Signed in, but not with the order's email. */
export const NotTheirs: Story = {
  parameters: {
    verification: { caseId: "vc_04c97b42-defd-48fc-bb4a-aad57425d3f3" },
  },
  name: "Signed in, not theirs",
  args: { state: "notTheirs" },
  play: async ({ canvasElement }) => {
    const canvas = within(within(canvasElement).getByRole("main"));
    await expect(
      canvas.getByRole("button", { name: T.return.notTheirs.anotherEmail }),
    ).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: T.common.signOut }),
    ).toBeVisible();
  },
};
