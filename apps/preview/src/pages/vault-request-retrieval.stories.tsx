import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { Alert } from "@grade10/design-system/components/display/alert";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { RadioCard } from "@grade10/design-system/components/forms/radio-card";
import { RadioList } from "@grade10/design-system/components/forms/radio-list";
import { TextInput } from "@grade10/design-system/components/forms/text-input";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, within } from "storybook/test";
import {
  VAULT_ASSETS,
  VAULT_ITEM_DETAIL_HREF,
  VAULT_PORTFOLIO_HREF,
  VAULT_PORTFOLIO_STORY_ID,
} from "./vault-content";
import { PageHeader, ProposalBanner, VaultPageShell } from "./vault-shared";
import { navigateToStory } from "./workbench-story-nav";

function VaultRequestRetrievalPage() {
  const asset = VAULT_ASSETS[0];
  const [method, setMethod] = useState("pickup");

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

      <ProposalBanner title="Ops TBC">
        Ship-out fees and SLA are not finalized. Pickup and ship are both in the
        proposed model.
      </ProposalBanner>

      <RadioList
        label="How you want it back"
        value={method}
        onValueChange={(value) => {
          if (value) setMethod(value);
        }}
      >
        <RadioCard
          value="pickup"
          title="Pickup"
          description="Collect at a Grade10 store or by appointment at the facility (TBC)."
        />
        <RadioCard
          value="ship"
          title="Ship to me"
          description="Insured courier to your address. Fee schedule TBC."
        />
      </RadioList>

      {method === "ship" ? (
        <div className="flex flex-col gap-4 rounded-(--radius-2xl) border border-border bg-card p-5">
          <Text weight="medium">Delivery details</Text>
          <TextInput
            label="Delivery name *"
            autoComplete="name"
            defaultValue="Alex Chan"
          />
          <TextInput
            label="Address *"
            autoComplete="street-address"
            defaultValue="12/F, Tower 1, Harbour Road, Wan Chai"
          />
          <TextInput
            label="Phone *"
            type="tel"
            autoComplete="tel"
            defaultValue="+852 9123 4567"
          />
          <Alert
            dismissible={false}
            layout="inline"
            status="warning"
            title="Shipping & handling: fee placeholder (ops TBC)"
          />
        </div>
      ) : (
        <Alert
          dismissible={false}
          status="default"
          title="Pickup next step"
          description="We confirm the pickup window after ops schedules the release from Crown Fine Art."
        />
      )}

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
  title: "Pages/Vault Request Retrieval",
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
    expect(canvas.getByText("Pickup")).toBeVisible();
    expect(canvas.getByText("Ship to me")).toBeVisible();
  },
};
