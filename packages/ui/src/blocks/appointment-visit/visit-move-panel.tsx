import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { cn } from "@grade10/design-system/lib/utils";
import {
  BookingSlotPicker,
  type BookingSlotPickerProps,
} from "../appointment-booking/booking-slot-picker";
import { VisitSheet } from "./visit-sheet";
import { VISIT_INK_2 } from "./visit-tones";

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
    <VisitSheet
      copy={{
        title: copy.title,
        description: copy.description,
        close: copy.close,
      }}
      footer={
        <>
          <Button
            className={cn(
              "h-11 w-full text-[15px] font-semibold",
              !picked &&
                !pending &&
                cn("bg-muted opacity-100 disabled:opacity-100", VISIT_INK_2),
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
        </>
      }
      onClose={onClose}
      slot="visit-move"
    >
      <BookingSlotPicker layout="strip" {...slotPicker} />
      <p className={cn("m-0 text-sm leading-5", VISIT_INK_2)}>
        {copy.consequence}
      </p>
      {error ? (
        <Text as="p" role="alert" size="sm" tone="error">
          {error}
        </Text>
      ) : null}
    </VisitSheet>
  );
}

export type { VisitMovePanelCopy, VisitMovePanelProps };
export { VisitMovePanel };
