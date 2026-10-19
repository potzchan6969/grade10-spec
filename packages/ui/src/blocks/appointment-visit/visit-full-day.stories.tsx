import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { VisitFullDay } from "./visit-full-day";

const meta = {
  title: "Appointment/Visit/Blocks/VisitFullDay",
  component: VisitFullDay,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: {
      title: "Today is full at Central.",
      earliestEach: "Earliest at each shop",
      noFreeYet: "No free times yet",
    },
    shops: [
      { id: "loc_central", name: "Central", earliest: "Fri 16 Oct, 11:00" },
      {
        id: "loc_causeway_bay",
        name: "Causeway Bay",
        earliest: "Fri 16 Oct, 11:00",
      },
      { id: "loc_kowloon_bay", name: "Kowloon Bay" },
    ],
    onPick: fn(),
  },
  decorators: [
    (Story) => (
      <div className="max-w-[420px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof VisitFullDay>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Full on the picked day: each shop's earliest time, a press that picks it. */
export const Full: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Causeway Bay · Fri 16 Oct, 11:00" }),
    );
    expect(args.onPick).toHaveBeenCalledWith("loc_causeway_bay");
    expect(
      canvas.getByRole("button", { name: "Kowloon Bay · No free times yet" }),
    ).toBeDisabled();
  },
};

/** A later day, full. */
export const FullOnADay: Story = {
  args: {
    copy: {
      title: "Sat 17 Oct is full at Central.",
      earliestEach: "Earliest at each shop",
      noFreeYet: "No free times yet",
    },
  },
};

/** Closed on the picked day. */
export const Closed: Story = {
  args: {
    copy: {
      title: "Central is closed on Mon 2 Nov.",
      earliestEach: "Earliest at each shop",
      noFreeYet: "No free times yet",
    },
  },
};
