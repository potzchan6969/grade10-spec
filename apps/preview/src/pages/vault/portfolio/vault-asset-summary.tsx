import { Alert } from "@grade10/design-system/components/display/alert";
import { Badge } from "@grade10/design-system/components/display/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@grade10/design-system/components/display/card";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@grade10/design-system/components/overlays/tooltip";
import {
  Gavel,
  Info,
  ShieldCheck,
  Storefront,
  TrendUp,
  Warning,
} from "@phosphor-icons/react";
import {
  assetEstDailyUsd,
  formatHkd,
  statusBadgeVariant,
  type VaultAsset,
} from "../../vault-content";

/** What the headline shows: a sale's own price while listed, else the estimate. */
function headlinePrice(asset: VaultAsset): {
  label: string;
  amountHkd: number;
} {
  if (asset.status === "Live Auction" && asset.currentBidHkd != null) {
    return { label: "Bid price", amountHkd: asset.currentBidHkd };
  }
  if (asset.status === "Listed" && asset.listedHkd != null) {
    return { label: "Listed price", amountHkd: asset.listedHkd };
  }
  return { label: "Estimated value", amountHkd: asset.estimateHkd };
}

type VaultAssetSummaryProps = {
  asset: VaultAsset;
  /** Feature flag: show the change-since-intake figure. Soft launch leaves it off even when the data exists. */
  showEstimateChange?: boolean;
  /** Feature flag + handler: listing for auction is available. */
  onListForAuction?: () => void;
  /** Feature flag + handler: listing for sale is available. */
  onListForSale?: () => void;
  onSubmitForGrading?: () => void;
  /** Live-auction CTA — links out to the auction lot page. */
  onViewAuction?: () => void;
  /** Store-listing CTA — links out to the product page. */
  onViewListing?: () => void;
  className?: string;
};

function statusLabel(status: VaultAsset["status"]): string {
  if (status === "In Vault") return "Secured in Vault";
  return status;
}

/**
 * Asset summary for the vault item detail page: status badge, title, estimated
 * value card, value-potential alert, and listing CTAs. Drawn from the Figma
 * Asset Summary block (`7054:6854`).
 */
