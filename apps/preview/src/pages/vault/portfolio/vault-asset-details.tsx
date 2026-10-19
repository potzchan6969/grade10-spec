import { DetailRow } from "@grade10/design-system/components/display/detail-row";
import { Link } from "@grade10/design-system/components/forms/link";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { ArrowSquareOut } from "@phosphor-icons/react";
import type { VaultAsset } from "../../vault-content";

type VaultAssetDetailsProps = {
  asset: VaultAsset;
  verifyHref?: string;
  onRequestRetrieval?: () => void;
  className?: string;
};

/**
 * Attribute list for the vault asset detail page. Graded assets show grade and
 * cert number with a verify link; raw assets show vault storage, location, and
 * condition. A Request Retrieval link sits below the rows.
 */
function VaultAssetDetails({
  asset,
  verifyHref,
  onRequestRetrieval,
  className,
}: VaultAssetDetailsProps) {
  const isGraded = asset.condition === "Graded";
  const conditionDisplay = asset.conditionDescription ?? asset.condition;
  // A listed or auctioned asset is locked — retrieval only resumes if it
  // delists back to In Vault; a request already in flight hides the link.
  const retrievable =
    asset.status !== "Listed" &&
    asset.status !== "Live Auction" &&
    asset.status !== "Retrieval Pending";

  return (
    <VStack className={className} gap="none" hAlign="stretch">
      {isGraded ? (
        <>
          <DetailRow label="Grade">{asset.grade}</DetailRow>
          <DetailRow label="Cert Number">
            <span className="inline-flex flex-wrap items-center justify-end gap-2">
              {asset.cert}
              {verifyHref ? (
                <Link
                  href={verifyHref}
                  rel="noopener noreferrer"
                  size="sm"
                  target="_blank"
                  variant="brand"
                  trailing={
                    <ArrowSquareOut aria-hidden size={14} weight="bold" />
                  }
                >
                  Verify
                </Link>
              ) : null}
            </span>
          </DetailRow>
        </>
      ) : null}
      <DetailRow label="Vault Storage ID">{asset.vaultId}</DetailRow>
      <DetailRow label="Location">{asset.location}</DetailRow>
      <DetailRow label="Condition">{conditionDisplay}</DetailRow>

      {retrievable && onRequestRetrieval ? (
        <div className="pt-2">
          <Link
            href="#"
            size="sm"
            variant="secondary"
            onClick={(event) => {
              event.preventDefault();
              onRequestRetrieval();
            }}
          >
            Request Retrieval
          </Link>
        </div>
      ) : null}
    </VStack>
  );
}

export type { VaultAssetDetailsProps };
export { VaultAssetDetails };
