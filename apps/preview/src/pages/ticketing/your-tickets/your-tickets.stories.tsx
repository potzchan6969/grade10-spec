import { getMessages } from "@grade10/i18n";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import {
  navigateToStory,
  TICKETING_STORY_IDS,
} from "../../workbench-story-nav";
import { BUYER, T, t } from "../ticketing-words";
import { YourTicketsScreen } from "./tickets-screens";

const SIGN_IN = getMessages("grade10", "en").signIn;

/**
 * Your Tickets, the YourTickets board: every order on the account, newest
 * first. Signed out it asks for the buying email; a guest's orders join
 * the account when the link brings them back.
 */
const meta = {
  title: "Ticketing/Your Tickets/Screens/Your Tickets",
  component: YourTicketsScreen,
  parameters: {
    layout: "fullscreen",
    journeys: ["grade10-site-ticketing-your-tickets-US-02"],
  },
  args: {
    state: "list",
    onOpenOrder: () => navigateToStory(TICKETING_STORY_IDS.order),
  },
} satisfies Meta<typeof YourTicketsScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const main = (canvasElement: HTMLElement) =>
  within(within(canvasElement).getByRole("main"));

/** Every order, newest first, the held one asking to pay. */
export const List: Story = {
  play: async ({ canvasElement }) => {
    const canvas = main(canvasElement);
    await expect(
      canvas.getByRole("heading", { level: 1, name: T.myTickets.title }),
    ).toBeVisible();
    await expect(canvas.getAllByRole("article")).toHaveLength(5);
    await expect(
      canvas.getByRole("button", { name: T.myTickets.continue }),
    ).toBeVisible();
  },
};

/** Signed out: Sign In with Email, and where a guest's tickets are. */
export const SignedOut: Story = {
  name: "Signed out",
  args: { state: "signedOut" },
  play: async ({ canvasElement }) => {
    const canvas = main(canvasElement);
    await expect(
      canvas.getByRole("heading", { name: T.myTickets.signedOut.title }),
    ).toBeVisible();
    await expect(canvas.getByText(T.myTickets.signedOut.note)).toBeVisible();
  },
};

/** Sign In with Email, an email, then Check Your Email. */
export const CheckYourEmail: Story = {
  name: "Check your email",
  args: { state: "signedOut" },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      main(canvasElement).getByRole("button", {
        name: T.common.signInWithEmail,
      }),
    );
    const body = within(canvasElement.ownerDocument.body);
    const dialog = await body.findByRole("dialog");
    await userEvent.type(
      within(dialog).getByRole("textbox", { name: SIGN_IN.emailLabel }),
      BUYER.email,
    );
    await userEvent.click(
      within(dialog).getByRole("button", { name: SIGN_IN.sendLinkLabel }),
    );
    await waitFor(() =>
      expect(
        body.getByRole("heading", { name: SIGN_IN.linkSentTitle }),
      ).toBeVisible(),
    );
  },
};

/** Back from the link: the guest's orders listed, and the toast says the
 * points are on the account. */
export const BackFromTheLink: Story = {
  name: "Back from the link",
  args: { state: "backFromTheLink" },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    await expect(
      (await body.findAllByText(T.myTickets.signedIn.title))[0],
    ).toBeInTheDocument();
    await expect(
      body.getAllByText(t(T.myTickets.signedIn.points, { points: 115 }))[0],
    ).toBeInTheDocument();
  },
};

/** No orders yet: the way to the shows. */
export const Empty: Story = {
  args: { state: "empty" },
  play: async ({ canvasElement }) => {
    await expect(
      main(canvasElement).getByRole("heading", {
        name: T.myTickets.empty.title,
      }),
    ).toBeVisible();
  },
};

export const Loading: Story = {
  args: { state: "loading" },
  play: async ({ canvasElement }) => {
    await expect(
      main(canvasElement).getByRole("status", { name: T.myTickets.loading }),
    ).toBeInTheDocument();
  },
};

/** The list could not load: Try Again. */
export const Failed: Story = {
  name: "Load failed",
  args: { state: "failed" },
  play: async ({ canvasElement }) => {
    await expect(main(canvasElement).getByRole("alert")).toHaveTextContent(
      T.myTickets.failed.title,
    );
  },
};
