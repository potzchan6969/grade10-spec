import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import {
  navigateToStory,
  TICKETING_STORY_IDS,
} from "../../workbench-story-nav";
import { T, t } from "../ticketing-words";
import { SharedTicketScreen } from "./tickets-screens";

/**
 * A free ticket's own link, the FreeTicketPhone board: the ticket with its
 * code, Save to My Tickets, and every way a link can stop working.
 */
const meta = {
  title: "Ticketing/Your Tickets/Screens/Shared Ticket",
  component: SharedTicketScreen,
  parameters: {
    layout: "fullscreen",
    journeys: ["grade10-site-ticketing-your-tickets-US-01"],
  },
  args: {
    state: "valid",
    onViewMyTickets: () => navigateToStory(TICKETING_STORY_IDS.yourTickets),
  },
} satisfies Meta<typeof SharedTicketScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const main = (canvasElement: HTMLElement) =>
  within(within(canvasElement).getByRole("main"));

/** The ticket, its code, Download PDF and Save to My Tickets. */
export const Valid: Story = {
  parameters: {
    verification: { caseId: "vc_992f9687-e611-4edb-a04b-76bdcfa5e1b6" },
  },
  play: async ({ canvasElement }) => {
    const canvas = main(canvasElement);
    await expect(
      canvas.getByRole("img", {
        name: t(T.sharedTicket.codeLabel, { code: "TKF3H8-4" }),
      }),
    ).toBeVisible();
    await expect(canvas.getByText(T.sharedTicket.free)).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: T.sharedTicket.save }),
    ).toBeVisible();
  },
};

/** Save pressed: the toast says so, and View My Tickets takes Save's
 * place. */
export const Saved: Story = {
  parameters: {
    verification: { caseId: "vc_91350118-ed20-4c85-ae83-82a9595c501e" },
  },
  play: async ({ canvasElement }) => {
    const canvas = main(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: T.sharedTicket.save }),
    );
    await expect(
      await canvas.findByRole("button", { name: T.sharedTicket.viewMyTickets }),
    ).toBeVisible();
    await expect(
      (
        await within(canvasElement.ownerDocument.body).findAllByText(
          T.sharedTicket.saved,
        )
      )[0],
    ).toBeInTheDocument();
  },
};

/** In today: the code stays for the next day. */
export const UsedToday: Story = {
  parameters: {
    verification: { caseId: "vc_8d0d0edb-5348-4699-b0e7-16d58c1c3e20" },
  },
  name: "Used today",
  args: { state: "usedToday" },
  play: async ({ canvasElement }) => {
    await expect(
      main(canvasElement).getByText(
        t(T.sharedTicket.usedToday, { time: "10:42", day: "tomorrow" }),
      ),
    ).toBeVisible();
  },
};

export const Cancelled: Story = {
  parameters: {
    verification: { caseId: "vc_412813ab-eb19-4ab8-a051-217c41242bab" },
  },
  args: { state: "cancelled" },
  play: async ({ canvasElement }) => {
    const canvas = main(canvasElement);
    await expect(
      canvas.getByText(T.sharedTicket.dead.cancelled.title),
    ).toBeVisible();
    await expect(canvas.queryByRole("img", { name: /Ticket code/ })).toBeNull();
  },
};

export const Replaced: Story = {
  parameters: {
    verification: { caseId: "vc_7496bc43-61bc-4ea1-8542-968f4d58993d" },
  },
  args: { state: "replaced" },
  play: async ({ canvasElement }) => {
    await expect(
      main(canvasElement).getByText(T.sharedTicket.dead.replaced.title),
    ).toBeVisible();
  },
};

export const EventOver: Story = {
  parameters: {
    verification: { caseId: "vc_0379c03c-1bad-4288-bad9-0a8c644ea022" },
  },
  name: "Event over",
  args: { state: "over" },
  play: async ({ canvasElement }) => {
    await expect(
      main(canvasElement).getByText(T.sharedTicket.dead.over.body),
    ).toBeVisible();
  },
};

/** Cancelled, and the answer carries no event or pass: why, under the
 * heading, with no card. */
export const CancelledNoTicket: Story = {
  parameters: {
    verification: { caseId: "vc_b019f018-dcaf-4bb0-8550-2a9f4792f464" },
  },
  name: "Cancelled, no ticket",
  args: { state: "cancelledNoTicket" },
  play: async ({ canvasElement }) => {
    const canvas = main(canvasElement);
    await expect(
      canvas.getByRole("heading", { name: T.sharedTicket.title }),
    ).toBeVisible();
    await expect(
      canvas.getByText(T.sharedTicket.dead.cancelled.title),
    ).toBeVisible();
    await expect(canvas.queryByRole("region", { name: /^Ticket / })).toBeNull();
  },
};

/** Over, and the answer names no event: the sentence that needs no name. */
export const OverNoTicket: Story = {
  parameters: {
    verification: { caseId: "vc_42694958-ab61-4585-a932-e39f7da6aadf" },
  },
  name: "Event over, no ticket",
  args: { state: "overNoTicket" },
  play: async ({ canvasElement }) => {
    const canvas = main(canvasElement);
    await expect(
      canvas.getByText(T.sharedTicket.dead.overNoEvent.title),
    ).toBeVisible();
    await expect(canvas.queryByRole("region", { name: /^Ticket / })).toBeNull();
  },
};

export const NotFound: Story = {
  parameters: {
    verification: { caseId: "vc_38dcc066-444b-4107-ba02-bad435345a1b" },
  },
  name: "Not found",
  args: { state: "not_found" },
  play: async ({ canvasElement }) => {
    await expect(
      main(canvasElement).getByText(T.sharedTicket.dead.notFound.title),
    ).toBeVisible();
  },
};
