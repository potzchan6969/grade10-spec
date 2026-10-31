import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { DoorPhoneFrame } from "./door-phone-frame";
import { frameCopy } from "./fixtures";

const meta = {
  title: "Ticketing/Door/Blocks/DoorPhoneFrame",
  component: DoorPhoneFrame,
  tags: ["autodocs"],
  args: {
    className: "h-[844px] min-h-0 w-[390px] border border-border",
    copy: frameCopy,
    mode: "signedIn",
    title: "Gate A phone 1",
    onFindByReference: fn(),
    onOpenMenu: fn(),
    children: <div className="flex-1" />,
  },
} satisfies Meta<typeof DoorPhoneFrame>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Signed in: the phone's name, Find by reference and the door menu. */
export const SignedIn: Story = {
  name: "Signed in",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Gate A phone 1")).toBeVisible();
    await userEvent.click(
      canvas.getByRole("button", { name: "Door menu: sign out" }),
    );
    await expect(args.onOpenMenu).toHaveBeenCalledOnce();
  },
};

/** Before the passcode: the door's name and no buttons. */
export const SignedOut: Story = {
  name: "Signed out",
  args: { mode: "signedOut", title: "Grade10 door" },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole("button"),
    ).not.toBeInTheDocument();
  },
};

/** Outside production every screen says its tickets are test tickets. */
export const Staging: Story = {
  args: { environment: { name: "Staging", text: ": test tickets only" } },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("note")).toHaveTextContent(
      "Staging: test tickets only",
    );
  },
};

/** No connection: a line under the header until it is back. */
export const Offline: Story = {
  args: {
    offlineNotice:
      "No connection. Every scan reads Not checked until it is back.",
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("status")).toHaveTextContent(
      "No connection.",
    );
  },
};
