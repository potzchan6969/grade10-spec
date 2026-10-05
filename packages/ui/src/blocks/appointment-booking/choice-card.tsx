import { Text } from "@grade10/design-system/components/display/text";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import { Check } from "@phosphor-icons/react";
import type { ReactNode } from "react";

type ChoiceCardProps = {
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  selected: boolean;
  onSelect: () => void;
  slot: string;
};

/** A tile that is one choice among several. Internal. */
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
        "relative h-full w-full rounded-2xl border bg-card p-4 text-left transition-colors hover:border-border-strong focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
        selected ? "border-primary bg-muted/30" : "border-border",
      )}
      data-slot={slot}
      onClick={onSelect}
      type="button"
    >
      {selected ? (
        <span className="absolute top-3 right-3 text-primary">
          <Check aria-hidden size={20} />
        </span>
      ) : null}
      <VStack className="pr-7" gap="xs" hAlign="stretch">
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
