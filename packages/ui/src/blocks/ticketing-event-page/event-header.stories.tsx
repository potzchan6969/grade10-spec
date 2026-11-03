import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { EventHeader } from "./event-header";

const meta = {
  title: "Ticketing/Buying/Blocks/EventHeader",
  component: EventHeader,
  parameters: { layout: "padded" },
  args: {
    title: "[Show Name]",
    days: "Sat 12 Dec and Sun 13 Dec 2026",
    hours: "10:00 to 19:00 each day",
    venue: "[Venue], Hong Kong",
    about: "[One line about the show: Product]",
  },
} satisfies Meta<typeof EventHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The title, the days, hours and venue, and the line about the show. */
export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_4d90a52b-638b-4d40-8f19-4b6b74533358" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("heading", { level: 1, name: "[Show Name]" }),
    ).toBeVisible();
    await expect(canvas.getByText("[Venue], Hong Kong")).toBeVisible();
  },
};

/** At 390 px: a smaller title and facts. */
export const Phone: Story = {
  parameters: {
    verification: { caseId: "vc_520759a1-a73d-455e-8e92-d65dc6b4b3f7" },
  },
  decorators: [
    (Story) => (
      <div className="w-[358px]">
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 1 })).toBeVisible();
  },
};

/** Day 2 of the event: On Today. */
export const OnToday: Story = {
  parameters: {
    verification: { caseId: "vc_40fd982c-8dd6-4acb-923c-b88f75bb3f26" },
  },
  name: "On Today",
  args: {
    badges: [{ label: "On Today", tone: "today" }],
    days: "Sat 12 Dec and Sun 13 Dec 2026 (today)",
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText("On Today")).toBeVisible();
  },
};

/** Signed in and holding tickets: the banner leads to them. */
export const HoldingTickets: Story = {
  parameters: {
    verification: { caseId: "vc_608046fa-8cdc-4852-81d5-3643f8c0ca48" },
  },
  name: "Holding Tickets",
  args: {
    notices: [
      {
        kind: "holding",
        id: "holding",
        text: "You have tickets for this show.",
        actionLabel: "View Your Tickets",
        onAction: fn(),
      },
    ],
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "View Your Tickets" }),
    );
    const notice = args.notices?.[0];
    if (notice?.kind === "holding")
      await expect(notice.onAction).toHaveBeenCalledOnce();
  },
};

/** A restricted event's preview to its own audience. */
export const RestrictedPreview: Story = {
  parameters: {
    verification: { caseId: "vc_bf891731-13a8-4b2f-b04f-573bd8aed783" },
  },
  name: "Restricted Preview",
  args: {
    notices: [
      {
        kind: "alert",
        id: "preview",
        tone: "default",
        title: "Preview: only staff and allowed addresses can buy.",
        description:
          "The public sale hasn’t started. Orders placed now are real.",
      },
    ],
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(
        "The public sale hasn’t started. Orders placed now are real.",
      ),
    ).toBeVisible();
  },
};

/** A canceled event: the badge and the refund notice. */
export const Canceled: Story = {
  parameters: {
    verification: { caseId: "vc_b0f81017-da27-48f8-a59e-93ebfd198bee" },
  },
  args: {
    badges: [{ label: "Canceled", tone: "canceled" }],
    notices: [
      {
        kind: "alert",
        id: "canceled",
        tone: "error",
        title: "This event is canceled.",
        description:
          "Every order is refunded in full to the card or WeChat Pay it was paid with. We’ve emailed everyone who bought tickets.",
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Canceled")).toBeVisible();
    await expect(canvas.getByText("This event is canceled.")).toBeVisible();
  },
};

/** The event is over. */
export const Ended: Story = {
  parameters: {
    verification: { caseId: "vc_85646fa7-64ad-4778-b332-3aa4edf61fe5" },
  },
  args: {
    badges: [{ label: "Ended", tone: "ended" }],
    notices: [
      {
        kind: "alert",
        id: "over",
        tone: "default",
        title: "This event has ended.",
        description:
          "Thanks to everyone who came. Your tickets stay in Your Tickets.",
      },
    ],
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText("This event has ended."),
    ).toBeVisible();
  },
};
