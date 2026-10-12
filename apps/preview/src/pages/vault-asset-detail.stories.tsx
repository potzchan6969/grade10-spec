import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { LISTING_LOT_SIDEBAR_CLASS, ListingLotGallery } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, within } from "storybook/test";
import { VaultAssetCustodyDocuments } from "./vault-asset-custody-documents";
import { VaultAssetDetails } from "./vault-asset-details";
import type { VaultAssetSummaryProps } from "./vault-asset-summary";
import { VaultAssetSummary } from "./vault-asset-summary";
import { VAULT_ASSET_DETAILS, VAULT_PORTFOLIO_HREF } from "./vault-content";
import { VaultRequestRetrievalDialog } from "./vault-request-retrieval-dialog";
import { VaultItemDetailPageShell } from "./vault-shared";

function VaultAssetDetailPage({
  asset,
  showEstimateChange,
  onListForAuction,
  onListForSale,
}: {
  asset: (typeof VAULT_ASSET_DETAILS)[number];
} & Pick<
  VaultAssetSummaryProps,
  "showEstimateChange" | "onListForAuction" | "onListForSale"
>) {
  const [retrievalOpen, setRetrievalOpen] = useState(false);
  const galleryImages = [
    {
      src: asset.imageSrc,
      alt: `Front scan of ${asset.name}`,
      label: "Front",
    },
    {
      src: asset.imageSrc,
      alt: `Back scan of ${asset.name}`,
      label: "Back",
    },
    {
      src: asset.imageSrc,
      alt: `Label of ${asset.name}`,
      label: "Label",
    },
  ];

  return (
    <VaultItemDetailPageShell
      header={
        <Breadcrumbs>
          <BreadcrumbItem href={VAULT_PORTFOLIO_HREF}>Vault</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem current>{asset.name}</BreadcrumbItem>
        </Breadcrumbs>
      }
    >
      <ListingLotGallery
        copy={{
          zoom: "Zoom image",
          previous: "Previous image",
          next: "Next image",
          images: "Item images",
        }}
        images={galleryImages}
      />

      <VStack className={LISTING_LOT_SIDEBAR_CLASS} gap="lg" hAlign="stretch">
        <VaultAssetSummary
          asset={asset}
          showEstimateChange={showEstimateChange}
          onListForAuction={onListForAuction}
          onListForSale={onListForSale}
          onSubmitForGrading={() => {}}
        />
        <VaultAssetDetails
          asset={asset}
          onRequestRetrieval={() => setRetrievalOpen(true)}
          verifyHref={
            asset.cert
              ? `https://www.psacard.com/cert/${asset.cert}`
              : undefined
          }
        />
        <VaultAssetCustodyDocuments asset={asset} />
      </VStack>

      <VaultRequestRetrievalDialog
        asset={asset}
        onOpenChange={setRetrievalOpen}
        open={retrievalOpen}
      />
    </VaultItemDetailPageShell>
  );
}

/** Controls-panel flags mapped to the page's callback props. */
type DetailFlags = {
  listForAuction: boolean;
  listForSale: boolean;
};

const meta = {
  title: "Pages/Vault/Asset Detail",
  component: VaultAssetDetailPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    asset: VAULT_ASSET_DETAILS[0],
    listForAuction: true,
    listForSale: true,
  },
  render: ({ listForAuction, listForSale, ...args }) => (
    <VaultAssetDetailPage
      {...args}
      onListForAuction={listForAuction ? () => {} : undefined}
      onListForSale={listForSale ? () => {} : undefined}
    />
  ),
} satisfies Meta<Parameters<typeof VaultAssetDetailPage>[0] & DetailFlags>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Graded: Story = {
  args: {
    asset: VAULT_ASSET_DETAILS[0],
    showEstimateChange: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", {
        level: 1,
        name: VAULT_ASSET_DETAILS[0].name,
      }),
    ).toBeVisible();
    expect(canvas.getByText("Estimated value since intake")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "List for Auction" }),
    ).toBeVisible();
    expect(canvas.getByRole("button", { name: "List for Sale" })).toBeVisible();
    expect(canvas.getByText("Grade")).toBeVisible();
    expect(canvas.getByText("PSA 10 Gem Mint")).toBeVisible();
    expect(canvas.getByRole("link", { name: "Verify" })).toBeVisible();
    expect(
      canvas.getByRole("link", { name: "Request Retrieval" }),
    ).toBeVisible();
    expect(canvas.getByRole("tab", { name: "Custody Log" })).toBeVisible();
    expect(canvas.getByRole("tab", { name: "Documents" })).toBeVisible();
    expect(
      within(canvasElement.ownerDocument.body).queryByRole("dialog", {
        name: "Request Retrieval",
      }),
    ).not.toBeInTheDocument();
  },
};

export const Raw: Story = {
  args: {
    asset: VAULT_ASSET_DETAILS[1],
    showEstimateChange: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", {
        level: 1,
        name: VAULT_ASSET_DETAILS[1].name,
      }),
    ).toBeVisible();
    expect(canvas.getByText("Value Potential")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Submit for Grading" }),
    ).toBeVisible();
    expect(canvas.queryByText("Grade")).toBeNull();
    expect(canvas.queryByText("Verify")).toBeNull();
    expect(
      canvas.getByRole("button", { name: "List for Auction" }),
    ).toBeVisible();
    expect(canvas.getByRole("button", { name: "List for Sale" })).toBeVisible();
    expect(
      canvas.getByRole("link", { name: "Request Retrieval" }),
    ).toBeVisible();
    expect(canvas.getByText("Raw, Lightly Played")).toBeVisible();
  },
};

/**
 * Soft launch — compare figure and listing CTAs hidden; each launches on its
 * own timeline via `showEstimateChange`, `onListForAuction`, `onListForSale`.
 */
export const GradedSoftLaunch: Story = {
  args: {
    asset: VAULT_ASSET_DETAILS[0],
    listForAuction: false,
    listForSale: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.queryByRole("button", { name: "List for Auction" }),
    ).toBeNull();
    expect(canvas.queryByRole("button", { name: "List for Sale" })).toBeNull();
    expect(canvas.queryByText("▲ 12.4%")).toBeNull();
    expect(
      canvas.getByRole("link", { name: "Request Retrieval" }),
    ).toBeVisible();
  },
};
