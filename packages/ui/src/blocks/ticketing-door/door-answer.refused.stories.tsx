import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { DoorAnswer } from "./door-answer";
import { DoorPhoneFrame } from "./door-phone-frame";
import { answerCopy, frameCopy } from "./fixtures";

const OFFLINE = "No connection. Every scan reads Not checked until it is back.";

const meta = {
  title: "Ticketing/Door/Blocks/DoorAnswer/Refused",
  component: DoorAnswer,
  tags: ["autodocs"],
  decorators: [
    (Story, { parameters }) => (
      <DoorPhoneFrame
        className="h-[844px] min-h-0 w-[390px] border border-border"
        copy={frameCopy}
        mode="signedIn"
        offlineNotice={parameters.offline ? OFFLINE : undefined}
        onFindByReference={fn()}
        onOpenMenu={fn()}
        title="Gate A phone 1"
      >
        <Story />
      </DoorPhoneFrame>
    ),
  ],
  args: {
    layout: "phone",
    kind: "alreadyAdmitted",
    title: "Already in today",
    line: "Don’t let them in again.",
    copy: answerCopy,
    onScanNext: fn(),
  },
} satisfies Meta<typeof DoorAnswer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Let in earlier today: when, by which phone, and Fast Pass then. */
export const AlreadyAdmitted: Story = {
  parameters: {
    verification: { caseId: "vc_ea480720-edc2-42aa-a36c-b98d57401ad7" },
  },
  name: "Already admitted today",
  args: {
    details: [
      { label: "Name", value: "Alex" },
      { label: "Pass", value: "General Pass (Two-Day), Adult" },
      { label: "Ticket", value: "TK7Q2M-1", code: true },
      { label: "Let in", value: "11:42 today" },
      { label: "By", value: "Gate B phone 2" },
      { label: "Fast Pass", value: "Used then, 1 left" },
      { label: "Days left", value: "Sun 13 Dec" },
    ],
    note: "If they say they never came in, a supervisor checks the time and the gate in the console.",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("status")).toHaveTextContent(
      "Already in today",
    );
    await expect(canvas.getByText("Gate B phone 2")).toBeVisible();
    await expect(
      canvas.queryByRole("button", { name: "Use Fast Pass" }),
    ).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Scan next" }));
    await expect(args.onScanNext).toHaveBeenCalledOnce();
  },
};

/** Let in on every day it admits. */
export const NoEntriesLeft: Story = {
  parameters: {
    verification: { caseId: "vc_357fd622-3dca-43c8-98dc-f25be0fb872e" },
  },
  name: "No entries left",
  args: {
    kind: "noEntriesLeft",
    title: "No entries left",
    line: "This ticket has been let in on every day it admits.",
    details: [
      { label: "Name", value: "Sam" },
      { label: "Pass", value: "General Pass (One-Day), Adult" },
      { label: "Ticket", value: "TK3H8P-1", code: true },
      { label: "Let in", value: "Sat 12 Dec, 10:14" },
      { label: "By", value: "Gate A phone 1" },
    ],
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("status")).toHaveTextContent(
      "No entries left",
    );
  },
};

/** Its order was refunded or cancelled; the order's other tickets may be good. */
export const Void: Story = {
  parameters: {
    verification: { caseId: "vc_de3a9676-9c36-4fdd-87c6-98bed11e22aa" },
  },
  name: "Void",
  args: {
    kind: "void",
    title: "Refunded or canceled",
    line: "This ticket no longer lets anyone in.",
    details: [
      { label: "Name", value: "Jo" },
      { label: "Pass", value: "General Pass (Two-Day), Child" },
      { label: "Ticket", value: "TK9F4D-2", code: true },
      { label: "Order", value: "TK9F4D", code: true },
    ],
    note: "Send them to the help desk. The order’s other tickets may still be good.",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("status")).toHaveTextContent(
      "Refunded or canceled",
    );
    await expect(canvas.getByText(/help desk/)).toBeVisible();
  },
};