function VaultAssetSummary({
  asset,
  showEstimateChange = false,
  onListForAuction,
  onListForSale,
  onSubmitForGrading,
  onViewAuction,
  onViewListing,
  className,
}: VaultAssetSummaryProps) {
  const valuePotential = asset.valuePotential;
  const liveListing =
    asset.status === "Live Auction" || asset.status === "Listed";
  const locked = liveListing || asset.status === "Retrieval Pending";
  const price = headlinePrice(asset);
  const estDailyUsd = assetEstDailyUsd(asset);
  const daysVaulted = asset.vaultedAt
    ? Math.max(
        1,
        Math.floor((Date.now() - Date.parse(asset.vaultedAt)) / 86_400_000),
      )
    : 0;
  const earnedUsd = Math.round(estDailyUsd * daysVaulted * 100) / 100;
  const showListings = !locked && Boolean(onListForAuction || onListForSale);
  const valuePotentialDescription = valuePotential
    ? `Est. Graded PSA Value: ${formatHkd(valuePotential.gradedEstimateHkd)}`
    : undefined;

  return (
    <VStack className={className} gap="md" hAlign="stretch">
      <VStack gap="sm" hAlign="stretch">
        <Badge
          variant={
            asset.status === "In Vault"
              ? "default"
              : asset.status === "Retrieval Pending"
                ? "outline"
                : statusBadgeVariant(asset.status)
          }
        >
          {asset.status === "In Vault" ? (
            <ShieldCheck aria-hidden weight="bold" />
          ) : null}
          {statusLabel(asset.status)}
        </Badge>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance md:text-4xl">
          {asset.name}
        </h1>
      </VStack>

      <Card className="bg-background-subtle">
        <CardHeader className="gap-2">
          <CardDescription className="text-xs font-medium uppercase text-secondary-foreground">
            {liveListing ? price.label : "Total earned to date"}
          </CardDescription>
          <div className="flex flex-wrap items-baseline gap-1">
            {liveListing ? (
              <>
                <Text className="font-heading" size="lg" weight="medium">
                  HK$
                </Text>
                <CardTitle className="font-heading text-3xl font-medium tabular-nums">
                  {price.amountHkd.toLocaleString("en-HK")}
                </CardTitle>
                {showEstimateChange && asset.estimateChangePercent != null ? (
                  <Text
                    className="font-heading font-semibold"
                    size="sm"
                    tone="success"
                    weight="bold"
                  >
                    ▲ {asset.estimateChangePercent}%
                  </Text>
                ) : null}
              </>
            ) : (
              <CardTitle className="font-heading text-3xl font-medium tabular-nums">
                US${" "}
                {earnedUsd.toLocaleString("en-HK", {
                  minimumFractionDigits: 2,
                })}
              </CardTitle>
            )}
          </div>
          {liveListing ? null : (
            <Text
              as="span"
              className="flex items-center gap-1"
              size="sm"
              tone="secondary"
            >
              {asset.priceStale
                ? "Est. paused"
                : `Est. US$${estDailyUsd.toFixed(2)} / day`}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    aria-label={
                      asset.priceStale
                        ? "Why the daily estimate is paused"
                        : "How the daily rate is estimated"
                    }
                    className={`inline-flex size-4 items-center justify-center ${asset.priceStale ? "text-warning" : "text-secondary-foreground"} outline-none focus-visible:ring-3 focus-visible:ring-ring/50`}
                    render={<button type="button" />}
                  >
                    {asset.priceStale ? (
                      <Warning aria-hidden size={14} weight="fill" />
                    ) : (
                      <Info aria-hidden size={14} weight="bold" />
                    )}
                  </TooltipTrigger>
                  <TooltipContent>
                    {asset.priceStale
                      ? "Daily earning paused while the market price is unavailable. Missed days credit immediately once pricing resumes."
                      : "Updated daily based on market liquidity factors."}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Text>
          )}
        </CardHeader>
        {valuePotential ? (
          <CardContent>
            <Alert
              actions={
                <Button
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={onSubmitForGrading}
                >
                  Submit for Grading
                </Button>
              }
              description={valuePotentialDescription}
              dismissible={false}
              icon={<TrendUp aria-hidden size={20} weight="bold" />}
              status="warning"
              title="Value Potential"
            />
          </CardContent>
        ) : null}
      </Card>

      {liveListing ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {asset.status === "Live Auction" && onViewAuction ? (
            <Button
              className="w-full sm:flex-1"
              leading={<Gavel aria-hidden weight="bold" />}
              size="md"
              type="button"
              onClick={onViewAuction}
            >
              View Auction
            </Button>
          ) : null}
          {asset.status === "Listed" && onViewListing ? (
            <Button
              className="w-full sm:flex-1"
              leading={<Storefront aria-hidden weight="bold" />}
              size="md"
              type="button"
              onClick={onViewListing}
            >
              View Listing
            </Button>
          ) : null}
        </div>
      ) : null}

      {showListings ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {onListForAuction ? (
            <Button
              className="w-full sm:flex-1"
              leading={<Gavel aria-hidden weight="bold" />}
              size="md"
              type="button"
              onClick={onListForAuction}
            >
              List for Auction
            </Button>
          ) : null}
          {onListForSale ? (
            <Button
              className="w-full sm:flex-1"
              leading={<Storefront aria-hidden weight="bold" />}
              size="md"
              type="button"
              variant="outline"
              onClick={onListForSale}
            >
              List for Sale
            </Button>
          ) : null}
        </div>
      ) : null}
    </VStack>
  );
}

export type { VaultAssetSummaryProps };
export { VaultAssetSummary };
