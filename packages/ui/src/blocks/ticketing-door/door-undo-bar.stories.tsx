import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { DoorUndoBar } from "./door-undo-bar";
import { undoCopy } from "./fixtures";

const meta = {
  title: "Ticketing/Door/Blocks/DoorUndoBar",
  component: DoorUndoBar,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="flex w-[358px] flex-col">
        <Story />
      </div>
    ),
  ],
  args: {
    copy: undoCopy,
    secondsLeft: 7,
    totalSeconds: 10,
    remaining: "7 s",
    onUndo: fn(),
  },
} satisfies Meta<typeof DoorUndoBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Seven of ten seconds left: the fill has drained a little under a third. */
export const Counting: Story = {
  parameters: {
    verification: { caseId: "vc_2fce6d34-a844-471d-a94e-3b378d2b54f9" },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /Undo\s*7 s/ });
    await userEvent.click(button);
    await expect(args.onUndo).toHaveBeenCalledOnce();
  },
};

/** The last second. */
export const LastSecond: Story = {
  parameters: {
    verification: { caseId: "vc_8f751296-1aba-4759-bfbf-b64a9fd88b08" },
  },
  name: "Last second",
  args: { secondsLeft: 1, remaining: "1 s" },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("button", { name: /Undo\s*1 s/ }),
    ).toBeEnabled();
  },
};

/** Undo is on its way. */
export const Pending: Story = {
  parameters: {
    verification: { caseId: "vc_a2dc4dfb-c3b7-4beb-a8c2-8517afbde8c2" },
  },
  args: { pending: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("button", { name: /Undo/ }),
    ).toHaveAttribute("aria-busy", "true");
  },
};

/** At zero the window has closed and the bar no longer undoes. */
export const Closed: Story = {
  parameters: {
    verification: { caseId: "vc_03869021-bfbb-4d10-971c-02997251b62e" },
  },
  args: { secondsLeft: 0, remaining: "0 s" },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("button", { name: /Undo/ }),
    ).toBeDisabled();
  },
};
