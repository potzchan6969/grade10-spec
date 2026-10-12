import { Badge } from "@grade10/design-system/components/display/badge";
import { cn } from "@grade10/design-system/lib/utils";
import { statusBadgeVariant, type VaultAsset } from "./vault-content";

/**
 * Listing-state badge overlaid on the vault asset card image. Figma
 * `Vault Asset status` (`7068:9960`): Live Auction, Listed and Retrieval
 * Pending surface a brand badge; In Vault shows nothing — the card itself
 * is the state.
 */
function VaultAssetStatus({
  status,
  className,
}: {
  status: VaultAsset["status"];
  className?: string;
}) {
  if (status === "In Vault") return null;

  return (
    <Badge
      className={cn("absolute top-3 left-3", className)}
      size="sm"
      variant={statusBadgeVariant(status)}
    >
      {status}
    </Badge>
  );
}

export { VaultAssetStatus };
