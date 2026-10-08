import { Badge } from "@grade10/design-system/components/display/badge";
import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { ListingLotGallery } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  formatHkd,
  statusBadgeVariant,
  VAULT_ASSETS,
  VAULT_PORTFOLIO_HREF,
  VAULT_RETRIEVAL_STORY_ID,
} from "./vault-content";
import { VaultPageShell } from "./vault-shared";
import { navigateToStory } from "./workbench-story-nav";

function VaultItemDetailPage({
  asset,
}: {
  asset: (typeof VAULT_ASSETS)[number];
}) {
  const galleryImages = [
    {
      src: asset.imageSrc,
      alt: `Front scan of ${asset.name}`,
    },
    {
      src: asset.imageSrc,
      alt: `Back scan of ${asset.name}`,
    },
  ];

  return (
    <VaultPageShell>
      <Breadcrumbs>
        <BreadcrumbItem href={VAULT_PORTFOLIO_HREF}>Vault</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem current>{asset.name}</BreadcrumbItem>
      </Breadcrumbs>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12">
        <div className="flex flex-col gap-3 lg:sticky lg:top-6">
          <ListingLotGallery
            copy={{
              zoom: "Zoom image",
              previous: "Previous image",
              next: "Next image",
              images: "Item images",
            }}
            images={galleryImages}
          />
        </div>

        <VStack className="min-w-0" gap="lg" hAlign="stretch">
          <VStack gap="md" hAlign="stretch">
            <VStack gap="sm" hAlign="stretch">
              <Badge variant={statusBadgeVariant(asset.status)}>
                {asset.status}
              </Badge>
              <h1 className="font-heading text-3xl font-medium tracking-tight text-balance md:text-4xl">
                {asset.name}
              </h1>
            </VStack>

            <div className="rounded-(--radius-2xl) border border-border bg-card px-5 py-4">
              <Text className="text-secondary-foreground" size="sm">
                Estimated value
              </Text>
              <p className="mt-1 font-heading text-3xl font-medium tracking-tight tabular-nums md:text-4xl">
                {formatHkd(asset.estimateHkd)}
              </p>
              <Text className="mt-1 text-secondary-foreground" size="xs">
                Source: {asset.valuationSource}
              </Text>
            </div>
          </VStack>

          <VStack gap="lg" hAlign="stretch">
            <div className="rounded-(--radius-2xl) border border-border bg-card px-5 py-4">
              <Text
                className="text-secondary-foreground"
                size="sm"
                weight="medium"
              >
                Item Details
              </Text>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <Text className="text-secondary-foreground" size="xs">
                    Vault Storage ID
                  </Text>
                  <Text className="font-mono text-sm" size="base">
                    {asset.vaultId}
                  </Text>
                  <Text className="text-secondary-foreground" size="xs">
                    Climate-controlled slot at Crown Fine Art
                  </Text>
                </div>
                <div className="flex flex-col gap-1">
                  <Text className="text-secondary-foreground" size="xs">
                    Condition
                  </Text>
                  <Text size="base">{asset.condition}</Text>
                </div>
                <div className="flex flex-col gap-1">
                  <Text className="text-secondary-foreground" size="xs">
                    Grade
                  </Text>
                  <Text size="base">{asset.grade}</Text>
                </div>
                {asset.cert ? (
                  <div className="flex flex-col gap-1">
                    <Text className="text-secondary-foreground" size="xs">
                      Cert number
                    </Text>
                    <Text size="base">{asset.cert}</Text>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                className="w-full sm:w-auto"
                size="lg"
                type="button"
                onClick={() => navigateToStory(VAULT_RETRIEVAL_STORY_ID)}
              >
                Request Retrieval
              </Button>
              {asset.condition === "Raw" ? (
                <Button
                  className="w-full sm:w-auto"
                  size="lg"
                  type="button"
                  variant="outline"
                >
                  Submit for Grading
                </Button>
              ) : (
                <Button
                  className="w-full sm:w-auto"
                  disabled
                  size="lg"
                  type="button"
                  title="Proposed — not day one"
                  variant="outline"
                >
                  List for Auction
                </Button>
              )}
            </div>
          </VStack>
        </VStack>
      </div>
    </VaultPageShell>
  );
}

const meta = {
  title: "Pages/Vault/Item Detail",
  component: VaultItemDetailPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    asset: VAULT_ASSETS[0],
  },
} satisfies Meta<typeof VaultItemDetailPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Graded: Story = {
  args: {
    asset: VAULT_ASSETS[0],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "1999 Charizard" }),
    ).toBeVisible();
    expect(canvas.getByText("Estimated value")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Request Retrieval" }),
    ).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "List for Auction" }),
    ).toBeDisabled();
  },
};

export const Raw: Story = {
  args: {
    asset: VAULT_ASSETS[1],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "Rolex Submariner Date" }),
    ).toBeVisible();
    expect(canvas.getByText("Estimated value")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Request Retrieval" }),
    ).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Submit for Grading" }),
    ).toBeVisible();
  },
};
