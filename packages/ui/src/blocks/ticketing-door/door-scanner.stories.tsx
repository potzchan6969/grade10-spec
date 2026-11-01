import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { DoorPhoneFrame } from "./door-phone-frame";
import { DoorScanner } from "./door-scanner";
import { frameCopy, scannerCopy } from "./fixtures";

const meta = {
  title: "Ticketing/Door/Blocks/DoorScanner",
  component: DoorScanner,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <DoorPhoneFrame
        className="h-[844px] min-h-0 w-[390px] border border-border"
        copy={frameCopy}
        mode="signedIn"
        onFindByReference={fn()}
        onOpenMenu={fn()}
        title="Gate A phone 1"
      >
        <Story />
      </DoorPhoneFrame>
    ),
  ],
  args: {
    copy: scannerCopy,
    status: "ready",
    admittedToday: "412",
    onFindByReference: fn(),
    onTryAgain: fn(),
  },
} satisfies Meta<typeof DoorScanner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Point at a code; today's count for this phone and Find by reference. */
export const Ready: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Point at a code")).toBeVisible();
    await expect(canvas.getByText("412")).toBeVisible();
    // The header's icon button shares the name; the block's own is last.
    const [, ownFind] = canvas.getAllByRole("button", {
      name: "Find by reference",
    });
    await userEvent.click(ownFind);
    await expect(args.onFindByReference).toHaveBeenCalledOnce();
  },
};

/** The browser asks for the camera; a line under it says why. */
export const CameraAsks: Story = {
  name: "The camera asks",
  args: { status: "asking", admittedToday: "0" },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(/Allow the camera so this phone/),
    ).toBeVisible();
  },
};

/** A code was read: shown at once, given up after 4 seconds. */
export const Checking: Story = {
  args: { status: "checking" },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("status")).toHaveTextContent(
      "Checking",
    );
  },
};

/** The browser was told no: how to allow it, and Find by reference. */
export const CameraBlocked: Story = {
  name: "Camera blocked",
  args: { status: "blocked" },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("heading", { name: "The camera is blocked" }),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Try Again" }));
    await expect(args.onTryAgain).toHaveBeenCalledOnce();
    await expect(
      canvas.getByRole("button", { name: "Find by Reference" }),
    ).toBeVisible();
  },
};

/** No camera, told apart from a blocked one; a handheld scanner can type. */
export const NoCamera: Story = {
  name: "No camera",
  args: { status: "noCamera" },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("heading", { name: "No camera found" }),
    ).toBeVisible();
  },
};

/** The consumer's own video element, placed behind the aiming square. */
export const WithCamera: Story = {
  name: "With the camera's picture",
  args: {
    camera: (
      <div
        className="size-full bg-gradient-to-br from-secondary-foreground to-background-inverse"
        data-testid="camera"
      />
    ),
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByTestId("camera")).toBeVisible();
  },
};
