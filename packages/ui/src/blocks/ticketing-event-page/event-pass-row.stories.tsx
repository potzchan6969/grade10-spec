import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { EventPassRow } from "./event-pass-row";
import { WAS } from "./fixtures";

const NAME = "General Pass (Two-Day), Adult";

const meta = {
  title: "Ticketing/Buying/Blocks/EventPassRow",
  component: EventPassRow,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="w-[740px] max-w-full">
        <Story />
      </div>
    ),
  ],
  args: {
    copy: WAS,
    label: "Adult",
    who: "Ages [Product] and up",
    price: { price: "HK$380.00", was: "HK$480.00" },
  },
} satisfies Meta<typeof EventPassRow>;

export default meta;
type Story = StoryObj<typeof meta>;

function Picking({ max = 8 }: { max?: number }) {
  const [value, setValue] = useState(2);
  return (
    <EventPassRow
      copy={WAS}
      label="Adult"
      price={{ price: "HK$380.00", was: "HK$480.00" }}
      quantity={{
        value,
        max,
        onValueChange: setValue,
        label: `How many tickets: ${NAME}`,
        decrementLabel: `One fewer ${NAME}`,
        incrementLabel: `One more ${NAME}`,
      }}
      who="Ages [Product] and up"
    />
  );
}

/** Wide: the struck full price and the early-bird price beside the stepper,
 * which has no visible label. */
export const Default: Story = {
  render: () => <Picking />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const picker = canvas.getByRole("spinbutton", {
      name: `How many tickets: ${NAME}`,
    });
    await userEvent.click(
      canvas.getByRole("button", { name: `One more ${NAME}` }),
    );
    await expect(picker).toHaveValue("3");
    await expect(canvas.getAllByText("Was")[0]).toBeInTheDocument();
  },
};

/** On a phone: the price moves under the label and the stepper narrows. */
export const Phone: Story = {
  decorators: [
    (Story) => (
      <div className="w-[326px]">
        <Story />
      </div>
    ),
  ],
  render: () => <Picking />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const picker = canvas.getByRole("spinbutton", {
      name: `How many tickets: ${NAME}`,
    });
    await expect(picker).toBeVisible();
  },
};

/** At the limit: the + stops. */
export const AtTheLimit: Story = {
  name: "At the Limit",
  render: () => <Picking max={2} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("button", { name: `One more ${NAME}` }),
    ).toBeDisabled();
  },
};

/** Sales ended: the price in grey and no stepper. */
export const Ended: Story = {
  args: { price: { price: "HK$480.00", muted: true } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole("spinbutton")).not.toBeInTheDocument();
    await expect(canvas.queryByText("Was")).not.toBeInTheDocument();
  },
};
