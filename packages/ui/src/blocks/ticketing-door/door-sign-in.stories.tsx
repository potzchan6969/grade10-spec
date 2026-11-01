import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import { DoorPhoneFrame } from "./door-phone-frame";
import { DoorSignIn, type DoorSignInProps } from "./door-sign-in";
import { frameCopy, openWindow, signInCopy, signInEvent } from "./fixtures";

const meta = {
  title: "Ticketing/Door/Blocks/DoorSignIn",
  component: DoorSignIn,
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
  args: {
    copy: signInCopy,
    event: signInEvent,
    status: { kind: "ready" },
    passcode: "",
    deviceName: "",
    openWindow,
    onPasscodeChange: fn(),
    onDeviceNameChange: fn(),
    onSubmit: fn(),
    onCheckAgain: fn(),
  },
} satisfies Meta<typeof DoorSignIn>;

export default meta;
type Story = StoryObj<typeof meta>;

function Controlled(props: DoorSignInProps) {
  const [passcode, setPasscode] = useState(props.passcode);
  const [deviceName, setDeviceName] = useState(props.deviceName);
  return (
    <DoorSignIn
      {...props}
      deviceName={deviceName}
      onDeviceNameChange={(next) => {
        setDeviceName(next);
        props.onDeviceNameChange(next);
      }}
      onPasscodeChange={(next) => {
        setPasscode(next);
        props.onPasscodeChange(next);
      }}
      passcode={passcode}
    />
  );
}

/** The passcode and this phone's name, no account. */
export const EnterThePasscode: Story = {
  name: "Enter the passcode",
  render: (args) => <Controlled {...args} />,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("heading", { name: "Open the door" }),
    ).toBeVisible();
    await userEvent.type(canvas.getByLabelText("Passcode"), "482913");
    await userEvent.type(
      canvas.getByLabelText(/This phone’s name/),
      "Gate A phone 1",
    );
    await userEvent.click(
      canvas.getByRole("button", { name: "Open the Door" }),
    );
    await expect(args.onSubmit).toHaveBeenCalledOnce();
    await expect(args.onDeviceNameChange).toHaveBeenLastCalledWith(
      "Gate A phone 1",
    );
  },
};

/** The passcode was refused: how many tries are left before a short wait. */
export const WrongPasscode: Story = {
  name: "Wrong passcode",
  args: {
    passcode: "111111",
    deviceName: "Gate A phone 1",
    status: {
      kind: "wrong",
      message: "That passcode isn’t right. 3 tries left before a short wait.",
    },
  },
  play: async ({ canvasElement }) => {
    const field = within(canvasElement).getByLabelText("Passcode");
    await expect(field).toHaveAttribute("aria-invalid", "true");
    await expect(field).toHaveAccessibleDescription(
      "That passcode isn’t right. 3 tries left before a short wait.",
    );
  },
};

/** After five tries: a wait, and the form will not send until it ends. */
export const Slowed: Story = {
  name: "Slowed after 5 tries",
  args: {
    deviceName: "Gate A phone 1",
    status: {
      kind: "slowed",
      lead: "Too many tries.",
      message:
        "Wait 30 seconds, then try again. Ask the door lead for the passcode.",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("alert")).toHaveTextContent(
      "Too many tries.",
    );
    await expect(
      canvas.getByRole("button", { name: "Open the Door" }),
    ).toBeDisabled();
  },
};

/** The passcode is sent and being checked. */
export const Opening: Story = {
  args: { passcode: "482913", deviceName: "Gate A phone 1", submitting: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("button", { name: "Open the Door" }),
    ).toHaveAttribute("aria-busy", "true");
  },
};

/** The right passcode before the door opens: how long until it does. */
export const NotOpenYet: Story = {
  name: "Not open yet",
  args: {
    status: {
      kind: "notOpen",
      opensAt: "This passcode opens the door at 09:00 on Sat 12 Dec.",
      countdown: "16 h 42 min",
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("heading", { name: "Not open yet" }),
    ).toBeVisible();
    await expect(canvas.getByRole("timer")).toHaveTextContent("16 h 42 min");
    await userEvent.click(canvas.getByRole("button", { name: "Check Again" }));
    await expect(args.onCheckAgain).toHaveBeenCalledOnce();
  },
};
