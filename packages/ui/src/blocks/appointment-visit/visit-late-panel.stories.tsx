import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import { LATE_CHOICES, LATE_PANEL_COPY } from "./fixtures";
import { VisitLatePanel, type VisitLatePanelProps } from "./visit-late-panel";

/** The panel with its pick held the way a consumer holds it. */
function Held(props: VisitLatePanelProps) {
  const [value, setValue] = useState(props.value);
  return (
    <VisitLatePanel
      {...props}
      copy={{
        ...props.copy,
        send: `Tell Hong Kong Grade10 Store: about ${value ?? 0} min`,
      }}
      onValueChange={setValue}
      value={value}
    />
  );
}

const meta = {
  title: "Appointment Visit/VisitLatePanel",
  component: VisitLatePanel,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  render: (args) => <Held {...args} />,
  args: {
    copy: LATE_PANEL_COPY,
    choices: LATE_CHOICES,
    value: 10,
    pending: false,
    onValueChange: fn(),
    onSend: fn(),
    onClose: fn(),
  },
} satisfies Meta<typeof VisitLatePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Each pick says whether the time is still held; the button names it. */
export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("radio", { name: /About 20 min/ }));
    await userEvent.click(
      canvas.getByRole("button", {
        name: "Tell Hong Kong Grade10 Store: about 20 min",
      }),
    );
    expect(args.onSend).toHaveBeenCalledTimes(1);
  },
};

export const Sending: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Sending…" })).toBeDisabled();
  },
};

export const TooLate: Story = {
  args: {
    error:
      "We stopped holding your time at 10:25. Check in when you arrive, or pick another time.",
  },
};
