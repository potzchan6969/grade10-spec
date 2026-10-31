import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { T, t } from "../ticketing-words";
import { DEVICE, PASSCODE } from "./door-content";
import { DoorPhone } from "./door-phone";

const D = T.door;

/**
 * The passcode door on a phone, the DoorPhone board: getting in with the
 * door lead's passcode, scanning, every answer, Undo and Use Fast Pass,
 * finding by reference, and the passcode changed. Enter the Passcode walks
 * the whole shift: the passcode is 482913, and the stand-in camera's
 * button reads the next code.
 */
const meta = {
  title: "Ticketing/Door/Screens/Door Phone",
  component: DoorPhone,
  parameters: {
    layout: "fullscreen",
    journeys: ["grade10-admin-ticketing-door-US-01"],
  },
  globals: { viewport: { value: "mobile2" } },
  args: { start: { at: "signIn", status: { kind: "ready" } } },
} satisfies Meta<typeof DoorPhone>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Getting in: the passcode and this phone's name, then the camera. */
export const EnterThePasscode: Story = {
  name: "Enter the passcode",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText(D.signIn.passcode), PASSCODE);
    await userEvent.type(
      canvas.getByLabelText(new RegExp(`^${D.signIn.deviceName}`)),
      DEVICE,
    );
    await userEvent.click(
      canvas.getByRole("button", { name: D.signIn.submit }),
    );
    await expect(await canvas.findByText(D.scanner.point)).toBeVisible();
  },
};

/** A wrong passcode: how many tries are left. */
export const WrongPasscode: Story = {
  name: "Wrong passcode",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText(D.signIn.passcode), "111111");
    await userEvent.type(
      canvas.getByLabelText(new RegExp(`^${D.signIn.deviceName}`)),
      DEVICE,
    );
    await userEvent.click(
      canvas.getByRole("button", { name: D.signIn.submit }),
    );
    await expect(
      await canvas.findByText(t(D.signIn.wrong, { left: 3 })),
    ).toBeVisible();
  },
};

/** Too many tries: the form waits. */
export const Slowed: Story = {
  name: "Slowed after 5 tries",
  args: {
    start: {
      at: "signIn",
      status: {
        kind: "slowed",
        lead: D.signIn.slowedTitle,
        message: t(D.signIn.slowedBody, { seconds: 30 }),
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(t(D.signIn.slowedBody, { seconds: 30 })),
    ).toBeVisible();
  },
};

/** The passcode is right but the door opens later. */
export const NotOpenYet: Story = {
  name: "Not open yet",
  args: {
    start: {
      at: "signIn",
      status: {
        kind: "notOpen",
        opensAt: t(D.signIn.notOpenTitle, {
          time: "09:00",
          date: "Sat 12 Dec",
        }),
        countdown: "16 h 42 min",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(D.signIn.notOpenUntil)).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: D.signIn.checkAgain }),
    ).toBeVisible();
  },
};

/** In: pointing at a code, today's count on this phone. */
export const Scanning: Story = {
  args: { start: { at: "scanner", status: "ready" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(D.scanner.point)).toBeVisible();
    await expect(canvas.getByText(D.scanner.countToday)).toBeVisible();
  },
};

/** The browser is asking for the camera. */
export const CameraAsks: Story = {
  name: "The camera asks",
  args: { start: { at: "scanner", status: "asking" } },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(D.scanner.cameraWhy),
    ).toBeVisible();
  },
};

export const CameraBlocked: Story = {
  name: "Camera blocked",
  args: { start: { at: "scanner", status: "blocked" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("heading", { name: D.scanner.blocked.title }),
    ).toBeVisible();
    await userEvent.click(
      canvas.getByRole("button", { name: D.scanner.blocked.action }),
    );
    await expect(
      await canvas.findByRole("textbox", { name: D.find.label }),
    ).toBeVisible();
  },
};

export const NoCamera: Story = {
  name: "No camera",
  args: { start: { at: "scanner", status: "noCamera" } },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("heading", {
        name: D.scanner.noCamera.title,
      }),
    ).toBeVisible();
  },
};

