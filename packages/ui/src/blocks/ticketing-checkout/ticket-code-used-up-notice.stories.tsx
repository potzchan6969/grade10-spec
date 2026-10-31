import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { phone } from "./checkout.story-fixtures";
import { TicketCodeUsedUpNotice } from "./ticket-code-used-up-notice";

const meta = {
  title: "Ticketing/Buying/Blocks/TicketCodeUsedUpNotice",
  component: TicketCodeUsedUpNotice,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
    phone,
  ],
  args: {
    copy: {
      title: "The last use of SPRING20 was just taken.",
      body: "The total is back to HK$1,150.00.",
      payFull: "Pay HK$1,150.00",
      removeCode: "Remove Code",
    },
    onPayFull: fn(),
    onRemoveCode: fn(),
  },
} satisfies Meta<typeof TicketCodeUsedUpNotice>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Pay the full total, or take the code off. */
export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const notice = within(canvasElement).getByRole("alert");
    await userEvent.click(
      within(notice).getByRole("button", { name: "Pay HK$1,150.00" }),
    );
    expect(args.onPayFull).toHaveBeenCalledOnce();
    await userEvent.click(
      within(notice).getByRole("button", { name: "Remove Code" }),
    );
    expect(args.onRemoveCode).toHaveBeenCalledOnce();
  },
};

/** Paying the full total: Pay waits, and Remove Code with it. */
export const Paying: Story = {
  args: { paying: true },
  play: async ({ canvasElement }) => {
    const notice = within(canvasElement).getByRole("alert");
    expect(
      within(notice).getByRole("button", { name: "Pay HK$1,150.00" }),
    ).toHaveAttribute("aria-busy", "true");
    expect(
      within(notice).getByRole("button", { name: "Remove Code" }),
    ).toBeDisabled();
  },
};
