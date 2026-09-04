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
  /** Names the control that ends a pass the member already holds. */
  end: string;
  /** Says the member is already carrying one, naming the wallet. */
  held: string;
  /** Says an add or an ending did not complete, and that trying again is fine. */
  failed: string;
};

/**
 * One wallet a brand offers.
 *
 * `addLabel` is a whole sentence rather than a word this block joins to the
 * wallet's name: a language that puts its verb last cannot be assembled from
 * two fragments in the order English wants them.
 */
type WalletPassOffer = {
  /** Which wallet, as the consumer names it — never a vendor id. */
  wallet: string;
  /** The action's whole label, already worded. */
  addLabel: string;
  /** Where the member goes to save it, once the consumer has minted it. */
  saveUrl?: string;
};

/**
 * What the member is carrying, and what is happening to it.
 *
 * Explicit rather than inferred, so the consumer can render a mint in flight
 * and a refusal without a second control of its own beside this one.
 */
type WalletPassState =
  | { status: "unknown" }
  | { status: "none" }
  | { status: "adding" }
  | { status: "held"; wallet: string; ending?: boolean }
  | { status: "failed" };

type WalletPassLinksProps = {
  copy: WalletPassLinksCopy;
  /** The wallets to offer. Empty offers nothing. */
  offers: readonly WalletPassOffer[];
  state: WalletPassState;
  /** Asks the consumer to mint a pass for this wallet. */
  onAdd: (wallet: string) => void;
  /** Asks the consumer to end the pass. Nothing changes until it answers. */
  onEnd: () => void;
  className?: string;
};

/**
 * Adding the member card to a phone wallet, and ending a pass already held.
 *
 * Both halves live here, because the offer and what became of it are one
 * affordance: a consumer that kept the add button outside would have nowhere
 * to put the state where it is being minted.
 *
 * Neither is performed: an address is a credential the consumer mints, and the
 * pass is the programme's, so this block reports and never acts.
 */
function WalletPassLinks({
  copy,
  offers,
  state,
  onAdd,
  onEnd,
  className,
}: WalletPassLinksProps) {
  const holding = state.status === "held";
  // A brand offering nothing still owes a member who holds one the control
  // that ends it — the offer and the management are separate facts.
  if (offers.length === 0 && !holding) return null;
  if (state.status === "unknown") return null;

  return (
    <VStack
      className={cn("w-full", className)}
      data-slot="wallet-pass-links"
      gap="sm"
    >
      {offers.length > 0 && !holding ? (
        <>
          <Text size="sm" tone="secondary">
            {copy.heading}
          </Text>
          <HStack align="center" gap="sm" wrap>
            {offers.map((offer) =>
              offer.saveUrl ? (
                <Link
                  data-slot="wallet-pass-save"
                  data-wallet={offer.wallet}
                  href={offer.saveUrl}
                  key={offer.wallet}
                  size="sm"
                >
                  {offer.addLabel}
                </Link>
              ) : (
                <Button
                  data-slot="wallet-pass-add"
                  data-wallet={offer.wallet}
                  key={offer.wallet}
                  loading={state.status === "adding"}
                  onClick={() => onAdd(offer.wallet)}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  {offer.addLabel}
                </Button>
              ),
            )}
          </HStack>
        </>
      ) : null}
      {holding ? (
        <HStack align="center" gap="sm" justify="space-between">
          <Text data-slot="wallet-pass-held" size="sm" tone="secondary">
            {copy.held}
          </Text>
          <Button
            data-slot="wallet-pass-end"
            loading={state.ending ?? false}
            onClick={onEnd}
            size="sm"
            type="button"
            variant="ghost"
          >
            {copy.end}
          </Button>
        </HStack>
      ) : null}
      {state.status === "failed" ? (
        <Text data-slot="wallet-pass-failed" size="sm" tone="error">
          {copy.failed}
        </Text>
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
