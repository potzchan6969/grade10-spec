import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, waitFor, within } from "storybook/test";
import { SHOP_ADDRESS, SHOP_NAME, VAULT_ASSETS } from "../../vault-content";
import { VaultRequestRetrievalDialog } from "./vault-request-retrieval-dialog";

function VaultRequestRetrievalDialogDemo() {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex min-h-svh w-full flex-col bg-background p-8">
      <VStack className="mx-auto w-full max-w-lg" gap="md" hAlign="start">
        <Text as="h2" className="text-xl font-semibold tracking-tight">
          Request Retrieval
        </Text>
        <Text size="sm" tone="secondary">
          Standalone preview of the retrieval dialog opened from an item detail
          page. The retrieval process remains TBC.
        </Text>
        {!open ? (
          <Button onClick={() => setOpen(true)} size="md">
            Open dialog
          </Button>
        ) : null}
      </VStack>
      <VaultRequestRetrievalDialog
        asset={VAULT_ASSETS[0]}
        onOpenChange={setOpen}
        open={open}
      />
    </div>
  );
}

const meta = {
  title: "Vault/Portfolio/Asset Detail/Retrieval Dialog",
  component: VaultRequestRetrievalDialogDemo,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof VaultRequestRetrievalDialogDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await waitFor(() => {
      const found = page.getByRole("dialog", { name: "Request Retrieval" });
      expect(found).toBeVisible();
      return found;
    });
    const modal = within(dialog);
    expect(modal.getByText("1999 Charizard")).toBeVisible();
    expect(modal.getByText(SHOP_NAME)).toBeVisible();
    expect(modal.getByText(SHOP_ADDRESS)).toBeVisible();
    expect(modal.getByText("Pickup location")).toBeVisible();
    expect(modal.getByText("What happens next")).toBeVisible();
    expect(modal.getByText("We review your request")).toBeVisible();
    expect(modal.getByText("We confirm your pickup window")).toBeVisible();
    expect(modal.getByText("Collect it in store")).toBeVisible();
    expect(modal.queryByText("Ship to me")).not.toBeInTheDocument();
    expect(modal.queryByText("Grade10 Kowloon")).not.toBeInTheDocument();
    expect(modal.queryByText("Pickup only")).not.toBeInTheDocument();
    // Screen-reader-only DialogDescription mirrors the subtext — match the visible one.
    expect(
      modal.getAllByText(
        "We’ll release this item from storage for pickup in store.",
      )[0],
    ).toBeVisible();
    expect(modal.getByRole("button", { name: "Submit Request" })).toBeVisible();
  },
};

/**
 * 390px phone — the body scrolls but every block keeps its full size, so the
 * item row and the last step stay readable instead of clipping.
 */
export const Narrow: Story = {
  globals: { viewport: { value: "mobile1" } },
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await waitFor(() => {
      const found = page.getByRole("dialog", { name: "Request Retrieval" });
      expect(found).toBeVisible();
      return found;
    });
    const modal = within(dialog);
    expect(modal.getByText("1999 Charizard")).toBeVisible();
    expect(modal.getByText("Collect it in store")).toBeVisible();
  },
};
