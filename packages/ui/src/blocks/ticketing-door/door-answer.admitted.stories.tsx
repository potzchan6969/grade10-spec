import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import { DoorAnswer, type DoorAnswerProps } from "./door-answer";
import { DoorPhoneFrame } from "./door-phone-frame";
import { DoorUndoBar } from "./door-undo-bar";
import { alexDetails, answerCopy, frameCopy, undoCopy } from "./fixtures";

const undo = (
  <DoorUndoBar
    copy={undoCopy}
    onUndo={fn()}
    remaining="7 s"
    secondsLeft={7}
    totalSeconds={10}
  />
);

const meta = {
  title: "Ticketing/Door/Blocks/DoorAnswer/Admitted",
  component: DoorAnswer,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <DoorPhoneFrame
        className="h-[844px] min-h-0 w-[390px] border border-border"
        copy={frameCopy}
        mode="signedIn"
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
    kind: "admitted",
    title: "Admitted",
    line: "Let them in.",
    details: alexDetails,
    fastPass: { state: "available", label: "Fast Pass: 2 left" },
    undo,
    copy: answerCopy,
    onScanNext: fn(),
    onUseFastPass: fn(),
    onUndoFastPass: fn(),
  },
} satisfies Meta<typeof DoorAnswer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Spends a Fast Pass use on today's entry, then gives it back. */
function LiveFastPass(props: DoorAnswerProps) {
  const [used, setUsed] = useState(false);
  return (
    <DoorAnswer
      {...props}
      fastPass={
        used
          ? { state: "used", label: "Fast Pass used · 1 left" }
          : { state: "available", label: "Fast Pass: 2 left" }
      }
      onUndoFastPass={() => setUsed(false)}
      onUseFastPass={() => setUsed(true)}
    />
  );
}

/** Let in, with Fast Pass uses left: Use Fast Pass, and Undo for 10 s. */
export const FastPassLeft: Story = {
  name: "Fast Pass left",
  render: (args) => <LiveFastPass {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("status")).toHaveTextContent("Admitted");
    await expect(canvas.getByText("Let them in.")).toBeVisible();
    await expect(canvas.getByText("Fast Pass: 2 left")).toBeVisible();
    await userEvent.click(
      canvas.getByRole("button", { name: "Use Fast Pass" }),
    );
    await expect(canvas.getByText("Fast Pass used · 1 left")).toBeVisible();
    await userEvent.click(
      canvas.getByRole("button", { name: "Undo Fast Pass" }),
    );
    await expect(canvas.getByText("Fast Pass: 2 left")).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: /Undo\s*7 s/ }),
    ).toBeEnabled();
  },
};

/** The Fast Pass use is spent on this entry; Undo Fast Pass gives it back. */
export const FastPassUsed: Story = {
  name: "Fast Pass used",
  args: {
    fastPass: { state: "used", label: "Fast Pass used · 1 left" },
    undo: (
      <DoorUndoBar
        copy={undoCopy}
        onUndo={fn()}
        remaining="9 s"
        secondsLeft={9}
        totalSeconds={10}
      />
    ),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Undo Fast Pass" }),
    );
    await expect(args.onUndoFastPass).toHaveBeenCalledOnce();
  },
};

/** VIP: Fast Pass comes with every day, but the door still chooses to use it. */
export const Vip: Story = {
  name: "VIP",
  args: {
    fastPass: { state: "available", label: "Fast Pass: included today" },
    details: [
      { label: "Name", value: "Grace" },
      { label: "Pass", value: "VIP Pass" },
      { label: "Ticket", value: "TKG3W9-1", code: true },
      { label: "Today", value: "Day 1 of 2 it admits" },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Fast Pass: included today")).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: "Use Fast Pass" }),
    ).toBeVisible();
  },
};

/** No Fast Pass on this ticket: a quiet line and no button. */
export const WithoutFastPass: Story = {
  name: "Without Fast Pass",
  args: {
    fastPass: { state: "none", label: "Fast Pass: none" },
    details: [
      { label: "Name", value: "Chloe" },
      { label: "Pass", value: "General Pass (Two-Day), Child" },
      { label: "Ticket", value: "TK7Q2M-3", code: true },
      { label: "Today", value: "Day 1 of 2 it admits" },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Fast Pass: none")).toBeVisible();
    await expect(
      canvas.queryByRole("button", { name: "Use Fast Pass" }),
    ).not.toBeInTheDocument();
  },
};

/** Every Fast Pass use already spent: the quiet line says so. */
export const FastPassAllUsed: Story = {
  name: "Fast Pass all used",
  args: {
    fastPass: { state: "none", label: "Fast Pass: all used" },
    details: [
      { label: "Name", value: "Priya" },
      { label: "Pass", value: "General Pass (Two-Day), Adult" },
      { label: "Ticket", value: "TKJ6N4-1", code: true },
      { label: "Today", value: "Day 2 of 2 it admits" },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Fast Pass: all used")).toBeVisible();
    await expect(canvas.getByText("Day 2 of 2 it admits")).toBeVisible();
  },
};

/** After Undo: the entry and its Fast Pass use are unused again. */
export const Undone: Story = {
  args: {
    kind: "undone",
    title: "Undone",
    line: "The ticket can be scanned again, and its Fast Pass use is given back.",
    fastPass: undefined,
    undo: undefined,
    details: [
      ...alexDetails.slice(0, 3),
      { label: "Today", value: "Entry not used" },
      { label: "Fast Pass", value: "Use given back" },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("status")).toHaveTextContent("Undone");
    await expect(canvas.getByText("Use given back")).toBeVisible();
    await expect(
      canvas.queryByRole("button", { name: /Undo/ }),
    ).not.toBeInTheDocument();
  },
};
