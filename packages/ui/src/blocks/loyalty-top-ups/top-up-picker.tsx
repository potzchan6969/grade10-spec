import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { RadioList } from "@grade10/design-system/components/forms/radio-list";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogSubtext,
  DialogTitle,
} from "@grade10/design-system/components/overlays/dialog";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@grade10/design-system/components/overlays/drawer";
import { cn } from "@grade10/design-system/lib/utils";
import { ArrowRight, ShieldCheck } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { TopUpPackCard } from "./top-up-pack-card";
import { useSmUp } from "./use-sm-up";

type TopUpPickerCopy = {
  title: string;
  subtitle: string;
  /** The radio group's name — "Choose a pack". */
  packsLegend: string;
  /** The unit after a bonus — "pt". */
  unit: string;
  /** Over the balance before a pack is picked — "Balance". */
  balance: string;
  /** Over the balance once one is — "Balance after top-up". */
  balanceAfter: string;
  /** Read between the two balances by a screen reader — "to". */
  balanceTo: string;
  /** The button before a pack is picked — "Pay Now". */
  continue: string;
  /** The button while checkout opens — "Redirecting…". */
  opening: string;
  /** The note beside the button — "Secured by Stripe". */
  secured: string;
};

/** One pack on sale, already in the member's words. */
type TopUpPickerPack = {
  id: string;
  /** The points the pack credits — "5,000". */
  pointsLabel: string;
  /** What the member pays — "HK$4,850". */
  priceLabel: string;
  /** The same money read as points, on a discounted pack — "4,850". */
  paidPointsLabel?: string;
  /** The extra points over what is paid, on a discounted pack — "150". */
  bonusLabel?: string;
  /** Why the pack cannot be picked — "Over today’s limit". Absent, it can. */
  unavailable?: string;
  /** The button once this pack is picked — "Pay HK$4,850". */
  payLabel: string;
  /** Where the balance lands once it is credited — "6,200 pt". */
  balanceAfterLabel: string;
};

type TopUpPickerProps = {
  copy: TopUpPickerCopy;
  packs: readonly TopUpPickerPack[];
  /** The member's balance, read beside the button until a pack is picked — "1,200 pt". */
  balanceLabel: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Checkout is opening — the button shows the wait and refuses repeats. */
  busy?: boolean;
  onPay: (packId: string) => void;
  defaultPackId?: string | null;
};

/**
 * The pack picker (Figma `7530:6163` large, `7536:2248` small): a dialog from
 * 640px up, a bottom drawer below. The member picks a pack and continues to
 * checkout; the host owns what `onPay` does. Reopening restarts the pick.
 */
function TopUpPicker({
  copy,
  packs,
  balanceLabel,
  open,
  onOpenChange,
  busy = false,
  onPay,
  defaultPackId,
}: TopUpPickerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(
    defaultPackId ?? null,
  );
  const smUp = useSmUp();

  useEffect(() => {
    if (open) setSelectedId(defaultPackId ?? null);
  }, [open, defaultPackId]);

  const selectedPack =
    packs.find((pack) => pack.id === selectedId && !pack.unavailable) ?? null;

  const body = (
    <RadioList
      aria-label={copy.packsLegend}
      className={cn(
        "[&_[data-slot=radio-list-label]]:sr-only",
        smUp &&
          "[&_[data-slot=radio-list-items]]:grid [&_[data-slot=radio-list-items]]:grid-cols-3 [&_[data-slot=radio-list-items]]:items-stretch",
      )}
      label={copy.packsLegend}
      onValueChange={(value) => setSelectedId(String(value))}
      value={selectedPack?.id ?? ""}
    >
      {packs.map((pack) => (
        <TopUpPackCard
          bonusLabel={pack.bonusLabel}
          copy={{ unit: copy.unit, unavailable: pack.unavailable }}
          disabled={Boolean(pack.unavailable)}
          key={pack.id}
          paidPointsLabel={pack.paidPointsLabel}
          pointsLabel={pack.pointsLabel}
          priceLabel={pack.priceLabel}
          value={pack.id}
          viewport={smUp ? "large" : "small"}
        />
      ))}
    </RadioList>
  );

  const payButton = (
    <Button
      className={smUp ? undefined : "w-full"}
      data-slot="top-up-pay"
      disabled={!selectedPack}
      loading={busy}
      onClick={() => {
        if (selectedPack && !busy) onPay(selectedPack.id);
      }}
      size="md"
    >
      {busy
        ? copy.opening
        : selectedPack
          ? selectedPack.payLabel
          : copy.continue}
    </Button>
  );

  const secureNote = (
    <Text
      as="p"
      className={cn("flex items-center gap-1", !smUp && "justify-center")}
      size="xs"
      tone="secondary"
    >
      <ShieldCheck aria-hidden size={12} />
      {copy.secured}
    </Text>
  );

  return smUp ? (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-136">
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogSubtext>{copy.subtitle}</DialogSubtext>
        </DialogHeader>
        <DialogBody className="gap-4">{body}</DialogBody>
        <DialogFooter className="sm:justify-between">
          <VStack data-slot="top-up-balance" gap="none">
            <Text as="span" size="xs" tone="secondary">
              {selectedPack ? copy.balanceAfter : copy.balance}
            </Text>
            <span className="flex items-center gap-1 text-sm font-medium text-foreground">
              <span className="tabular-nums">{balanceLabel}</span>
              {selectedPack ? (
                <>
                  <ArrowRight aria-hidden size={14} />
                  <span className="sr-only">{copy.balanceTo}</span>
                  <span className="tabular-nums">
                    {selectedPack.balanceAfterLabel}
                  </span>
                </>
              ) : null}
            </span>
          </VStack>
          <div className="ml-auto flex items-center gap-2">
            {secureNote}
            {payButton}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer onOpenChange={onOpenChange} open={open} swipeDirection="down">
      <DrawerContent className="bg-popover backdrop-blur-none [--drawer-bleed-background:var(--popover)]">
        <DrawerHeader>
          <DrawerTitle className="text-lg leading-7">{copy.title}</DrawerTitle>
          <DrawerDescription>{copy.subtitle}</DrawerDescription>
        </DrawerHeader>
        <DrawerBody className="gap-4">{body}</DrawerBody>
        <DrawerFooter>
          {payButton}
          {secureNote}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export {
  TopUpPicker,
  type TopUpPickerCopy,
  type TopUpPickerPack,
  type TopUpPickerProps,
};
