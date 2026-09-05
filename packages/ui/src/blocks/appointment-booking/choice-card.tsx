import { Text } from "@grade10/design-system/components/display/text";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";

type ChoiceCardProps = {
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  selected: boolean;
  onSelect: () => void;
  slot: string;
};

/** A card that is one choice among several. Internal — both pickers draw it. */
function ChoiceCard({
  title,
  description,
  meta,
  selected,
  onSelect,
  slot,
}: ChoiceCardProps) {
  return (
    <button
      aria-pressed={selected}
      className={cn(
        "w-full rounded-2xl border bg-card p-4 text-left transition-colors hover:border-border-strong focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
        selected ? "border-primary" : "border-border",
      )}
      data-slot={slot}
      onClick={onSelect}
      type="button"
    >
      <VStack gap="xs" hAlign="stretch">
        <Text as="span" weight="medium">
          {title}
        </Text>
        {description ? (
          <Text as="span" size="sm" tone="secondary">
            {description}
          </Text>
        ) : null}
        {meta ? (
          <Text as="span" size="xs" tone="muted">
            {meta}
          </Text>
        ) : null}
      </VStack>
    </button>
  );
}

export { ChoiceCard };
