import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { VAULT_ASSET_DETAILS } from "../../vault-content";
import { VaultAssetCustodyDocuments } from "./vault-asset-custody-documents";

/**
 * Custody Log (vertical stepper) and Documents (document list) tabs for the
 * vault asset detail page.
 */
const meta = {
  title: "Vault/Portfolio/Parts/VaultAssetCustodyDocuments",
  component: VaultAssetCustodyDocuments,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="flex w-full max-w-lg flex-col">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof VaultAssetCustodyDocuments>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default starts on the Custody Log tab. */
export const Default: Story = {
  args: {
    asset: VAULT_ASSET_DETAILS[0],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("tab", { name: "Custody Log" })).toBeVisible();
    expect(canvas.getByRole("tab", { name: "Documents" })).toBeVisible();
    expect(canvas.getByText("Stored in vault")).toBeVisible();
    expect(canvas.getByText("Received at Grade10 intake")).toBeVisible();
    expect(canvas.queryByText("Vault intake certificate")).toBeNull();
  },
};
