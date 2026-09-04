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
  /** Says an add or an ending did not complete, and that trying again is fine. */
  failed: string;
};

/**
 * One wallet, as the consumer names it and as the member stands with it.
 *
 * A row rather than a status, because a member can carry a pass in one wallet
 * while adding one in the other, and can be offered a third they hold nothing
 * in. A single status for the whole block cannot say that, and what it does
 * instead is contradict itself — spinning every button for one mint, or hiding
 * every offer because one wallet is held.
 *
 * Every label is a whole label rather than a word this block joins to a
 * wallet's name: a language that puts its verb last cannot be assembled from
 * two fragments in the order English wants them.
 */
type WalletPassWallet = {
  /**
   * The consumer's own name for this wallet. Never shown and never parsed —
   * it comes back on the callbacks, so an action is answered by identity
   * rather than by a display name a translation moves.
   */
  id: string;
  /** The add action's whole label. Absent where it is no longer offered. */
  addLabel?: string;
  /** Where the member goes to save it, once the consumer has minted one. */
  saveUrl?: string;
  /** This wallet's mint is in flight. Only this wallet's control waits. */
  adding?: boolean;
  /** The whole sentence saying the member carries a pass here. */
  heldLabel?: string;
  /** The whole label of the control that ends this one. */
  endLabel?: string;
  /** This wallet's ending is in flight. */
  ending?: boolean;
};

/**
 * Whether the member's standing has been read yet, and whether the last act
 * failed. Nothing per-wallet lives here.
 */
type WalletPassState =
  | { status: "unknown" }
  | { status: "read"; failed?: boolean };

type WalletPassLinksProps = {
  copy: WalletPassLinksCopy;
  /** The wallets to draw, in the order the consumer wants them. */
  wallets: readonly WalletPassWallet[];
  state: WalletPassState;
  /** Asks the consumer to mint a pass for this wallet. */
  onAdd: (id: string) => void;
  /** Asks the consumer to end this wallet's pass. */
  onEnd: (id: string) => void;
  className?: string;
};

/** Whether this wallet has anything for the member to act on. */
function drawable(wallet: WalletPassWallet): boolean {
  return Boolean(wallet.saveUrl || wallet.addLabel || wallet.heldLabel);
}

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
  wallets,
  state,
  onAdd,
  onEnd,
  className,
}: WalletPassLinksProps) {
  if (state.status === "unknown") return null;

  const drawn = wallets.filter(drawable);
  if (drawn.length === 0) return null;

  // A save address is the install, and a row existing is not a pass being
  // carried — so the link survives the member being recorded as holding one.
  // Held here rather than in each consumer's own filter, because a consumer
  // that got it wrong would hand somebody a card they cannot install.
  const offers = drawn.filter((wallet) => wallet.saveUrl || wallet.addLabel);

  return (
    <VStack
      className={cn("w-full", className)}
      data-slot="wallet-pass-links"
      gap="sm"
    >
      {offers.length > 0 ? (
        <>
          <Text size="sm" tone="secondary">
            {copy.heading}
          </Text>
          <HStack align="center" gap="sm" wrap>
            {offers.map((wallet) =>
              wallet.saveUrl ? (
                <Link
                  data-slot="wallet-pass-save"
                  data-wallet={wallet.id}
                  href={wallet.saveUrl}
                  key={wallet.id}
                  size="sm"
                >
                  {wallet.addLabel}
                </Link>
              ) : (
                <Button
                  data-slot="wallet-pass-add"
                  data-wallet={wallet.id}
                  key={wallet.id}
                  loading={wallet.adding ?? false}
                  onClick={() => onAdd(wallet.id)}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  {wallet.addLabel}
                </Button>
              ),
            )}
          </HStack>
        </>
      ) : null}
      {drawn
        .filter((wallet) => wallet.heldLabel)
        .map((wallet) => (
          <HStack
            align="center"
            gap="sm"
            justify="space-between"
            key={wallet.id}
          >
            <Text data-slot="wallet-pass-held" size="sm" tone="secondary">
              {wallet.heldLabel}
            </Text>
            {wallet.endLabel ? (
              <Button
                data-slot="wallet-pass-end"
                data-wallet={wallet.id}
                loading={wallet.ending ?? false}
                onClick={() => onEnd(wallet.id)}
                size="sm"
                type="button"
                variant="ghost"
              >
                {wallet.endLabel}
              </Button>
            ) : null}
          </HStack>
        ))}
      {state.failed ? (
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
  WalletPassState,
  WalletPassWallet,
};
export { WalletPassLinks };
