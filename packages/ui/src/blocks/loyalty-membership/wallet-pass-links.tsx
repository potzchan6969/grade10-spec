import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { Link } from "@grade10/design-system/components/forms/link";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";

/** The words the block says, whichever wallets a brand offers. */
type WalletPassLinksCopy = {
  /** Names what the actions beneath it are for. */
  heading: string;
  /** Read to anyone who cannot see the action's artwork. */
  addLabel: string;
  /** Names the control that ends a pass the member already holds. */
  end: string;
  /** Says the member is already carrying one. */
  held: string;
};

/**
 * One wallet a brand offers. The address is minted by the consumer and encoded
 * verbatim — this block never asks a wallet for anything.
 */
type WalletPassOffer = {
  /** Which wallet, as the consumer names it — never a vendor id. */
  wallet: string;
  /** Where the member goes to save it. Answered by the consumer, once. */
  saveUrl: string;
};

/** What the member is carrying, if anything. Exactly one holds at a time. */
type WalletPassState = { status: "none" } | { status: "held"; wallet: string };

type WalletPassLinksProps = {
  copy: WalletPassLinksCopy;
  /** The wallets to offer. Empty offers nothing and renders nothing. */
  offers: readonly WalletPassOffer[];
  state: WalletPassState;
  /** Asks the consumer to end the pass. Nothing changes until it answers. */
  onEnd: () => void;
  className?: string;
};

/**
 * Adding the member card to a phone wallet, and ending a pass already held.
 *
 * The address is a credential the consumer minted, so it arrives as a prop and
 * is never derived here; a brand offering no wallet passes an empty list and
 * this block renders nothing rather than an empty heading.
 *
 * Ending is reported, never performed: the pass is the programme's, and a
 * block that ended one would be holding product state.
 */
function WalletPassLinks({
  copy,
  offers,
  state,
  onEnd,
  className,
}: WalletPassLinksProps) {
  if (offers.length === 0) return null;

  return (
    <VStack
      className={cn("w-full", className)}
      data-slot="wallet-pass-links"
      gap="sm"
    >
      <Text size="sm" tone="secondary">
        {copy.heading}
      </Text>
      <HStack align="center" gap="sm" wrap>
        {offers.map((offer) => (
          <Link
            data-slot="wallet-pass-add"
            data-wallet={offer.wallet}
            href={offer.saveUrl}
            key={offer.wallet}
            size="sm"
          >
            {copy.addLabel} {offer.wallet}
          </Link>
        ))}
      </HStack>
      {state.status === "held" ? (
        <HStack align="center" gap="sm" justify="space-between">
          <Text data-slot="wallet-pass-held" size="sm" tone="secondary">
            {copy.held} {state.wallet}
          </Text>
          <Button
            data-slot="wallet-pass-end"
            onClick={onEnd}
            size="sm"
            type="button"
            variant="ghost"
          >
            {copy.end}
          </Button>
        </HStack>
      ) : null}
    </VStack>
  );
}

export type {
  WalletPassLinksCopy,
  WalletPassLinksProps,
  WalletPassOffer,
  WalletPassState,
};
export { WalletPassLinks };
