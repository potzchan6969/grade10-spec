import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { BACKUP_CODES, TOTP_URI } from "./fixtures";
import { TwoFactorEnrollment } from "./two-factor-enrollment";

const meta = {
  title: "Account/Roles/Blocks/TwoFactorEnrollment",
  component: TwoFactorEnrollment,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: {
      scanTitle: "Scan this with your authenticator",
      openInApp: "Open in your password manager",
      issuer: "Service",
      account: "Account",
      setupKey: "Setup key",
      setupKeyHint: "Use this if you would rather type the account in by hand.",
      backupCodesTitle: "Backup codes",
      backupCodesDescription:
        "Store these now — they are shown once, and each one signs you in if you lose your authenticator.",
      scanDescription:
        "Point your phone’s authenticator app at the code, or open it in the password manager on this device.",
      verify: "Verification code",
      verifyHint: "Enter the code your authenticator shows now.",
      verifySubmit: "Turn on two-factor authentication",
      qrAlt: "QR code for adding this account to an authenticator app",
    },
    totpURI: TOTP_URI,
    backupCodes: BACKUP_CODES,
    copySetupKey: { label: "Copy", onAction: fn() },
    copyBackupCodes: { label: "Copy all", onAction: fn() },
    downloadBackupCodes: { label: "Download", onAction: fn() },
    onVerify: fn(),
  },
} satisfies Meta<typeof TwoFactorEnrollment>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The QR keeps a fixed white plate and black modules so a scanner can read
 * it regardless of the surrounding theme. */
export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_496c1b18-b3b3-41f6-ac2d-064df70193d7" },
  },
  play: async ({ canvasElement }) => {
    const plate = canvasElement.querySelector('[data-slot="authenticator-qr"]');
    expect(plate).not.toBeNull();
    expect(getComputedStyle(plate as Element).backgroundColor).toBe(
      "rgb(255, 255, 255)",
    );
    const svg = plate?.querySelector("svg");
    expect(svg).not.toBeNull();
    // The dark modules are painted as paths in the foreground colour.
    expect(svg?.querySelector('path[fill="#000000"]')).not.toBeNull();
  },
};

export const ErrorState: Story = {
  parameters: {
    verification: { caseId: "vc_26d57ac2-6028-47be-ac68-06d852ec2f0d" },
  },
  args: { error: "That code didn’t work." },
};

export const Pending: Story = {
  parameters: {
    verification: { caseId: "vc_64b6eacb-8ffe-4376-a95d-a2ea342ce9c1" },
  },
  args: { pending: true },
};

/** Issuer, account and setup key are read out of the URI, so what is on
 * screen is what the authenticator will save. */
export const DetailsComeFromTheUri: Story = {
  parameters: {
    verification: { caseId: "vc_2378dafd-84af-4728-9340-426a4e56007b" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Grade10")).toBeInTheDocument();
    expect(canvas.getByText("operator@example.com")).toBeInTheDocument();
    expect(
      canvas.getByText("JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP"),
    ).toBeInTheDocument();
  },
};

/** The third way in: a real link, so a click hands the enrollment to the
 * password manager that cannot scan a code it is covering. */
export const UriIsLinked: Story = {
  parameters: {
    verification: { caseId: "vc_dcbf74e0-e5a2-47e5-b8e4-5712c4ccea92" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("link", { name: "Open in your password manager" }),
    ).toHaveAttribute("href", TOTP_URI);
  },
};

/** A malformed URI costs the rows it cannot fill, never the screen — the QR
 * still encodes whatever the server sent. */
export const UnparsableUri: Story = {
  parameters: {
    verification: { caseId: "vc_c3e471ce-d570-42d5-9b8c-d1a3b5b52441" },
  },
  args: { totpURI: "not-a-uri" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText("Setup key")).not.toBeInTheDocument();
    expect(canvas.getByText("Backup codes")).toBeInTheDocument();
  },
};

export const CopyingIsReported: Story = {
  parameters: {
    verification: { caseId: "vc_aa566482-3080-4383-b35f-29ecfa271a6e" },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Copy all" }));
    await userEvent.click(canvas.getByRole("button", { name: "Download" }));
    expect(args.copyBackupCodes?.onAction).toHaveBeenCalledOnce();
    expect(args.downloadBackupCodes?.onAction).toHaveBeenCalledOnce();
    expect(args.onVerify).not.toHaveBeenCalled();
  },
};
