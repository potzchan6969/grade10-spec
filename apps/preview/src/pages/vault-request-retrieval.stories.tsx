import { Badge } from "@grade10/design-system/components/display/badge";
import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@grade10/design-system/components/display/card";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { MapPin } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  assetSubtitle,
  SHOP_ADDRESS,
  SHOP_NAME,
  statusBadgeVariant,
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

      <div className="mx-auto flex w-full max-w-xl flex-col gap-6 md:gap-8">
        <PageHeader
          title="Request retrieval"
          description="Confirm pickup at the Grade10 store. We release the item from storage after you submit."
        />

        <Card className="gap-0 overflow-hidden py-0" padding={false}>
          <CardContent className="p-0">
            <HStack className="min-w-0 p-4" gap="md" vAlign="center">
              <img
                alt=""
                className="size-16 shrink-0 rounded-(--radius-lg) border border-border object-cover"
                height={64}
                src={asset.imageSrc}
                width={64}
              />
              <VStack className="min-w-0 flex-1" gap="xs" hAlign="start">
                <Text className="truncate" weight="medium">
                  {asset.name}
                </Text>
                <Text className="text-secondary-foreground" size="sm">
                  {assetSubtitle(asset)}
                </Text>
                {asset.vaultId ? (
                  <Text
                    className="font-mono text-secondary-foreground"
                    size="xs"
                  >
                    {asset.vaultId}
                  </Text>
                ) : null}
              </VStack>
              <Badge variant={statusBadgeVariant(asset.status)}>
                {asset.status}
              </Badge>
            </HStack>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pickup location</CardTitle>
          </CardHeader>
          <CardContent>
            <HStack className="min-w-0" gap="sm" vAlign="start">
              <span
                aria-hidden
                className="mt-0.5 flex size-4 shrink-0 items-center justify-center text-secondary-foreground"
              >
                <MapPin size={16} weight="regular" />
              </span>
              <VStack className="min-w-0" gap="none" hAlign="start">
                <Text as="span" weight="medium">
                  {SHOP_NAME}
                </Text>
                <Text
                  as="span"
                  className="text-pretty text-secondary-foreground"
                  size="sm"
                >
                  {SHOP_ADDRESS}
                </Text>
              </VStack>
            </HStack>
          </CardContent>
          <CardFooter className="border-border bg-transparent">
            <Text className="text-pretty text-secondary-foreground" size="sm">
              Collect in person. Bring ID that matches the account. We confirm
              the pickup window after release from storage.
            </Text>
          </CardFooter>
        </Card>

        <div className="sticky bottom-4 z-10 flex flex-col gap-2 rounded-(--radius-2xl) border border-border bg-background p-3 shadow-sm sm:flex-row sm:items-center">
          <Button
            className="w-full sm:flex-1"
            type="button"
            onClick={() => navigateToStory(VAULT_PORTFOLIO_STORY_ID)}
          >
            Submit retrieval request
          </Button>
          <Button
            className="w-full sm:w-auto"
            type="button"
            variant="ghost"
            onClick={() => navigateToStory(VAULT_PORTFOLIO_STORY_ID)}
          >
            Cancel
          </Button>
        </div>

        <ProposalBanner title="Pickup only">
          Day one is collect at the Hong Kong Grade10 Store in Causeway Bay.
          Ship-home retrieval is Proposed.
        </ProposalBanner>
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
    expect(canvas.getByText(SHOP_ADDRESS)).toBeVisible();
    expect(canvas.getByText("Pickup location")).toBeVisible();
    expect(canvas.queryByText("Ship to me")).not.toBeInTheDocument();
    expect(canvas.queryByText("Grade10 Kowloon")).not.toBeInTheDocument();
    expect(canvas.getByText("Pickup only")).toBeVisible();
  },
};
