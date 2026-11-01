import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { DoorAnswer } from "./door-answer";
import { DoorUndoBar } from "./door-undo-bar";
import { answerCopy, undoCopy } from "./fixtures";

const details = [
  { label: "Name", value: "Alex Chan" },
  { label: "Pass", value: "General Pass (Two-Day), Adult" },
  { label: "Ticket", value: "TK7Q2M-1", code: true },
  { label: "Today", value: "Day 1 of 2 it admits" },
];

const meta = {
  title: "Ticketing/Door/Blocks/DoorAnswer/Console",
  component: DoorAnswer,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-[620px]">
        <Story />
      </div>
    ),
  ],
  args: {
    layout: "console",
    kind: "admitted",
    title: "Admitted",
    line: "Let them in.",
    details,
    fastPass: { state: "available", label: "Fast Pass: 2 left" },
    undo: (
      <DoorUndoBar
        copy={undoCopy}
        onUndo={fn()}
        remaining="6 s"
        secondsLeft={6}
        size="md"
        totalSeconds={10}
      />
    ),
    copy: answerCopy,
    onScanNext: fn(),
    onUseFastPass: fn(),
    onUndoFastPass: fn(),
  },
} satisfies Meta<typeof DoorAnswer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The console's door at its own width: Use Fast Pass beside the line. */
export const Admitted: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("status")).toHaveTextContent("Admitted");
    await userEvent.click(
      canvas.getByRole("button", { name: "Use Fast Pass" }),
    );
    await expect(args.onUseFastPass).toHaveBeenCalledOnce();
  },
};

export const FastPassUsed: Story = {
  name: "Fast Pass used",
  args: { fastPass: { state: "used", label: "Fast Pass used · 1 left" } },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("button", { name: "Undo Fast Pass" }),
    ).toBeVisible();
  },
};

export const AlreadyAdmitted: Story = {
  name: "Already admitted today",
  args: {
    kind: "alreadyAdmitted",
    title: "Already in today",
    line: "Don’t let them in again.",
    fastPass: undefined,
    undo: undefined,
    details: [
      { label: "Name", value: "Ben Chan" },
      { label: "Pass", value: "General Pass (Two-Day), Adult" },
      { label: "Ticket", value: "TK7Q2M-2", code: true },
      { label: "Let in", value: "10:31 today" },
      { label: "By", value: "Gate A phone 1" },
      { label: "Fast Pass", value: "None on this ticket" },
    ],
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("status")).toHaveTextContent(
      "Already in today",
    );
  },
};

export const Void: Story = {
  args: {
    kind: "void",
    title: "Refunded or canceled",
    line: "This ticket no longer lets anyone in.",
    fastPass: undefined,
    undo: undefined,
    details: [
      { label: "Name", value: "Jo Wong" },
      { label: "Pass", value: "General Pass (Two-Day), Child" },
      { label: "Ticket", value: "TK9F4D-2", code: true },
      { label: "Refunded", value: "20 Nov 2026 by Kit Lau" },
    ],
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText("20 Nov 2026 by Kit Lau"),
    ).toBeVisible();
  },
};

export const NotChecked: Story = {
  name: "Not checked",
  args: {
    kind: "notChecked",
    title: "Not checked",
    line: "Don’t let them in yet.",
    fastPass: undefined,
    undo: undefined,
    details: [
      { label: "Code", value: "TK7Q2M-1", code: true },
      { label: "Why", value: "No answer in 4 seconds" },
    ],
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("status")).toHaveTextContent(
      "Not checked",
    );
  },
};
