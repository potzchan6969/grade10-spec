import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { Toast, toast } from "@grade10/design-system/components/overlays/toast";
import { cn } from "@grade10/design-system/lib/utils";
import { LISTING_LOT_SIDEBAR_CLASS, ListingLotGallery } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import {
  AUCTION_LOT_LIVE_STORY_ID,
  RETRIEVAL_REQUESTED_TOAST,
  STORE_PRODUCT_DETAIL_STORY_ID,
  VAULT_ASSET_DETAILS,
  VAULT_LISTED_ASSET_DETAIL,
  VAULT_LIVE_AUCTION_ASSET_DETAIL,
  VAULT_PORTFOLIO_HREF,
  VAULT_RETRIEVAL_PENDING_ASSET_DETAIL,
  withRetrievalRequested,
} from "../../vault-content";
import { PAGE_ENTER_CLASS, VaultItemDetailPageShell } from "../../vault-shared";
import { navigateToStory } from "../../workbench-story-nav";
import { VaultAssetCustodyDocuments } from "./vault-asset-custody-documents";
import { VaultAssetDetails } from "./vault-asset-details";
import type { VaultAssetSummaryProps } from "./vault-asset-summary";
import { VaultAssetSummary } from "./vault-asset-summary";
import { VaultRequestRetrievalDialog } from "./vault-request-retrieval-dialog";

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
  const [current, setCurrent] = useState(asset);
  const galleryImages = [
    {
      src: current.imageSrc,
      alt: `Front scan of ${current.name}`,
      label: "Front",
    },
    {
      src: current.imageSrc,
      alt: `Back scan of ${current.name}`,
      label: "Back",
    },
    {
      src: current.imageSrc,
      alt: `Label of ${current.name}`,
      label: "Label",
    },
  ];

  return (
    <VaultItemDetailPageShell
      header={
        <div className={PAGE_ENTER_CLASS}>
          <Breadcrumbs>
            <BreadcrumbItem href={VAULT_PORTFOLIO_HREF}>Vault</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem current>{current.name}</BreadcrumbItem>
          </Breadcrumbs>
        </div>
      }
    >
      <div className={cn(PAGE_ENTER_CLASS, "delay-[30ms]")}>
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

      <VStack className={LISTING_LOT_SIDEBAR_CLASS} gap="lg" hAlign="stretch">
        <div className={cn(PAGE_ENTER_CLASS, "delay-[60ms]")}>
          <VaultAssetSummary
            asset={current}
            showEstimateChange={showEstimateChange}
            onListForAuction={onListForAuction}
            onListForSale={onListForSale}
            onSubmitForGrading={() => {}}
            onViewAuction={
              current.status === "Live Auction"
                ? () => navigateToStory(AUCTION_LOT_LIVE_STORY_ID)
                : undefined
            }
            onViewListing={
              current.status === "Listed"
                ? () => navigateToStory(STORE_PRODUCT_DETAIL_STORY_ID)
                : undefined
            }
          />
        </div>
        <div className={cn(PAGE_ENTER_CLASS, "delay-[90ms]")}>
          <VaultAssetDetails
            asset={current}
            onRequestRetrieval={() => setRetrievalOpen(true)}
            verifyHref={
              current.cert
                ? `https://www.psacard.com/cert/${current.cert}`
                : undefined
            }
          />
        </div>
        <div className={cn(PAGE_ENTER_CLASS, "delay-[120ms]")}>
          <VaultAssetCustodyDocuments asset={current} />
        </div>
      </VStack>

      <VaultRequestRetrievalDialog
        asset={current}
        onOpenChange={setRetrievalOpen}
        onSubmit={() => {
          setCurrent((a) => withRetrievalRequested(a));
          toast.success(RETRIEVAL_REQUESTED_TOAST.title, {
            description: RETRIEVAL_REQUESTED_TOAST.description,
          });
        }}
        open={retrievalOpen}
      />
      <Toast position="bottom-right" />
    </VaultItemDetailPageShell>
  );
}

/** Controls-panel flags mapped to the page's callback props. */
type DetailFlags = {
  listForAuction: boolean;
  listForSale: boolean;
};

const meta = {
  title: "Vault/Portfolio/Asset Detail",
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
      key={args.asset.id}
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
    await waitFor(() => {
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
      expect(
        canvas.getByRole("button", { name: "List for Sale" }),
      ).toBeVisible();
      expect(canvas.getByText("Grade")).toBeVisible();
      expect(canvas.getByText("PSA 10 Gem Mint")).toBeVisible();
      expect(canvas.getByRole("link", { name: "Verify" })).toBeVisible();
      expect(
        canvas.getByRole("link", { name: "Request Retrieval" }),
      ).toBeVisible();
      expect(canvas.getByRole("tab", { name: "Custody Log" })).toBeVisible();
      expect(canvas.getByRole("tab", { name: "Documents" })).toBeVisible();
    });
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
    await waitFor(() => {
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
      expect(
        canvas.getByRole("button", { name: "List for Auction" }),
      ).toBeVisible();
      expect(
        canvas.getByRole("button", { name: "List for Sale" }),
      ).toBeVisible();
      expect(
        canvas.getByRole("link", { name: "Request Retrieval" }),
      ).toBeVisible();
      expect(canvas.getByText("Raw, Lightly Played")).toBeVisible();
    });
    expect(canvas.queryByText("Grade")).toBeNull();
    expect(canvas.queryByText("Verify")).toBeNull();
  },
};

