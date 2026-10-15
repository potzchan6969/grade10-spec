import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { RadioList } from "@grade10/design-system/components/forms/radio-list";
import { RadioListItem } from "@grade10/design-system/components/forms/radio-list-item";
import { TextInput } from "@grade10/design-system/components/forms/text-input";
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
import { CalendarX, CreditCard, EnvelopeSimple } from "@phosphor-icons/react";
import { type ComponentType, type ReactNode, useId } from "react";
import { INK_2 } from "../appointment-booking/booking-look";
import type { VisitCancelReason } from "./types";
import { VISIT_TINT } from "./visit-tones";

const REASONS = [
  "cant",
  "wrong",
  "other",
] as const satisfies readonly VisitCancelReason[];

type VisitCancelPanelCopy = {
  title: string;
  /** What is being cancelled, when and where. */
  description: string;
  /** The time that opens for others. */
  free: string;
  /** Who hears of it. */
  mail: string;
  why: string;
  reasons: Readonly<Record<VisitCancelReason, string>>;
  more: string;
  keep: string;
  cancel: string;
  cancelling: string;
  /** The sheet's close button. */
  close: string;
};

/** What a paid visit's money does on cancel: back to the card, or kept. */
type VisitCancelRefund = {
  title: string;
  text: string;
  tone: "ok" | "warn";
};

type VisitCancelPanelProps = {
  copy: VisitCancelPanelCopy;
  reason: VisitCancelReason | null;
  /** The collector's own words, asked only for Something else. */
  more: string;
  /** A paid visit's refund line, drawn under who hears of it. */
  refund?: VisitCancelRefund;
  /** The cancel is under way. */
  pending: boolean;
  error?: string | null;
  onReasonChange: (reason: VisitCancelReason) => void;
  onMoreChange: (more: string) => void;
  onConfirm: () => void;
  onClose: () => void;
};

/**
 * Cancel, as a sheet: what frees up, who hears of it and, for a paid visit,
 * whether the money comes back, then a reason the collector may skip. The
 * reason reaches the desk in the collector's own words.
 */
function VisitCancelPanel({
  copy,
  reason,
  more,
  refund,
  pending,
  error,
  onReasonChange,
  onMoreChange,
  onConfirm,
  onClose,
}: VisitCancelPanelProps) {
  const whyId = useId();
  return (
    <Drawer
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      open
      showSwipeHandle
      swipeDirection="down"
    >
      <DrawerContent data-sheet="visit-cancel">
        <DrawerHeader closeLabel={copy.close}>
          <DrawerTitle>{copy.title}</DrawerTitle>
          <DrawerDescription>{copy.description}</DrawerDescription>
        </DrawerHeader>
        <DrawerBody data-slot="visit-cancel">
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0 text-sm leading-5">
            <Consequence icon={CalendarX}>{copy.free}</Consequence>
            <Consequence icon={EnvelopeSimple}>{copy.mail}</Consequence>
            {refund ? (
              <li
                className={cn(
                  "-mx-0.5 flex items-start gap-2.5 rounded-[10px] px-3 py-2.5",
                  VISIT_TINT[refund.tone],
                )}
                data-slot="visit-cancel-refund"
                data-tone={refund.tone}
              >
                <span
                  aria-hidden
                  className={cn("mt-0.5 inline-flex shrink-0", INK_2)}
                >
                  <CreditCard size={16} />
                </span>
                <span className="flex flex-col gap-0.5">
                  <strong className="font-bold">{refund.title}</strong>
                  <span>{refund.text}</span>
                </span>
              </li>
            ) : null}
          </ul>
          <div className="flex flex-col gap-2">
            <span className="text-[15px] leading-5 font-bold" id={whyId}>
              {copy.why}
            </span>
            <RadioList
              aria-labelledby={whyId}
              className="gap-1"
              onValueChange={(value) =>
                onReasonChange(value as VisitCancelReason)
              }
              value={reason ?? ""}
            >
              {REASONS.map((one) => (
                <RadioListItem
                  className="min-h-11 items-center gap-3 rounded-[10px] px-3 text-[15px] leading-5 has-[[data-checked]]:bg-muted"
                  key={one}
                  value={one}
                >
                  {copy.reasons[one]}
                </RadioListItem>
              ))}
            </RadioList>
          </div>
          {reason === "other" ? (
            <TextInput
              autoComplete="off"
              label={copy.more}
              onChange={(event) => onMoreChange(event.target.value)}
              value={more}
            />
          ) : null}
          {error ? (
            <Text as="p" role="alert" size="sm" tone="error">
              {error}
            </Text>
          ) : null}
        </DrawerBody>
        <DrawerFooter className="flex-row *:flex-1">
          <Button
            className="h-11 border-border-strong text-[15px] font-semibold"
            onClick={onClose}
            size="md"
            type="button"
            variant="outline"
          >
            {copy.keep}
          </Button>
          <Button
            className="h-11 text-[15px] font-semibold"
            loading={pending}
            onClick={onConfirm}
            size="md"
            type="button"
          >
            {pending ? copy.cancelling : copy.cancel}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function Consequence({
  icon: Icon,
  children,
}: {
  icon: ComponentType<{ size?: number }>;
  children: ReactNode;
}) {
  return (
    <li className="flex items-start gap-2.5">
      <span aria-hidden className={cn("mt-0.5 inline-flex shrink-0", INK_2)}>
        <Icon size={16} />
      </span>
      <span>{children}</span>
    </li>
  );
}

export type { VisitCancelPanelCopy, VisitCancelPanelProps, VisitCancelRefund };
export { VisitCancelPanel };
