import {
  Avatar,
  AvatarFallback,
} from "@grade10/design-system/components/display/avatar";
import { Badge } from "@grade10/design-system/components/display/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@grade10/design-system/components/display/card";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { TextInput } from "@grade10/design-system/components/forms/text-input";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { formatGradingDay, type GradingZonedProps } from "./grading-copy";

type GradingNamedCollectorCopy = {
  title: string;
  body: string;
  nameLabel: string;
  namePlaceholder: string;
  save: string;
  namedBadge: string;
  /** Leads the day the person was named. */
  namedAtLabel: string;
  /** One person at a time. */
  onePersonLine: string;
  change: string;
  remove: string;
};

type GradingNamedCollectorProps = GradingZonedProps & {
  copy: GradingNamedCollectorCopy;
  /** The one person named, with the day they were named. */
  named?: { name: string; namedAt: number };
  /** The name in the field, the consumer's to hold. */
  name: string;
  pending?: boolean;
  /** The refusal the shop gave, in its words. */
  error?: string;
  onNameChange: (name: string) => void;
  onSave: (name: string) => void;
  onChange: () => void;
  onRemove: () => void;
  className?: string;
};

/**
 * Nobody named, or one person with the day they were named. An empty name
 * reports no save, and no save is offered while the card reads as pending.
 * A refusal answers every act on the card, so beside one nothing is offered.
 *
 * The field is controlled: the name is the consumer's, so a Change prefills
 * the person already named and a refused save keeps what was typed.
 */
function GradingNamedCollector({
  copy,
  named,
  name,
  pending = false,
  error,
  onNameChange,
  onSave,
  onChange,
  onRemove,
  locale = "en",
  timeZone,
  className,
}: GradingNamedCollectorProps) {
  const refused = Boolean(error);
  const trimmed = name.trim();
  const saveOffered = !refused && !pending && trimmed.length > 0;

  return (
    <Card className={className} data-slot="grading-named-collector">
      <CardHeader>
        <CardTitle>{copy.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {named ? (
          <VStack
            data-slot="grading-named-collector-named"
            gap="sm"
            hAlign="stretch"
          >
            <HStack gap="sm" vAlign="center">
              <Avatar aria-hidden size="sm">
                <AvatarFallback>{named.name.slice(0, 1)}</AvatarFallback>
              </Avatar>
              <VStack gap="none" hAlign="stretch">
                <Text weight="medium">{named.name}</Text>
                <Text size="sm" tone="secondary">
                  {`${copy.namedAtLabel} ${formatGradingDay(named.namedAt, { locale, timeZone })}`}
                </Text>
              </VStack>
              <Badge variant="default">{copy.namedBadge}</Badge>
            </HStack>
            <Text size="sm" tone="secondary">
              {copy.onePersonLine}
            </Text>
            {error ? (
              <Text
                data-slot="grading-named-collector-error"
                size="sm"
                tone="error"
              >
                {error}
              </Text>
            ) : null}
            <HStack gap="sm" vAlign="center">
              <Button
                disabled={refused}
                onClick={onChange}
                size="sm"
                variant="secondary"
              >
                {copy.change}
              </Button>
              <Button
                disabled={refused}
                onClick={onRemove}
                size="sm"
                variant="ghost"
              >
                {copy.remove}
              </Button>
            </HStack>
          </VStack>
        ) : (
          <VStack gap="sm" hAlign="stretch">
            <Text size="sm" tone="secondary">
              {copy.body}
            </Text>
            <TextInput
              label={copy.nameLabel}
              message={error}
              onChange={(event) => onNameChange(event.target.value)}
              placeholder={copy.namePlaceholder}
              status={error ? "error" : "default"}
              value={name}
            />
            <Button
              data-slot="grading-named-collector-save"
              disabled={!saveOffered}
              loading={pending}
              onClick={() => onSave(trimmed)}
            >
              {copy.save}
            </Button>
          </VStack>
        )}
      </CardContent>
    </Card>
  );
}

export type { GradingNamedCollectorCopy, GradingNamedCollectorProps };
export { GradingNamedCollector };
