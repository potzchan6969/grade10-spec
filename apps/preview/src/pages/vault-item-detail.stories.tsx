import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, within } from "storybook/test";
import {
  formatHkd,
  statusBadgeVariant,
  VAULT_ASSETS,
  VAULT_PORTFOLIO_HREF,
  VAULT_RETRIEVAL_STORY_ID,
} from "./vault-content";
import {
  FactRow,
  PageHeader,
  ProposalBanner,
  VaultPageShell,
} from "./vault-shared";
import { navigateToStory } from "./workbench-story-nav";

function VaultItemDetailPage() {
  const asset = VAULT_ASSETS[0];
  const [face, setFace] = useState<"front" | "back">("front");

  return (
    <VaultPageShell>
      <Breadcrumbs>
        <BreadcrumbItem href={VAULT_PORTFOLIO_HREF}>Vault</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem current>{asset.name}</BreadcrumbItem>
      </Breadcrumbs>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-10">
        <div className="flex flex-col gap-3">
          <div className="relative aspect-[3/4] overflow-hidden rounded-(--radius-2xl) border border-border bg-muted">
            <img
              alt={`${face === "front" ? "Front" : "Back"} scan of ${asset.name}`}
              className="size-full object-cover"
              height={520}
              src={asset.imageSrc}
              width={390}
            />
            <div className="absolute top-3 left-3">
              <Badge variant={statusBadgeVariant(asset.status)}>
                {asset.status}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2" role="group" aria-label="Scan face">
            <Button
              size="sm"
              type="button"
              variant={face === "front" ? "secondary" : "ghost"}
              aria-pressed={face === "front"}
              onClick={() => setFace("front")}
            >
              Front
            </Button>
            <Button
              size="sm"
              type="button"
              variant={face === "back" ? "secondary" : "ghost"}
              aria-pressed={face === "back"}
              onClick={() => setFace("back")}
            >
              Back
            </Button>
          </div>
          <Text size="xs" tone="secondary">
            HD scan · Deep-zoom / 360 Proposed (ops TBC)
          </Text>
        </div>

        <div className="flex flex-col gap-6">
          <PageHeader
            title={asset.name}
            description={`${asset.set} · ${asset.grade} · Cert ${asset.cert}`}
          />

          <div className="rounded-(--radius-2xl) border border-border px-5">
            <FactRow
              label="Estimated value"
              value={formatHkd(asset.estimateHkd)}
              hint={`Source: ${asset.valuationSource}`}
            />
            <FactRow
              label="Vault Storage ID"
              value={
                <span className="font-mono text-sm">{asset.vaultId}</span>
              }
              hint="Climate-controlled slot at Crown Fine Art"
            />
            <FactRow label="Grade" value={asset.grade} />
            <FactRow label="Cert number" value={asset.cert} />
          </div>

          <ProposalBanner title="Auction listing">
            List for Auction is Proposed. Day one: hold in portfolio or request
            retrieval.
          </ProposalBanner>

          <div className="sticky bottom-4 z-10 flex flex-wrap gap-3 rounded-(--radius-2xl) border border-border bg-background/95 p-3 backdrop-blur-sm supports-backdrop-filter:bg-background/80">
            <Button
              type="button"
              onClick={() => navigateToStory(VAULT_RETRIEVAL_STORY_ID)}
            >
              Request retrieval
            </Button>
            <Button disabled type="button" title="Proposed — not day one">
              List for Auction
            </Button>
          </div>
        </div>
      </div>
    </VaultPageShell>
  );
}

const meta = {
  title: "Pages/Vault Item Detail",
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
    expect(
      canvas.getByRole("button", { name: "Request retrieval" }),
    ).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "List for Auction" }),
    ).toBeDisabled();
  },
};
