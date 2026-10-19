import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
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
import { INK_2 } from "../appointment-booking/booking-look";
import {
  BookingSlotPicker,
  type BookingSlotPickerProps,
} from "../appointment-booking/booking-slot-picker";

type VisitMovePanelCopy = {
  title: string;
  /** The visit and its time now. */
  description: string;
  /** The confirm button: the new time once picked, or the ask to pick one. */
  confirm: string;
  moving: string;
  /** Keep the visit's own time. */
  keep: string;
  /** Who hears of the new time. */
  consequence: string;
  /** The sheet's close button. */
  close: string;
};

type VisitMovePanelProps = {
  copy: VisitMovePanelCopy;
  /** The free times at the visit's own shop, as a strip of days over the
   * picked day's times. */
  slotPicker: BookingSlotPickerProps;
  /** A new time is picked. */
  picked: boolean;
  /** The move is under way. */
  pending: boolean;
  error?: string | null;
  onConfirm: () => void;
  onClose: () => void;
};

/**
 * Change time, as a sheet: only the free times at the visit's own shop, the
 * new time mailed. The visit's own time is never offered back to it —
 * keeping it is the sheet's other button.
 */
function VisitMovePanel({
  copy,
  slotPicker,
  picked,
  pending,
  error,
  onConfirm,
  onClose,
}: VisitMovePanelProps) {
  return (
    <Drawer
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      open
      showSwipeHandle
      swipeDirection="down"
    >
      <DrawerContent data-sheet="visit-move">
        <DrawerHeader closeLabel={copy.close}>
          <DrawerTitle>{copy.title}</DrawerTitle>
          <DrawerDescription>{copy.description}</DrawerDescription>
        </DrawerHeader>
        <DrawerBody data-slot="visit-move">
          <BookingSlotPicker layout="strip" {...slotPicker} />
          <p className={cn("m-0 text-sm leading-5", INK_2)}>
            {copy.consequence}
          </p>
          {error ? (
            <Text as="p" role="alert" size="sm" tone="error">
              {error}
            </Text>
          ) : null}
        </DrawerBody>
        <DrawerFooter>
          <Button
            className={cn(
              "h-11 w-full text-[15px] font-semibold",
              !picked &&
                !pending &&
                cn("bg-muted opacity-100 disabled:opacity-100", INK_2),
            )}
            disabled={!picked}
            loading={pending}
            onClick={onConfirm}
            size="md"
            type="button"
          >
            {pending ? copy.moving : copy.confirm}
          </Button>
          <Button
            className="h-11 w-full border-border-strong text-[15px] font-semibold"
            onClick={onClose}
            size="md"
            type="button"
            variant="outline"
          >
            {copy.keep}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export type { VisitMovePanelCopy, VisitMovePanelProps };
export { VisitMovePanel };
