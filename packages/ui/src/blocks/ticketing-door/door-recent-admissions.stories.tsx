import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { DoorRecentAdmissions } from "./door-recent-admissions";
import { recentAdmissions, recentCopy } from "./fixtures";

const meta = {
  title: "Ticketing/Door/Blocks/DoorRecentAdmissions",
  component: DoorRecentAdmissions,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-[420px]">
        <Story />
      </div>
    ),
  ],
  args: {
    copy: recentCopy,
    admissions: recentAdmissions,
    onUndo: fn(),
    onReverse: fn(),
  },
} satisfies Meta<typeof DoorRecentAdmissions>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every door's admissions, newest first: Undo this screen's, Reverse another's. */
export const Default: Story = {
  name: "Every door",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByRole("region", { name: "Recent admissions" });
    await expect(within(list).getAllByRole("listitem")).toHaveLength(5);
    await expect(within(list).getAllByText("Fast Pass used")).toHaveLength(2);
    await expect(within(list).getByText("Reversed")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Undo" }));
    await expect(args.onUndo).toHaveBeenCalledWith("a1");
    await userEvent.click(
      canvas.getAllByRole("button", { name: "Reverse…" })[0],
    );
    await expect(args.onReverse).toHaveBeenCalledWith("a2");
  },
};

/** Before the first guest. */
export const Empty: Story = {
  args: { admissions: [] },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText("No admissions yet."),
    ).toBeVisible();
  },
};

/** A phone's width: the same list, narrower. */
export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div className="w-[358px]">
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText("Mei Lin")).toBeVisible();
  },
};
