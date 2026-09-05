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
  /** Says the member's standing could not be read, and what is drawn is stale. */
  unreachable: string;
};

/**
 * The offer to carry the card in one wallet.
 *
 * A label and its address are one fact rather than two optional fields: an
 * address with no label renders a link nothing can name, which a screen reader
 * announces as an empty anchor. The address arrives only once the consumer has
 * minted a pass, so before that this is a button and after it a link.
 */
type WalletPassOffer = {
  /** The whole label. Never a word this block joins to a wallet's name. */
  label: string;
  /** Where the member goes to install it, once there is something to install. */
  saveUrl?: string;
};

/**
 * One wallet, as the consumer names it and as the member stands with it.
 *
 * A row rather than a status, because a member can carry a pass in one wallet
 * while adding one in the other, and can be offered a third they hold nothing
 * in. A single status for the whole block cannot say that, and what it does
 * instead is contradict itself — spinning every button for one mint, hiding
 * every offer because one wallet is held, or wiping one wallet's complaint
 * when another wallet succeeds.
 *
 * Every label is a whole label: a language that puts its verb last cannot be
 * assembled from two fragments in the order English wants them.
 */
type WalletPassWallet = {
  /**
   * The consumer's own name for this wallet. Never shown and never parsed —
   * it comes back on the callbacks, so an action is answered by identity
   * rather than by a display name a translation moves.
   */
  id: string;
  /** The offer to add it here. Absent where it is no longer offered. */
  offer?: WalletPassOffer;
  /** This wallet's mint is in flight. Only this wallet's control waits. */
  adding?: boolean;
  /** The whole sentence saying the member carries a pass here. */
  heldLabel?: string;
  /** The whole label of the control that ends this one. */
  endLabel?: string;
  /** This wallet's ending is in flight. */
  ending?: boolean;
  /** What did not complete for this wallet, in words the member reads. */
  failedLabel?: string;
};

/**
 * Whether the member's standing has been read, and whether it is current.
 * Nothing per-wallet lives here.
 */
type WalletPassState =
  | { status: "unknown" }
  | { status: "read"; unreachable?: boolean };

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

/** Whether this wallet has anything for the member to act on or read. */
function drawable(wallet: WalletPassWallet): boolean {
  return Boolean(wallet.offer || wallet.heldLabel || wallet.failedLabel);
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
  if (drawn.length === 0 && !state.unreachable) return null;

  const offers = drawn.filter((wallet) => wallet.offer);

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
          {/* Announced, because a successful mint replaces the button with a
              link and a member who cannot see that swap has no other signal
              that their tap did anything. */}
          <HStack align="center" aria-live="polite" gap="sm" wrap>
            {offers.map((wallet) =>
              wallet.offer?.saveUrl ? (
                <Link
                  data-slot="wallet-pass-save"
                  data-wallet={wallet.id}
                  href={wallet.offer.saveUrl}
                  key={wallet.id}
                  size="sm"
                >
                  {wallet.offer.label}
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
                  {wallet.offer?.label}
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
      {drawn
        .filter((wallet) => wallet.failedLabel)
        .map((wallet) => (
          <Text
            data-slot="wallet-pass-failed"
            data-wallet={wallet.id}
            key={wallet.id}
            role="alert"
            size="sm"
            tone="error"
          >
            {wallet.failedLabel}
          </Text>
        ))}
      {state.unreachable ? (
        <Text
          data-slot="wallet-pass-unreachable"
          role="alert"
          size="sm"
          tone="error"
        >
          {copy.unreachable}
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
  WalletPassWallet,
};
export { WalletPassLinks };
