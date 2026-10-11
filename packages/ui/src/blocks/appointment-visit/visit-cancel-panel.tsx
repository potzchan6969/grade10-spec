import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { RadioList } from "@grade10/design-system/components/forms/radio-list";
import { RadioListItem } from "@grade10/design-system/components/forms/radio-list-item";
import { TextInput } from "@grade10/design-system/components/forms/text-input";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { FactCard } from "../page-blocks/fact-card";
import { NoteList } from "../page-blocks/note-list";
import type { VisitCancelReason } from "./types";

const REASONS = [
  "cant",
  "wrong",
  "walk",
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
};

type VisitCancelPanelProps = {
  copy: VisitCancelPanelCopy;
  reason: VisitCancelReason | null;
  /** The collector's own words, asked only for Something else. */
  more: string;
  /** The cancel is under way. */
  pending: boolean;
  error?: string | null;
  onReasonChange: (reason: VisitCancelReason) => void;
  onMoreChange: (more: string) => void;
  onConfirm: () => void;
  onClose: () => void;
};

/**
 * Cancel: what frees up and who hears of it, and a reason the collector may
 * skip. The reason reaches the desk in the collector's own words.
 */
function VisitCancelPanel({
  copy,
  reason,
  more,
  pending,
  error,
  onReasonChange,
  onMoreChange,
  onConfirm,
  onClose,
}: VisitCancelPanelProps) {
  return (
    <FactCard
      actions={
        <HStack gap="sm" wrap>
          <Button onClick={onClose} size="md" type="button" variant="outline">
            {copy.keep}
          </Button>
          <Button
            disabled={pending}
            loading={pending}
            onClick={onConfirm}
            size="md"
            type="button"
            variant="destructive"
          >
            {pending ? copy.cancelling : copy.cancel}
          </Button>
        </HStack>
      }
      copy={{ title: copy.title, description: copy.description }}
      slot="visit-cancel"
    >
      <VStack gap="md" hAlign="stretch">
        <NoteList
          notes={[
            { id: "free", content: copy.free },
            { id: "mail", content: copy.mail },
          ]}
        />
        <RadioList
          label={copy.why}
          onValueChange={(value) => onReasonChange(value as VisitCancelReason)}
          value={reason ?? ""}
        >
          {REASONS.map((one) => (
            <RadioListItem key={one} value={one}>
              {copy.reasons[one]}
            </RadioListItem>
          ))}
        </RadioList>
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
      </VStack>
    </FactCard>
  );
}

export type { VisitCancelPanelCopy, VisitCancelPanelProps };
export { VisitCancelPanel };
