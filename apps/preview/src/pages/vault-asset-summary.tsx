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
import { Gavel, ShieldCheck, Storefront, TrendUp } from "@phosphor-icons/react";
import {
  assetPrice,
  formatHkd,
  statusBadgeVariant,
  type VaultAsset,
} from "./vault-content";

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
  const price = assetPrice(asset);
  const showListings =
    !liveListing && Boolean(onListForAuction || onListForSale);
  const valuePotentialDescription = valuePotential
    ? `Est. Graded PSA Value: ${formatHkd(valuePotential.gradedEstimateHkd)} (+${valuePotential.upsidePercent}%)`
    : undefined;

  return (
    <VStack className={className} gap="md" hAlign="stretch">
      <VStack gap="sm" hAlign="stretch">
        <Badge
          variant={
            asset.status === "In Vault"
              ? "default"
              : statusBadgeVariant(asset.status)
          }
        >
          {liveListing ? null : <ShieldCheck aria-hidden weight="bold" />}
          {statusLabel(asset.status)}
        </Badge>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance md:text-4xl">
          {asset.name}
        </h1>
      </VStack>

      <Card className="bg-background-subtle">
        <CardHeader className="gap-2">
          <CardDescription className="text-xs font-medium uppercase text-secondary-foreground">
            {liveListing ? price.label : "Estimated value since intake"}
          </CardDescription>
          <div className="flex flex-wrap items-baseline gap-1">
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
          </div>
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
