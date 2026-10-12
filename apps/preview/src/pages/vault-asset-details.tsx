import { Text } from "@grade10/design-system/components/display/text";
import { Link } from "@grade10/design-system/components/forms/link";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { ArrowSquareOut } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import type { VaultAsset } from "./vault-content";

type VaultAssetDetailsProps = {
  asset: VaultAsset;
  verifyHref?: string;
  onRequestRetrieval?: () => void;
  className?: string;
};

type DetailRowProps = {
  label: string;
  value: ReactNode;
  action?: ReactNode;
};

function DetailRow({ label, value, action }: DetailRowProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-1 border-b border-border py-2 sm:flex-row sm:items-baseline sm:gap-6">
      <Text className="shrink-0 text-secondary-foreground sm:w-40" size="sm">
        {label}
      </Text>
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 sm:justify-end">
        <Text
          className="text-sm font-normal tabular-nums break-words"
          size="sm"
        >
          {value}
        </Text>
        {action}
      </div>
    </div>
  );
}

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
          <DetailRow label="Grade" value={asset.grade} />
          <DetailRow
            label="Cert Number"
            value={asset.cert}
            action={
              verifyHref ? (
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
              ) : undefined
            }
          />
        </>
      ) : null}
      <DetailRow label="Vault Storage ID" value={asset.vaultId} />
      <DetailRow label="Location" value={asset.location} />
      <DetailRow label="Condition" value={conditionDisplay} />

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
