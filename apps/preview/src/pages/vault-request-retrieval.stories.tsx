import { Alert } from "@grade10/design-system/components/display/alert";
import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  SHOP_ADDRESS,
  SHOP_NAME,
  VAULT_ASSETS,
  VAULT_ITEM_DETAIL_HREF,
  VAULT_PORTFOLIO_HREF,
  VAULT_PORTFOLIO_STORY_ID,
} from "./vault-content";
import { PageHeader, ProposalBanner, VaultPageShell } from "./vault-shared";
import { navigateToStory } from "./workbench-story-nav";

function VaultRequestRetrievalPage() {
  const asset = VAULT_ASSETS[0];

  return (
    <VaultPageShell>
      <Breadcrumbs>
        <BreadcrumbItem href={VAULT_PORTFOLIO_HREF}>Vault</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem href={VAULT_ITEM_DETAIL_HREF}>
          {asset.name}
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem current>Retrieval</BreadcrumbItem>
      </Breadcrumbs>

      <PageHeader
        title="Request retrieval"
        description={`${asset.name} · ${asset.vaultId}`}
      />

      <ProposalBanner title="Pickup only">
        Day one is collect at the Hong Kong Grade10 Store in Causeway Bay.
        Ship-home retrieval is Proposed.
      </ProposalBanner>

      <div className="flex flex-col gap-1 rounded-(--radius-2xl) border border-border bg-card p-4">
        <Text weight="medium">{SHOP_NAME}</Text>
        <Text size="sm" tone="secondary">
          {SHOP_ADDRESS}
        </Text>
      </div>

      <Alert
        dismissible={false}
        status="default"
        title="Pickup next step"
        description="We confirm the pickup window after the item is released from storage to the shop."
      />

      <Text size="sm" tone="secondary">
        Collect in person. Bring ID that matches the account.
      </Text>

      <div className="sticky bottom-4 z-10 flex flex-wrap gap-3 rounded-(--radius-2xl) border border-border bg-background/95 p-3 backdrop-blur-sm supports-backdrop-filter:bg-background/80">
        <Button
          type="button"
          onClick={() => navigateToStory(VAULT_PORTFOLIO_STORY_ID)}
        >
          Submit retrieval request
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigateToStory(VAULT_PORTFOLIO_STORY_ID)}
        >
          Cancel
        </Button>
      </div>
    </VaultPageShell>
  );
}

const meta = {
  title: "Pages/Vault/Request Retrieval",
  component: VaultRequestRetrievalPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof VaultRequestRetrievalPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "Request retrieval" }),
    ).toBeVisible();
    expect(canvas.getByText(SHOP_NAME)).toBeVisible();
    expect(canvas.queryByText("Ship to me")).not.toBeInTheDocument();
    expect(canvas.queryByText("Grade10 Kowloon")).not.toBeInTheDocument();
  },
};
