import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { EventPhoneOrderBar } from "./event-phone-order-bar";
import { BAR_COPY } from "./fixtures";

const meta = {
  title: "Ticketing/Buying/Blocks/EventPhoneOrderBar",
  component: EventPhoneOrderBar,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="w-[390px]">
        <Story />
      </div>
    ),
  ],
  args: {
    copy: BAR_COPY,
    total: "HK$950.00",
    saving: "HK$250.00",
    seeOrder: "3 tickets, see order",
    onContinue: fn(),
  },
} satisfies Meta<typeof EventPhoneOrderBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The total, the saving, the jump to Your Order and Continue. */
export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_8f8c43b2-0f1a-4c3d-b37d-891f9a438c94" },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const bar = canvas.getByRole("region", { name: "Order total" });
    await expect(within(bar).getByText("You save HK$250.00")).toBeVisible();
    await expect(
      within(bar).getByRole("link", { name: "3 tickets, see order" }),
    ).toHaveAttribute("href", "#order");
    await userEvent.click(
      within(bar).getByRole("button", { name: "Continue" }),
    );
    await expect(args.onContinue).toHaveBeenCalledOnce();
  },
};

/** Full price: no saving line. */
export const NoSaving: Story = {
  parameters: {
    verification: { caseId: "vc_711d3957-60b3-4020-9a00-f4902b7d5949" },
  },
  name: "No Saving",
  args: { saving: undefined, total: "HK$1,140.00" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText(/You save/)).not.toBeInTheDocument();
  },
};

/** Continue pressed: the next step is on its way. */
export const Busy: Story = {
  parameters: {
    verification: { caseId: "vc_41359e17-fbab-46d3-8093-71d969a26313" },
  },
  args: { busy: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("button", { name: /Continue/ }),
    ).toHaveAttribute("aria-busy", "true");
  },
};
