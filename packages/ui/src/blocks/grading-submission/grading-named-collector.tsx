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
import { useState } from "react";
import { formatGradingDay, type GradingLocaleProps } from "./grading-copy";

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

type GradingNamedCollectorProps = GradingLocaleProps & {
  copy: GradingNamedCollectorCopy;
  /** The one person named, with the day they were named. */
  named?: { name: string; namedAt: number };
  pending?: boolean;
  /** The refusal the shop gave, in its words. */
  error?: string;
  onSave: (name: string) => void;
  onChange: () => void;
  onRemove: () => void;
  className?: string;
};

/**
 * Nobody named, or one person with the day they were named. An empty name
 * reports no save, and no save is offered while the card reads as pending.
 */
function GradingNamedCollector({
  copy,
  named,
  pending = false,
  error,
  onSave,
  onChange,
  onRemove,
  locale = "en",
  timeZone,
  className,
}: GradingNamedCollectorProps) {
  // Transient field state: what the collector has typed is not product state
  // until it is saved, and `onSave` carries it out.
  const [name, setName] = useState("");

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
              <Button onClick={onChange} size="sm" variant="secondary">
                {copy.change}
              </Button>
              <Button onClick={onRemove} size="sm" variant="ghost">
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
              onChange={(event) => setName(event.target.value)}
              placeholder={copy.namePlaceholder}
              status={error ? "error" : "default"}
              value={name}
            />
            <Button
              data-slot="grading-named-collector-save"
              disabled={pending || name.trim().length === 0}
              loading={pending}
              onClick={() => {
                const trimmed = name.trim();
                if (trimmed.length === 0) return;
                onSave(trimmed);
              }}
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
