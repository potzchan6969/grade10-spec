import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { VaultAssetDetails } from "./vault-asset-details";
import { VAULT_ASSET_DETAILS } from "./vault-content";

/**
 * Graded and raw attribute lists for the vault asset detail page.
 */
const meta = {
  title: "Vault/Asset Details",
  component: VaultAssetDetails,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="flex w-full max-w-lg flex-col">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof VaultAssetDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Graded asset shows grade, cert number with verify, storage, location, and condition. */
export const Graded: Story = {
  args: {
    asset: VAULT_ASSET_DETAILS[0],
    verifyHref: "https://www.psacard.com/cert/63261276",
    onRequestRetrieval: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Grade")).toBeVisible();
    expect(canvas.getByText("PSA 10 Gem Mint")).toBeVisible();
    expect(canvas.getByText("Cert Number")).toBeVisible();
    expect(canvas.getByText("63261276")).toBeVisible();
    expect(canvas.getByRole("link", { name: "Verify" })).toBeVisible();
    expect(canvas.getByText("Vault Storage ID")).toBeVisible();
    expect(canvas.getByText("G10-VLT-004821")).toBeVisible();
    expect(canvas.getByText("Location")).toBeVisible();
    expect(canvas.getByText("Crown Fine Art, Hong Kong")).toBeVisible();
    expect(canvas.getByText("Condition")).toBeVisible();
    expect(canvas.getByText("Graded, Gem Mint")).toBeVisible();
    expect(
      canvas.getByRole("link", { name: "Request Retrieval" }),
    ).toBeVisible();
  },
};

/** Raw asset shows storage, location, and condition. */
export const Raw: Story = {
  args: {
    asset: VAULT_ASSET_DETAILS[1],
    onRequestRetrieval: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText("Grade")).toBeNull();
    expect(canvas.queryByText("Cert Number")).toBeNull();
    expect(canvas.getByText("Vault Storage ID")).toBeVisible();
    expect(canvas.getByText("G10-VLT-004821")).toBeVisible();
    expect(canvas.getByText("Location")).toBeVisible();
    expect(canvas.getByText("Condition")).toBeVisible();
    expect(canvas.getByText("Raw, Lightly Played")).toBeVisible();
    expect(
      canvas.getByRole("link", { name: "Request Retrieval" }),
    ).toBeVisible();
  },
};
