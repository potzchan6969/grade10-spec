import { Toast, toast } from "@grade10/design-system/components/overlays/toast";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import {
  SHARED_TICKET,
  SHARED_TICKET_COPY,
  SHARED_TICKET_SAVED_SAID,
  SHARED_TICKET_USED_TODAY,
} from "./fixtures";
import { SharedTicket } from "./shared-ticket";

const meta = {
  title: "Ticketing/Your Tickets/Blocks/SharedTicket",
  component: SharedTicket,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  /* A said toast must not outlive its story into the next file's frame. */
  beforeEach: () => () => {
    toast.dismiss();
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-[390px] px-4 py-5">
        {/* Mounted first, so a toast raised as the story mounts finds it. */}
        <Toast position="bottom-center" />
        <Story />
      </div>
    ),
  ],
  args: {
    copy: SHARED_TICKET_COPY,
    status: "valid",
    ticket: SHARED_TICKET,
    saved: false,
    onDownloadPdf: fn(),
    onSave: fn(),
    onViewMyTickets: fn(),
    onSaidDismiss: fn(),
  },
} satisfies Meta<typeof SharedTicket>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Opened from the link, signed out: the ticket, its code, the PDF and Save. */
export const Opened: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const card = canvas.getByRole("region", { name: "Ticket TKF3H8-4" });
    expect(within(card).getByText("Free")).toBeVisible();
    expect(within(card).getByText("For Jamie Wong")).toBeVisible();
    expect(within(card).getByText("Fast Pass on 1 day")).toBeVisible();
    expect(
      within(card).getByRole("img", { name: "Ticket code TKF3H8-4" }),
    ).toBeVisible();
    expect(within(card).getByText("TKF3H8-4")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Download PDF" }));
    expect(args.onDownloadPdf).toHaveBeenCalledTimes(1);
    await userEvent.click(
      canvas.getByRole("button", { name: "Save to My Tickets" }),
    );
    expect(args.onSave).toHaveBeenCalledTimes(1);
  },
};

/** The PDF is being made: Download PDF waits, Save stays free. */
export const Downloading: Story = {
  args: { downloading: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: "Download PDF" }),
    ).toHaveAttribute("aria-busy", "true");
    expect(
      canvas.getByRole("button", { name: "Save to My Tickets" }),
    ).not.toHaveAttribute("aria-busy");
  },
};

/** Saving, through the email sign-in it needs. */
export const Saving: Story = {
  args: { saving: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: "Save to My Tickets" }),
    ).toHaveAttribute("aria-busy", "true");
  },
};

/**
 * Saved, signed in with email: View My Tickets in place of Save, and the toast
 * that says so with View on it. The link keeps working.
 */
export const Saved: Story = {
  args: { saved: true, said: SHARED_TICKET_SAVED_SAID },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.queryByRole("button", { name: "Save to My Tickets" }),
    ).toBeNull();
    await userEvent.click(
      canvas.getByRole("button", { name: "View My Tickets" }),
    );
    expect(args.onViewMyTickets).toHaveBeenCalledTimes(1);
    const page = within(canvasElement.ownerDocument.body);
    await waitFor(() =>
      expect(page.getByText(SHARED_TICKET_SAVED_SAID)).toBeVisible(),
    );
  },
};

/** In today: the time it came in, and the code stays for the next day. */
export const UsedToday: Story = {
  args: { usedToday: SHARED_TICKET_USED_TODAY },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("status")).toHaveTextContent(
      SHARED_TICKET_USED_TODAY,
    );
    expect(
      canvas.getByRole("img", { name: "Ticket code TKF3H8-4" }),
    ).toBeVisible();
  },
};

/** No guest name and no Fast Pass: those lines leave the card. */
export const NoNameNoFastPass: Story = {
  args: { ticket: { ...SHARED_TICKET, guest: null, fastPass: null } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText("For Jamie Wong")).toBeNull();
    expect(canvas.queryByText("Fast Pass on 1 day")).toBeNull();
  },
};

/** Cancelled by whoever sent it: why, the ticket greyed, and no code. */
export const Cancelled: Story = {
  args: { status: "cancelled" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("This ticket was canceled.")).toBeVisible();
    expect(canvas.getByText("Canceled")).toBeVisible();
    expect(canvas.queryByRole("img", { name: /Ticket code/ })).toBeNull();
    expect(canvas.queryByRole("button")).toBeNull();
  },
};

/** An old link, after Replace code: no ticket, and who to ask. */
export const Replaced: Story = {
  args: { status: "replaced", ticket: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", {
        name: "This link was replaced by a new one",
      }),
    ).toBeVisible();
    expect(canvas.queryByRole("img", { name: /Ticket code/ })).toBeNull();
  },
};

/** The event is over: it says so, with the ticket greyed and no code. */
export const EventOver: Story = {
  args: { status: "over" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("[Show Name] has ended.")).toBeVisible();
    expect(canvas.getByText("Ended")).toBeVisible();
    expect(canvas.queryByRole("img", { name: /Ticket code/ })).toBeNull();
  },
};

/** Cancelled, and the answer carries no event or pass: the heading and why,
 * no card and no code. */
export const CancelledWithoutTicket: Story = {
  name: "Cancelled, No Ticket",
  args: { status: "cancelled", ticket: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("heading", { name: "Your Ticket" })).toBeVisible();
    expect(canvas.getByText("This ticket was canceled.")).toBeVisible();
    expect(canvas.queryByRole("region", { name: /^Ticket / })).toBeNull();
    expect(canvas.queryByRole("button")).toBeNull();
  },
};

/** The event is over, and the answer names no event: the sentence that
 * needs no name, no card. */
export const OverWithoutTicket: Story = {
  name: "Over, No Ticket",
  args: {
    status: "over",
    ticket: null,
    copy: {
      ...SHARED_TICKET_COPY,
      over: { ...SHARED_TICKET_COPY.over, title: "This event has ended." },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("heading", { name: "Your Ticket" })).toBeVisible();
    expect(canvas.getByText("This event has ended.")).toBeVisible();
    expect(canvas.queryByRole("region", { name: /^Ticket / })).toBeNull();
  },
};

/** A link that names no ticket. */
export const NotFound: Story = {
  args: { status: "not_found", ticket: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { name: "We can’t find this ticket" }),
    ).toBeVisible();
    expect(canvas.getByText("Check the link.")).toBeVisible();
  },
};
