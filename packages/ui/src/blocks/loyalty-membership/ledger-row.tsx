import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import {
  ClockAfternoon,
  CoinVertical,
  Gift,
  HandCoins,
  HourglassHigh,
  ShoppingBag,
  Sparkle,
} from "@phosphor-icons/react";
import type { ComponentType } from "react";
import type { LedgerEntry, LedgerIcon } from "./types";

const ICONS: Record<
  LedgerIcon,
  ComponentType<{ className?: string; size?: number }>
> = {
  order: ShoppingBag,
  reward: Gift,
  topup: CoinVertical,
  credits: HandCoins,
  adjustment: Sparkle,
  expiry: ClockAfternoon,
};

function signed(delta: number) {
  return delta > 0 ? `+${delta}` : `${delta}`;
}

/**
 * One ledger line — the icon tile, the member-readable name over its date,
 * channel and context, and the signed delta. Internal to the ledger blocks.
 * A pending entry draws an hourglass on the brand tint and its delta in the
 * brand colour; the date is the day the points landed, so a pending row
 * carries none.
 */
function LedgerRow({ entry }: { entry: LedgerEntry }) {
  const Icon = entry.pending
    ? HourglassHigh
    : entry.icon
      ? ICONS[entry.icon]
      : null;
  return (
    <HStack
      align="center"
      className="w-full"
      data-slot="point-history-item"
      gap="md"
    >
      {Icon ? (
        <span
          aria-hidden
          data-slot="point-history-icon"
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-full",
            entry.pending
              ? "bg-primary-muted text-primary"
              : "bg-muted text-muted-foreground",
          )}
        >
          <Icon size={18} />
        </span>
      ) : null}
      <VStack className="min-w-0 flex-1" gap="xs">
        <Text weight="medium">{entry.kind}</Text>
        {entry.date || entry.channel || entry.context ? (
          <Text size="sm" tone="secondary">
            {entry.date}
            {entry.channel ? (
              <>
                {entry.date ? " · " : ""}
                <span data-slot="point-history-channel">{entry.channel}</span>
              </>
            ) : null}
            {entry.context ? (
              <>
                {entry.date || entry.channel ? " · " : ""}
                <span data-slot="point-history-context">{entry.context}</span>
              </>
            ) : null}
          </Text>
        ) : null}
      </VStack>
      <Text
        className={cn("shrink-0", entry.pending && "text-primary")}
        data-slot="point-history-delta"
        tone={entry.pending ? undefined : entry.delta > 0 ? "success" : "primary"}
        weight="medium"
      >
        {signed(entry.delta)}
      </Text>
    </HStack>
  );
}

export { LedgerRow, signed };
