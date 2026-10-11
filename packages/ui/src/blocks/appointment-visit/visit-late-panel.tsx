import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { RadioList } from "@grade10/design-system/components/forms/radio-list";
import { RadioListItem } from "@grade10/design-system/components/forms/radio-list-item";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { FactCard } from "../page-blocks/fact-card";
import type { VisitLateChoice } from "./types";

type VisitLatePanelCopy = {
  title: string;
  /** Who hears of it and until when the time is held. */
  description: string;
  legend: string;
  /** The send button, naming the pick. */
  send: string;
  sending: string;
  close: string;
};

type VisitLatePanelProps = {
  copy: VisitLatePanelCopy;
  choices: readonly VisitLateChoice[];
  /** The minutes picked, or none. */
  value: number | null;
  /** The note is on its way. */
  pending: boolean;
  error?: string | null;
  onValueChange: (minutes: number) => void;
  onSend: () => void;
  onClose: () => void;
};

/**
 * Running late: about when the collector will arrive, each pick saying
 * whether the counter is still held then. The desk sees the new time; the
 * hold itself does not move.
 */
function VisitLatePanel({
  copy,
  choices,
  value,
  pending,
  error,
  onValueChange,
  onSend,
  onClose,
}: VisitLatePanelProps) {
  const picked = choices.some((one) => one.minutes === value);
  return (
    <FactCard
      actions={
        <HStack gap="sm" wrap>
          <Button
            disabled={!picked || pending}
            loading={pending}
            onClick={onSend}
            size="md"
            type="button"
          >
            {pending ? copy.sending : copy.send}
          </Button>
          <Button onClick={onClose} size="md" type="button" variant="outline">
            {copy.close}
          </Button>
        </HStack>
      }
      copy={{ title: copy.title, description: copy.description }}
      slot="visit-late"
    >
      <VStack gap="md" hAlign="stretch">
        <RadioList
          label={copy.legend}
          onValueChange={(next) => onValueChange(Number(next))}
          value={value === null ? "" : String(value)}
        >
          {choices.map((choice) => (
            <RadioListItem key={choice.minutes} value={String(choice.minutes)}>
              <VStack gap="none">
                <Text as="span" weight="medium">
                  {choice.label}
                </Text>
                <Text as="span" size="sm" tone="secondary">
                  {choice.detail}
                </Text>
              </VStack>
            </RadioListItem>
          ))}
        </RadioList>
        {error ? (
          <Text as="p" role="alert" size="sm" tone="error">
            {error}
          </Text>
        ) : null}
      </VStack>
    </FactCard>
  );
}

export type { VisitLatePanelCopy, VisitLatePanelProps };
export { VisitLatePanel };
