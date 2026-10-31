import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { CONFIRMING_COPY } from "./fixtures";
import { TicketConfirmingDrawer } from "./ticket-confirming-drawer";

/** Back from Stripe, over the page the collector left: the wait while the
 * payment is confirmed, then, after a minute, safe to close. At 390 px it is
 * a bottom drawer. */
const meta = {
  title: "Ticketing/Your Tickets/Blocks/TicketConfirmingDrawer",
  component: TicketConfirmingDrawer,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="mx-auto min-h-[844px] w-[390px] bg-background">
        <Story />
      </div>
    ),
  ],
  args: {
    copy: CONFIRMING_COPY,
    open: true,
    stage: "waiting",
    onClose: fn(),
  },
} satisfies Meta<typeof TicketConfirmingDrawer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** No close while it waits: Escape does nothing. */
export const Confirming: Story = {
  play: async ({ args }) => {
    const body = within(document.body);
    const status = await body.findByRole("status");
    expect(
      within(status).getByText("Confirming your payment…"),
    ).toBeInTheDocument();
    expect(body.getByText("Please keep this page open.")).toBeInTheDocument();
    expect(body.queryByRole("button", { name: "Close" })).toBeNull();
    await userEvent.keyboard("{Escape}");
    expect(args.onClose).not.toHaveBeenCalled();
  },
};

/** After a minute: the tickets follow by email, the reference, and Close. */
export const SafeToClose: Story = {
  name: "Safe to close",
  args: { stage: "safeToClose" },
  play: async ({ args }) => {
    const body = within(document.body);
    expect(
      await body.findByText("Still confirming your payment"),
    ).toBeInTheDocument();
    expect(body.getByText("Reference TK7Q2M")).toBeInTheDocument();
    await userEvent.click(body.getByRole("button", { name: "Close" }));
    await waitFor(() => expect(args.onClose).toHaveBeenCalled());
  },
};
