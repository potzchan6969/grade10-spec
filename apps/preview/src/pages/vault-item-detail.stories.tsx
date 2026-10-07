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
} from "@grade10/design-system/components/display/card";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, within } from "storybook/test";
import {
  assetSubtitle,
  formatHkd,
  statusBadgeVariant,
  VAULT_ASSETS,
  VAULT_PORTFOLIO_HREF,
  VAULT_RETRIEVAL_STORY_ID,
} from "./vault-content";
import { FactRow, ProposalBanner, VaultPageShell } from "./vault-shared";
import { navigateToStory } from "./workbench-story-nav";

function VaultItemDetailPage() {
  const asset = VAULT_ASSETS[0];
  const [face, setFace] = useState<"front" | "back">("front");
  const gradeMeta =
    asset.condition === "Graded" && asset.cert
      ? `${assetSubtitle(asset)} · Cert ${asset.cert}`
      : assetSubtitle(asset);

  return (
    <VaultPageShell>
      <Breadcrumbs>
        <BreadcrumbItem href={VAULT_PORTFOLIO_HREF}>Vault</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem current>{asset.name}</BreadcrumbItem>
      </Breadcrumbs>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12">
        <div className="flex flex-col gap-3 lg:sticky lg:top-6">
          <div className="relative aspect-[3/4] overflow-hidden rounded-(--radius-2xl) border border-border bg-muted shadow-[0_1px_0_oklch(0_0_0/0.04)]">
            <img
              alt={`${face === "front" ? "Front" : "Back"} scan of ${asset.name}`}
              className="size-full object-cover"
              height={640}
              src={asset.imageSrc}
              width={480}
            />
            <div className="absolute top-3 left-3">
              <Badge variant={statusBadgeVariant(asset.status)}>
                {asset.status}
              </Badge>
            </div>
            <div className="absolute right-3 bottom-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm">
              {face === "front" ? "Front" : "Back"} · 1 of 1
            </div>
          </div>
          <fieldset
            className="m-0 grid grid-cols-2 gap-2 border-0 p-0"
            aria-label="Scan face"
          >
            <Button
              size="md"
              type="button"
              variant={face === "front" ? "secondary" : "outline"}
              aria-pressed={face === "front"}
              onClick={() => setFace("front")}
            >
              Front
            </Button>
            <Button
              size="md"
              type="button"
              variant={face === "back" ? "secondary" : "outline"}
              aria-pressed={face === "back"}
              onClick={() => setFace("back")}
            >
              Back
            </Button>
          </fieldset>
          <Text className="text-secondary-foreground" size="xs">
            HD scan. Back face uses the same fixture until dual scans ship.
            Deep-zoom / 360 Proposed.
          </Text>
        </div>

        <VStack className="min-w-0" gap="lg" hAlign="stretch">
          <VStack gap="md" hAlign="stretch">
            <VStack gap="sm" hAlign="stretch">
              <h1 className="font-heading text-3xl font-medium tracking-tight text-balance md:text-4xl">
                {asset.name}
              </h1>
              <HStack className="flex-wrap" gap="sm" vAlign="center">
                <Badge variant={statusBadgeVariant(asset.status)}>
                  {asset.status}
                </Badge>
                <Text className="text-secondary-foreground" size="sm">
                  {gradeMeta}
                </Text>
              </HStack>
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

          <Card className="gap-0 overflow-hidden py-0" padding={false}>
            <CardContent className="px-5">
              <FactRow
                label="Vault Storage ID"
                value={
                  <span className="font-mono text-sm">{asset.vaultId}</span>
                }
                hint="Climate-controlled slot at Crown Fine Art"
              />
              <FactRow label="Condition" value={asset.condition} />
              <FactRow label="Grade" value={asset.grade} />
              {asset.cert ? (
                <FactRow label="Cert number" value={asset.cert} />
              ) : null}
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-2 border-border bg-transparent sm:flex-row sm:items-center">
              <Button
                className="w-full sm:w-auto"
                type="button"
                onClick={() => navigateToStory(VAULT_RETRIEVAL_STORY_ID)}
              >
                Request retrieval
              </Button>
              <Button
                className="w-full sm:w-auto"
                disabled
                type="button"
                title="Proposed — not day one"
                variant="outline"
              >
                List for Auction
              </Button>
            </CardFooter>
          </Card>

          <ProposalBanner title="Auction listing">
            List for Auction is Proposed. Day one: hold in portfolio or request
            retrieval.
          </ProposalBanner>
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
} satisfies Meta<typeof VaultItemDetailPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InVault: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "1999 Charizard" }),
    ).toBeVisible();
    expect(canvas.getByText("Estimated value")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Request retrieval" }),
    ).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "List for Auction" }),
    ).toBeDisabled();
  },
};