/** No connection: every scan reads Not checked until it is back. */
export const Offline: Story = {
  args: { start: { at: "scanner", status: "ready" }, offline: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(D.scanner.offline),
    ).toBeVisible();
  },
};

/** Admitted: Undo counts down beside Scan next; Use Fast Pass spends one,
 * and Undo Fast Pass gives it back. */
export const Admitted: Story = {
  args: { start: { at: "answer", answer: "admitted", undoFrom: 7 } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("status")).toHaveTextContent(
      D.answer.admitted.title,
    );
    await userEvent.click(
      canvas.getByRole("button", { name: D.answer.fastPass.use }),
    );
    await expect(
      canvas.getByText(t(D.answer.fastPass.usedLeft, { count: 1 })),
    ).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: D.answer.fastPass.undo }),
    ).toBeVisible();
  },
};

/** Undo pressed in time: the ticket can be scanned again. */
export const Undone: Story = {
  args: { start: { at: "answer", answer: "admitted", undoFrom: 9 } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /^Undo/ }));
    await waitFor(() =>
      expect(canvas.getByRole("status")).toHaveTextContent(
        D.answer.undone.title,
      ),
    );
  },
};

export const AlreadyIn: Story = {
  name: "Already in today",
  args: { start: { at: "answer", answer: "alreadyIn" } },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("status")).toHaveTextContent(
      D.answer.alreadyIn.title,
    );
  },
};

export const NoEntriesLeft: Story = {
  name: "No entries left",
  args: { start: { at: "answer", answer: "noEntriesLeft" } },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("status")).toHaveTextContent(
      D.answer.noEntriesLeft.title,
    );
  },
};

export const Void: Story = {
  name: "Refunded or cancelled",
  args: { start: { at: "answer", answer: "void" } },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(D.answer.void.note),
    ).toBeVisible();
  },
};

export const NotATicket: Story = {
  name: "Not a ticket",
  args: { start: { at: "answer", answer: "notATicket" } },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("status")).toHaveTextContent(
      D.answer.notATicket.title,
    );
  },
};

export const WrongEvent: Story = {
  name: "Wrong event",
  args: { start: { at: "answer", answer: "wrongEvent" } },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("status")).toHaveTextContent(
      D.answer.wrongEvent.title,
    );
  },
};

export const NotValidToday: Story = {
  name: "Not valid today",
  args: { start: { at: "answer", answer: "notValidToday" } },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("status")).toHaveTextContent(
      D.answer.notValidToday.title,
    );
  },
};

/** No answer in four seconds: don't let them in yet, and Try Again. */
export const NotChecked: Story = {
  name: "Not checked",
  args: { start: { at: "answer", answer: "notChecked" }, offline: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText(t(D.answer.notChecked.note, { seconds: 4 })),
    ).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: D.answer.tryAgain }),
    ).toBeVisible();
  },
};

/** Find by reference: the order's tickets, each with Admit or why not. */
export const FindByReference: Story = {
  name: "Find by reference",
  args: { start: { at: "find", query: "", result: { status: "idle" } } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(
      canvas.getByRole("textbox", { name: D.find.label }),
      "TK7Q2M{enter}",
    );
    await expect(
      await canvas.findByText(
        t(D.find.results, { count: 3, reference: "TK7Q2M" }),
      ),
    ).toBeVisible();
    await expect(canvas.getByText(D.find.inToday)).toBeVisible();
  },
};

export const ReferenceNotFound: Story = {
  name: "Reference not found",
  args: { start: { at: "find", query: "", result: { status: "idle" } } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(
      canvas.getByRole("textbox", { name: D.find.label }),
      "TK7Q2N{enter}",
    );
    await expect(await canvas.findByText(D.find.notFound)).toBeVisible();
  },
};

/** The passcode was changed in the console: every phone signed out. */
export const PasscodeChanged: Story = {
  name: "Passcode changed",
  args: { start: { at: "passcodeChanged" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("heading", { name: D.passcodeChanged.title }),
    ).toBeVisible();
    await userEvent.click(
      canvas.getByRole("button", { name: D.passcodeChanged.action }),
    );
    await expect(
      await canvas.findByRole("heading", { name: D.signIn.title }),
    ).toBeVisible();
  },
};