/** Store-listed holding — LISTED PRICE plus a View Listing link to the product page. */
export const Listed: Story = {
  args: {
    asset: VAULT_LISTED_ASSET_DETAIL,
    listForAuction: false,
    listForSale: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => {
      expect(canvas.getByText("Listed price")).toBeVisible();
      expect(canvas.getByText("120,000")).toBeVisible();
      expect(
        canvas.getByRole("button", { name: "View Listing" }),
      ).toBeVisible();
      expect(canvas.getByText("Listed")).toBeVisible();
      expect(canvas.getByText("Listed").querySelector("svg")).toBeNull();
      expect(canvas.getByText("Listed in the Grade10 Store")).toBeVisible();
    });
    expect(
      canvas.queryByRole("button", { name: "List for Auction" }),
    ).toBeNull();
    // Locked while listed — retrieval resumes only after delisting.
    expect(
      canvas.queryByRole("link", { name: "Request Retrieval" }),
    ).toBeNull();
  },
};

/** Auction-bound holding — BID PRICE plus a View Auction link to the lot. */
export const LiveAuction: Story = {
  args: {
    asset: VAULT_LIVE_AUCTION_ASSET_DETAIL,
    listForAuction: false,
    listForSale: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => {
      expect(canvas.getByText("Bid price")).toBeVisible();
      expect(canvas.getByText("110,000")).toBeVisible();
      expect(
        canvas.getByRole("button", { name: "View Auction" }),
      ).toBeVisible();
      expect(canvas.getByText("Live Auction")).toBeVisible();
      expect(canvas.getByText("Live Auction").querySelector("svg")).toBeNull();
      expect(canvas.getByText("Listed for auction")).toBeVisible();
    });
    // Locked while bidding is live — no retrieval until it settles.
    expect(
      canvas.queryByRole("link", { name: "Request Retrieval" }),
    ).toBeNull();
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
    await waitFor(() =>
      expect(
        canvas.getByRole("link", { name: "Request Retrieval" }),
      ).toBeVisible(),
    );
  },
};

/**
 * Retrieval Pending — the request is in flight: the lock wins over the list
 * flags, the custody log leads with the request, and retrieval is not offered
 * a second time.
 */
export const RetrievalPending: Story = {
  args: {
    asset: VAULT_RETRIEVAL_PENDING_ASSET_DETAIL,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => {
      expect(canvas.getByText("Retrieval Pending")).toBeVisible();
      expect(canvas.getByText("Retrieval requested")).toBeVisible();
    });
    expect(
      canvas.queryByRole("button", { name: "List for Auction" }),
    ).toBeNull();
    expect(canvas.queryByRole("button", { name: "List for Sale" })).toBeNull();
    expect(
      canvas.queryByRole("link", { name: "Request Retrieval" }),
    ).toBeNull();
  },
};

/**
 * Request Retrieval flow — open the dialog, submit, and the page flips to
 * Retrieval Pending with a success toast while the list CTAs lock.
 */
export const RequestRetrieval: Story = {
  args: {
    asset: VAULT_ASSET_DETAILS[0],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    await waitFor(() =>
      expect(
        canvas.getByRole("link", { name: "Request Retrieval" }),
      ).toBeVisible(),
    );
    await userEvent.click(
      canvas.getByRole("link", { name: "Request Retrieval" }),
    );
    const dialog = await waitFor(() => {
      const found = page.getByRole("dialog", { name: "Request Retrieval" });
      expect(found).toBeVisible();
      return found;
    });
    await userEvent.click(
      within(dialog).getByRole("button", {
        name: "Submit Request",
      }),
    );
    await waitFor(() => {
      const toastEl = canvasElement.ownerDocument.body.querySelector(
        "[data-sonner-toast]",
      );
      expect(toastEl).not.toBeNull();
      expect(
        within(toastEl as HTMLElement).getByText("Retrieval requested"),
      ).toBeVisible();
      expect(canvas.getByText("Retrieval Pending")).toBeVisible();
    });
    expect(
      canvas.queryByRole("button", { name: "List for Auction" }),
    ).toBeNull();
    expect(canvas.queryByRole("button", { name: "List for Sale" })).toBeNull();
    expect(
      canvas.queryByRole("link", { name: "Request Retrieval" }),
    ).toBeNull();
  },
};
