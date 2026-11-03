import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, screen, userEvent } from "storybook/test";
import { HERE_COPY, LATE_CHOICES, LATE_PANEL_COPY } from "./fixtures";
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
  title: "Appointment/Visit/Blocks/VisitLatePanel",
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
  parameters: {
    verification: { caseId: "vc_d8451cd0-b741-4c53-b7c2-1fe4df7fb627" },
  },
  play: async ({ args }) => {
    const canvas = screen;
    await userEvent.click(
      await canvas.findByRole("radio", { name: /About 20 min/ }),
    );
    await userEvent.click(
      canvas.getByRole("button", {
        name: "Tell Hong Kong Grade10 Store: about 20 min",
      }),
    );
    expect(args.onSend).toHaveBeenCalledTimes(1);
  },
};

export const Sending: Story = {
  parameters: {
    verification: { caseId: "vc_02d93d76-9e89-42a4-8e1c-f3de6c612ad8" },
  },
  args: { pending: true },
  play: async () => {
    const button = await screen.findByRole("button", { name: "Sending…" });
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).not.toBeDisabled();
  },
};

/** Already outside: I’m here tells the desk instead. */
export const AlreadyOutside: Story = {
  parameters: {
    verification: { caseId: "vc_49763f10-96a8-459e-a625-f7102b4cbc90" },
  },
  args: { here: { copy: HERE_COPY, onHere: fn() } },
  play: async ({ args }) => {
    await userEvent.click(
      await screen.findByRole("button", { name: "I’m here" }),
    );
    expect(args.here?.onHere).toHaveBeenCalledTimes(1);
  },
};

export const TooLate: Story = {
  parameters: {
    verification: { caseId: "vc_b175d773-4007-40e6-a2c2-4ef83e53ddf2" },
  },
  args: {
    error:
      "We stopped holding your time at 10:25. Check in when you arrive, or pick another time.",
  },
};
