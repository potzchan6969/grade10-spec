import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { SigningPrototype } from "./signing-prototype";

const meta = {
  title: "Vault/Documents And Signing/Prototypes/Signing",
  component: SigningPrototype,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof SigningPrototype>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The packet to read, the typed name, the consent, and Sign the documents. */
export const Sign: Story = {
  args: { state: "sign" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByLabelText("Type your full name, as it is on your ID"),
    ).toBeVisible();
    expect(
      canvas.getByRole("checkbox", {
        name: "I have read these documents and agree to sign them electronically.",
      }),
    ).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Sign the documents" }),
    ).toBeVisible();
  },
};

/** The collector declines to sign on screen: nothing at all is signed. */
export const Refuse: Story = {
  args: { state: "refuse" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText(
        "You declined to sign on screen. Nothing at all is signed in your name, and the member of staff with you will take it from there.",
      ),
    ).toBeVisible();
    expect(
      canvas.queryByRole("button", { name: "Sign the documents" }),
    ).not.toBeInTheDocument();
  },
};

/** Signed: the time, and each document with its fingerprint. */
export const Signed: Story = {
  args: { state: "signed" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText("Signed on 13 October 2026 at 14:05 HKT."),
    ).toBeVisible();
    expect(canvas.getByText("Custody agreement")).toBeVisible();
  },
};

/** Download all: every signed document from the collector's cases, in one file. */
export const DownloadAll: Story = {
  args: { state: "download-all" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: "Download all 3 documents" }),
    ).toBeVisible();
    expect(canvas.getAllByText("Custody agreement").length).toBeGreaterThan(0);
  },
};
