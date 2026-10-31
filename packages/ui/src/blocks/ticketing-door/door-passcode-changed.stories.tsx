import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { DoorPasscodeChanged } from "./door-passcode-changed";
import { DoorPhoneFrame } from "./door-phone-frame";
import { frameCopy, passcodeChangedCopy } from "./fixtures";

const meta = {
  title: "Ticketing/Door/Blocks/DoorPasscodeChanged",
  component: DoorPasscodeChanged,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <DoorPhoneFrame
        className="h-[844px] min-h-0 w-[390px] border border-border"
        copy={frameCopy}
        mode="signedOut"
        title="Grade10 door"
      >
        <Story />
      </DoorPhoneFrame>
    ),
  ],
  args: { copy: passcodeChangedCopy, onEnterNewPasscode: fn() },
} satisfies Meta<typeof DoorPasscodeChanged>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Changing the passcode in the console signed every phone out. */
export const Default: Story = {
  name: "Passcode changed",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("heading", { name: "The passcode was changed" }),
    ).toBeVisible();
    await userEvent.click(
      canvas.getByRole("button", { name: "Enter the New Passcode" }),
    );
    await expect(args.onEnterNewPasscode).toHaveBeenCalledOnce();
  },
};
