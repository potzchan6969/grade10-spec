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
  parameters: {
    verification: { caseId: "vc_f0b38d5f-ce69-4215-affd-c86639760353" },
  },
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
  parameters: {
    verification: { caseId: "vc_a9cf89d5-d8d3-4fba-ba7d-539f6adb7429" },
  },
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
  parameters: {
    verification: { caseId: "vc_fda2f9c4-fef4-43ba-939b-6f16a7d81447" },
  },
  args: { status: "checking" },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("status")).toHaveTextContent(
      "Checking",
    );
  },
};

/** The browser was told no: how to allow it, and Find by reference. */
export const CameraBlocked: Story = {
  parameters: {
    verification: { caseId: "vc_267c603e-95c2-4295-a353-c664f502cd52" },
  },
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
  parameters: {
    verification: { caseId: "vc_aba185cf-c9d6-49ba-b534-05e2d797dce1" },
  },
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
  parameters: {
    verification: { caseId: "vc_d394ba35-f149-4cc6-83e8-acae15138bb8" },
  },
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