/** The event was cancelled, so no ticket for it lets anyone in. */
export const EventCancelled: Story = {
  parameters: {
    verification: { caseId: "vc_c1a457fa-5abb-44cc-aaf9-b4945d7c5d74" },
  },
  name: "Event cancelled",
  args: {
    kind: "eventCancelled",
    title: "Event canceled",
    line: "This event was canceled. Don’t let them in.",
    details: [
      { label: "Name", value: "Alex" },
      { label: "Ticket", value: "TK7Q2M-1", code: true },
    ],
    note: "Every order was refunded. Send them to the help desk with questions.",
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("status")).toHaveTextContent(
      "Event canceled",
    );
  },
};

/** Not a ticket: forged, damaged or unknown. Find by reference is offered. */
export const NotATicket: Story = {
  parameters: {
    verification: { caseId: "vc_5ea64db0-823f-4a75-b073-15bdaacb7212" },
  },
  name: "Not a ticket",
  args: {
    kind: "notATicket",
    title: "Not valid",
    line: "This code isn’t a ticket for this event.",
    note: "Ask for the email with the tickets, or find the order by its reference.",
    onFindByReference: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("status")).toHaveTextContent("Not valid");
    // The header's icon button shares the name; the block's own is last.
    const [, ownFind] = canvas.getAllByRole("button", {
      name: "Find by reference",
    });
    await userEvent.click(ownFind);
    await expect(args.onFindByReference).toHaveBeenCalledOnce();
  },
};

/** A real ticket, for another event. */
export const WrongEvent: Story = {
  parameters: {
    verification: { caseId: "vc_35622091-e623-41e9-837f-ff0ac0de489e" },
  },
  name: "Wrong event",
  args: {
    kind: "wrongEvent",
    title: "Wrong event",
    line: "This ticket is for another event.",
    details: [
      { label: "Event", value: "Grade10 Winter Show" },
      { label: "Days", value: "Sat 9 Jan 2027" },
      { label: "Ticket", value: "TK5R2W-1", code: true },
    ],
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("status")).toHaveTextContent(
      "Wrong event",
    );
  },
};

/** Today is outside the ticket's days. */
export const NotValidToday: Story = {
  parameters: {
    verification: { caseId: "vc_b5a290f2-aeb6-4201-9694-a03f35c385bb" },
  },
  name: "Not valid today",
  args: {
    kind: "notValidToday",
    title: "Not valid today",
    line: "This ticket is for another day.",
    details: [
      { label: "Name", value: "Sam" },
      { label: "Pass", value: "General Pass (One-Day), Adult" },
      { label: "Ticket", value: "TK3H8P-1", code: true },
      { label: "Its day", value: "Sun 13 Dec" },
    ],
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("status")).toHaveTextContent(
      "Not valid today",
    );
  },
};

/** No answer in 4 seconds, or no connection: don't let them in yet. */
export const NotChecked: Story = {
  name: "Not checked, offline",
  parameters: {
    verification: { caseId: "vc_43e2d2bb-d205-4912-9bed-f48d38eaaabf" },
    offline: true,
  },
  args: {
    kind: "notChecked",
    title: "Not checked",
    line: "Don’t let them in yet.",
    note: "No answer in 4 seconds, so we can’t tell if this ticket was used. Try again. If the connection stays down, write the reference on the paper list and wait for a supervisor.",
    details: [
      { label: "Code", value: "TK7Q2M-1", code: true },
      { label: "Tried", value: "14:05:22" },
    ],
    onTryAgain: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText(
        "No connection. Every scan reads Not checked until it is back.",
      ),
    ).toBeVisible();
    await expect(
      canvas.getByText("Not checked", { selector: "span" }),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Try Again" }));
    await expect(args.onTryAgain).toHaveBeenCalledOnce();
  },
};
