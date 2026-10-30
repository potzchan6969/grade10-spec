import { Text } from "@grade10/design-system/components/display/text";
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
import { CircleNotch } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { useSmUp } from "./use-sm-up";

type TopUpConfirmingCopy = {
  /** "Confirming your payment…" */
  title: string;
  /** "Please keep this page open." */
  description: string;
};

type TopUpConfirmingProps = {
  copy: TopUpConfirmingCopy;
  open: boolean;
};

const TITLE =
  "w-full text-center font-heading text-xl font-semibold tracking-tight text-balance";

/** Escape and outside presses never close the wait. */
const stay = () => undefined;

/**
 * The wait while checkout's payment is confirmed — a modal the member cannot
 * dismiss while it runs: a dialog from 640px up, a bottom drawer below, with
 * no close control. Every settled outcome leaves it and answers as a toast.
 */
function TopUpConfirming({ copy, open }: TopUpConfirmingProps) {
  const smUp = useSmUp();
  const panel = (title: ReactNode) => (
    <div aria-live="polite" data-slot="top-up-confirming" role="status">
      <VStack
        align="center"
        className="mx-auto w-full gap-1.5 py-2 text-center"
        gap="none"
      >
        <div className="mb-2.5 grid size-12 shrink-0 place-items-center rounded-full bg-muted">
          <span aria-hidden className="inline-flex animate-spin">
            <CircleNotch size={24} weight="regular" />
          </span>
        </div>
        {title}
        <Text className="text-balance text-secondary-foreground" size="sm">
          {copy.description}
        </Text>
      </VStack>
    </div>
  );

  return smUp ? (
    <Dialog disablePointerDismissal onOpenChange={stay} open={open}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogBody className="items-center">
          {panel(<DialogTitle className={TITLE}>{copy.title}</DialogTitle>)}
        </DialogBody>
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer onOpenChange={stay} open={open} swipeDirection="down">
      <DrawerContent className="bg-popover backdrop-blur-none [--drawer-bleed-background:var(--popover)]">
        <DrawerBody className="items-center">
          {panel(<DrawerTitle className={TITLE}>{copy.title}</DrawerTitle>)}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export { TopUpConfirming, type TopUpConfirmingCopy, type TopUpConfirmingProps };
