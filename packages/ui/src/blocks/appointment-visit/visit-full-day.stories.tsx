import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { FULL_DAY_COPY, FULL_DAY_SHOPS, WAIT_HREF } from "./fixtures";
import { VisitFullDay } from "./visit-full-day";

const meta = {
  title: "Appointment/Visit/Blocks/VisitFullDay",
  component: VisitFullDay,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: FULL_DAY_COPY,
    shops: FULL_DAY_SHOPS,
    waitHref: WAIT_HREF,
    onPick: fn(),
  },
} satisfies Meta<typeof VisitFullDay>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Full today: each shop's earliest time, and walking in instead. */
export const Full: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Central · Today, 16:30" }),
    );
    expect(args.onPick).toHaveBeenCalledWith("loc_central");
    expect(
      canvas.getByRole("button", { name: "Mong Kok · No free times yet" }),
    ).toBeDisabled();
    expect(
      canvas.getByRole("link", { name: "See the wait now" }),
    ).toHaveAttribute("href", WAIT_HREF);
  },
};

/** Closed today: no walking in. */
export const Closed: Story = {
  args: {
    copy: {
      ...FULL_DAY_COPY,
      title: "Hong Kong Grade10 Store is closed today.",
      walkIn: undefined,
    },
  },
};
