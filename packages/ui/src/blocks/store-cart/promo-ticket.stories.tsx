import { Button } from "@grade10/design-system/components/forms/button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import { SAMPLE_HELD_PROMO_CODES } from "./fixtures";
import { PromoTicket } from "./promo-ticket";

const applicable = SAMPLE_HELD_PROMO_CODES.find((c) => c.applicable)!;
const inapplicable = SAMPLE_HELD_PROMO_CODES.find((c) => !c.applicable)!;

const meta = {
  title: "Store Cart/PromoTicket",
  component: PromoTicket,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="max-w-md bg-sidebar p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    code: applicable,
  },
} satisfies Meta<typeof PromoTicket>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Applicable ticket with Apply in the action slot. */
export const Default: Story = {
  args: {
    action: (
      <Button size="sm" variant="secondary" onClick={fn()}>
        Apply
      </Button>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("HK$100 discount")).toBeInTheDocument();
    expect(canvas.getByText(applicable.label)).toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "Apply" })).toBeInTheDocument();
  },
};

/** Selected when this held code is the applied promo on the cart. */
export const Selected: Story = {
  args: {
    selected: true,
    action: (
      <Button size="sm" variant="secondary" onClick={fn()}>
        Apply
      </Button>
    ),
  },
};

/** Inapplicable — muted, reason in the footer, no action. */
export const NotApplicable: Story = {
  args: {
    code: inapplicable,
    muted: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(inapplicable.label)).toBeInTheDocument();
    expect(
      canvas.getByText(inapplicable.inapplicableReason!),
    ).toBeInTheDocument();
    expect(canvas.queryByRole("button")).not.toBeInTheDocument();
  },
};

/** Stack of tickets as they appear in the promo sheet. */
export const List: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-2">
      {SAMPLE_HELD_PROMO_CODES.map((code) => (
        <PromoTicket
          key={code.id}
          code={code}
          muted={!code.applicable}
          action={
            code.applicable ? (
              <Button size="sm" variant="secondary" onClick={fn()}>
                Apply
              </Button>
            ) : undefined
          }
        />
      ))}
    </div>
  ),
};
