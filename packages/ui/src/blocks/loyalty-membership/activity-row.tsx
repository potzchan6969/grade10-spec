import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import {
  Clock,
  Gift,
  Hourglass,
  ShoppingCart,
  Sparkle,
} from "@phosphor-icons/react";
import type { ComponentType } from "react";
import type { ActivityEntry, ActivityIcon } from "./types";

const ICONS: Record<
  ActivityIcon,
  ComponentType<{ className?: string; size?: number }>
> = {
  order: ShoppingCart,
  reward: Gift,
  adjustment: Sparkle,
  expiry: Hourglass,
};

function signed(delta: number) {
  return delta > 0 ? `+${delta}` : `${delta}`;
}

/**
 * One ledger line — the icon tile, the member-readable name over its date,
 * channel and context, and the signed delta. Internal to the activity
 * blocks; `pendingBadge` is the tag a pending entry reads under its delta.
 */
function ActivityRow({
  entry,
  pendingBadge,
}: {
  entry: ActivityEntry;
  pendingBadge?: string;
}) {
  const Icon = entry.pending ? Clock : entry.icon ? ICONS[entry.icon] : null;
  return (
    <HStack
      align="center"
      className="w-full"
      data-slot="activity-list-item"
      gap="md"
    >
      {Icon ? (
        <span
          aria-hidden
          data-slot="activity-list-icon"
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-full",
            entry.pending
              ? "bg-warning-muted text-warning"
              : "bg-muted text-muted-foreground",
          )}
        >
          <Icon size={18} />
        </span>
      ) : null}
      <VStack className="min-w-0 flex-1" gap="xs">
        <Text weight="medium">{entry.kind}</Text>
        <Text size="sm" tone="secondary">
          {entry.date}
          {entry.channel ? (
            <>
              {" · "}
              <span data-slot="activity-list-channel">{entry.channel}</span>
            </>
          ) : null}
          {entry.context ? (
            <>
              {" · "}
              <span data-slot="activity-list-context">{entry.context}</span>
            </>
          ) : null}
        </Text>
      </VStack>
      <VStack align="end" className="shrink-0" gap="xs">
        <Text
          data-slot="activity-list-delta"
          tone={
            entry.pending ? "warning" : entry.delta > 0 ? "success" : "primary"
          }
          weight="medium"
        >
          {signed(entry.delta)}
        </Text>
        {pendingBadge ? (
          <Text size="sm" tone="secondary">
            {pendingBadge}
          </Text>
        ) : null}
      </VStack>
    </HStack>
  );
}

export { ActivityRow, signed };
