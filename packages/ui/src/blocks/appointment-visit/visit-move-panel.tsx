import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import {
  BookingSlotPicker,
  type BookingSlotPickerProps,
} from "../appointment-booking/booking-slot-picker";
import { FactCard } from "../page-blocks/fact-card";

type VisitMovePanelCopy = {
  title: string;
  /** The visit and its time now. */
  description: string;
  /** The confirm button: the new time once picked, or the ask to pick one. */
  confirm: string;
  moving: string;
  /** Keep the visit's own time. */
  keep: string;
  /** What stays and who hears of it. */
  consequence: string;
};

type VisitMovePanelProps = {
  copy: VisitMovePanelCopy;
  /** The calendar of free times at the visit's own shop. */
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
 * Change time: only the free times at the visit's own shop, the code kept,
 * the new time mailed. The visit's own time is never offered back to it —
 * keeping it is the panel's other button.
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
    <FactCard
      actions={
        <HStack gap="sm" wrap>
          <Button
            disabled={!picked || pending}
            loading={pending}
            onClick={onConfirm}
            size="md"
            type="button"
          >
            {pending ? copy.moving : copy.confirm}
          </Button>
          <Button onClick={onClose} size="md" type="button" variant="outline">
            {copy.keep}
          </Button>
        </HStack>
      }
      copy={{ title: copy.title, description: copy.description }}
      slot="visit-move"
    >
      <BookingSlotPicker {...slotPicker} />
      <Text as="p" size="sm" tone="secondary">
        {copy.consequence}
      </Text>
      {error ? (
        <Text as="p" role="alert" size="sm" tone="error">
          {error}
        </Text>
      ) : null}
    </FactCard>
  );
}

export type { VisitMovePanelCopy, VisitMovePanelProps };
export { VisitMovePanel };
