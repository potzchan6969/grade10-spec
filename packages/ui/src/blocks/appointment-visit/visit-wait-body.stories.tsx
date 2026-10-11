import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  BOOK_HREF,
  OTHER_SHOPS,
  PAUSED_SERVICES,
  WAIT_COPY,
  WAIT_SERVICES,
} from "./fixtures";
import { VisitWaitBody } from "./visit-wait-body";

const meta = {
  title: "Appointment Visit/VisitWaitBody",
  component: VisitWaitBody,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: WAIT_COPY,
    open: true,
    closedToday: false,
    services: WAIT_SERVICES,
    otherShops: OTHER_SHOPS,
    bookHref: BOOK_HREF,
  },
} satisfies Meta<typeof VisitWaitBody>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Open: the wait for each service now; a booked-only one links to booking. */
export const Open: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("About 15 to 25 min")).toBeVisible();
    expect(
      canvas.getByRole("link", {
        name: "Book a time for Store/Auction Listing",
      }),
    ).toBeVisible();
  },
};

export const Paused: Story = {
  args: {
    copy: {
      ...WAIT_COPY,
      paused: {
        title: "Walk-ins are paused",
        body: "We’re seeing booked visits only for now. Book a time and we’ll see you then. Walk-ins start again at 14:00.",
      },
    },
    services: PAUSED_SERVICES,
  },
};

/** Closed today: the other shops open today replace the wait. */
export const ClosedToday: Story = {
  args: {
    open: false,
    closedToday: true,
    copy: {
      ...WAIT_COPY,
      status: "Closed today",
      hours: "Thu 3 Sep",
      closed: {
        title: "Hong Kong Grade10 Store is closed today",
        body: "Typhoon signal 8. We open again Fri 4 Sep, 10:00.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("region", { name: "Open today" })).toBeVisible();
    expect(
      canvas.queryByRole("region", { name: "Walk-in wait now" }),
    ).toBeNull();
  },
};
