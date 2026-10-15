import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { RadioCard } from "@grade10/design-system/components/forms/radio-card";
import { RadioList } from "@grade10/design-system/components/forms/radio-list";
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
import type { VisitLateChoice } from "./types";

type VisitLatePanelCopy = {
  title: string;
  /** Who hears of it and until when the time is held. */
  description: string;
  /** The picks' group name, read out only. */
  legend: string;
  /** The send button, naming the pick. */
  send: string;
  sending: string;
  /** The sheet's close button. */
  close: string;
};

/** Already outside: tell the desk the collector has arrived. */
type VisitLateHereCopy = {
  title: string;
  label: string;
  hint: string;
};

type VisitLatePanelProps = {
  copy: VisitLatePanelCopy;
  choices: readonly VisitLateChoice[];
  /** The minutes picked, or none. */
  value: number | null;
  /** The note is on its way. */
  pending: boolean;
  error?: string | null;
  /** Already outside, drawn under the picks when the consumer offers it. */
  here?: { copy: VisitLateHereCopy; pending?: boolean; onHere: () => void };
  onValueChange: (minutes: number) => void;
  onSend: () => void;
  onClose: () => void;
};

/**
 * Running late, as a sheet: about when the collector will arrive, each pick
 * saying whether the counter is still held then. The desk sees the new time;
 * the hold itself does not move. A collector already outside may tell the
 * desk so instead.
 */
function VisitLatePanel({
  copy,
  choices,
  value,
  pending,
  error,
  here,
  onValueChange,
  onSend,
  onClose,
}: VisitLatePanelProps) {
  const picked = choices.some((one) => one.minutes === value);
  return (
    <Drawer
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      open
      showSwipeHandle
      swipeDirection="down"
    >
      <DrawerContent data-sheet="visit-late">
        <DrawerHeader closeLabel={copy.close}>
          <DrawerTitle>{copy.title}</DrawerTitle>
          <DrawerDescription>{copy.description}</DrawerDescription>
        </DrawerHeader>
        <DrawerBody data-slot="visit-late">
          <RadioList
            aria-label={copy.legend}
            onValueChange={(next) => onValueChange(Number(next))}
            value={value === null ? "" : String(value)}
          >
            {choices.map((choice) => (
              <RadioCard
                description={choice.detail}
                key={choice.minutes}
                title={choice.label}
                value={String(choice.minutes)}
              />
            ))}
          </RadioList>
          {error ? (
            <Text as="p" role="alert" size="sm" tone="error">
              {error}
            </Text>
          ) : null}
          {here ? (
            <div
              className="flex flex-col gap-2 border-t border-border pt-4"
              data-slot="visit-late-here"
            >
              <span className="text-[15px] leading-5 font-bold">
                {here.copy.title}
              </span>
              <Button
                className="h-11 w-full border-border-strong text-[15px] font-semibold"
                loading={here.pending}
                onClick={here.onHere}
                size="md"
                type="button"
                variant="outline"
              >
                {here.copy.label}
              </Button>
              <span className={cn("text-[13px] leading-[18px]", INK_2)}>
                {here.copy.hint}
              </span>
            </div>
          ) : null}
        </DrawerBody>
        <DrawerFooter>
          <Button
            className="h-11 w-full text-[15px] font-semibold"
            disabled={!picked}
            loading={pending}
            onClick={onSend}
            size="md"
            type="button"
          >
            {pending ? copy.sending : copy.send}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export type { VisitLateHereCopy, VisitLatePanelCopy, VisitLatePanelProps };
export { VisitLatePanel };
