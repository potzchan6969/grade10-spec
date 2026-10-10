import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, waitFor, within } from "storybook/test";
import { SHOP_ADDRESS, SHOP_NAME, VAULT_ASSETS } from "./vault-content";
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
  title: "Vault/Request Retrieval Dialog",
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
    expect(modal.queryByText("Ship to me")).not.toBeInTheDocument();
    expect(modal.queryByText("Grade10 Kowloon")).not.toBeInTheDocument();
    expect(modal.queryByText("Pickup only")).not.toBeInTheDocument();
    expect(
      modal.getByText(
        "Review the item and pickup details before sending your request.",
      ),
    ).toBeVisible();
    expect(
      modal.getByRole("button", { name: "Submit retrieval request" }),
    ).toBeVisible();
  },
};
