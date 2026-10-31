import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogTitle,
} from "@grade10/design-system/components/overlays/dialog";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerTitle,
} from "@grade10/design-system/components/overlays/drawer";
import { CircleNotch, Clock } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { useSmUp } from "../loyalty-top-ups/use-sm-up";

/** Where the wait stands: still inside its first minute, or past it. */
type TicketConfirmingDrawerStage = "waiting" | "safeToClose";

/** The words the wait says, in both its stages. */
type TicketConfirmingDrawerCopy = {
  waiting: {
    /** "Confirming your payment…" */
    title: string;
    /** "Please keep this page open." */
    description: string;
  };
  safeToClose: {
    /** "Still confirming your payment" */
    title: string;
    /** That the tickets follow by email, and the page may close. */
    description: string;
    /** "Reference TK7Q2M" */
    reference: string;
    /** "Close" */
    close: string;
  };
};

type TicketConfirmingDrawerProps = {
  copy: TicketConfirmingDrawerCopy;
  open: boolean;
  /** The consumer moves to `safeToClose` once a minute has passed. */
  stage: TicketConfirmingDrawerStage;
  /** Close, Escape or the scrim, once it is safe to close. */
  onClose: () => void;
};

const TITLE =
  "w-full text-center font-heading text-xl font-semibold tracking-tight text-balance whitespace-normal";

/**
 * The wait over the page the collector left while Stripe's payment is
 * confirmed: a bottom drawer on a phone, a dialog from 640px up, the top-up's
 * confirming look. While it waits nothing closes it; after a minute it says
 * the tickets follow by email, gives the reference, and may close.
 */
function TicketConfirmingDrawer({
  copy,
  open,
  stage,
  onClose,
}: TicketConfirmingDrawerProps) {
  const smUp = useSmUp();
  const safe = stage === "safeToClose";
  const words = safe ? copy.safeToClose : copy.waiting;
  const onOpenChange = (next: boolean) => {
    if (!next && safe) onClose();
  };
  const panel = (title: ReactNode) => (
    <VStack className="w-full gap-3" gap="none">
      <div aria-live="polite" data-slot="ticket-confirming" role="status">
        <VStack
          align="center"
          className="mx-auto w-full gap-1.5 py-2 text-center"
          gap="none"
        >
          <div className="mb-2.5 grid size-12 shrink-0 place-items-center rounded-full bg-muted">
            {safe ? (
              <Clock aria-hidden size={24} />
            ) : (
              <span aria-hidden className="inline-flex animate-spin">
                <CircleNotch size={24} weight="regular" />
              </span>
            )}
          </div>
          {title}
          <Text className="text-balance text-secondary-foreground" size="sm">
            {words.description}
          </Text>
        </VStack>
      </div>
      {safe ? (
        <>
          <Text
            className="text-center text-secondary-foreground"
            data-slot="ticket-confirming-reference"
            size="sm"
          >
            {copy.safeToClose.reference}
          </Text>
          <Button className="w-full" onClick={onClose} size="lg" type="button">
            {copy.safeToClose.close}
          </Button>
        </>
      ) : null}
    </VStack>
  );

  return smUp ? (
    <Dialog
      disablePointerDismissal={!safe}
      onOpenChange={onOpenChange}
      open={open}
    >
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogBody className="items-center">
          {panel(<DialogTitle className={TITLE}>{words.title}</DialogTitle>)}
        </DialogBody>
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer onOpenChange={onOpenChange} open={open} swipeDirection="down">
      <DrawerContent className="bg-popover backdrop-blur-none [--drawer-bleed-background:var(--popover)]">
        <DrawerBody className="items-center">
          {panel(<DrawerTitle className={TITLE}>{words.title}</DrawerTitle>)}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export type {
  TicketConfirmingDrawerCopy,
  TicketConfirmingDrawerProps,
  TicketConfirmingDrawerStage,
};
export { TicketConfirmingDrawer };
