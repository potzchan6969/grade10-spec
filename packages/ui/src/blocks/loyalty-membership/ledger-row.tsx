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
  const abs = Math.abs(delta).toLocaleString("en-HK");
  return delta > 0 ? `+${abs}` : `−${abs}`;
}

/**
 * One ledger line — the icon tile, the member-readable name over its date
 * and context, and the signed delta with its unit. Internal to the ledger
 * blocks. A pending entry draws an hourglass on the brand tint and its
 * delta in the brand colour; the date is the day the points landed, so a
 * pending row carries none.
 */
function LedgerRow({
  entry,
  points = "pts",
}: {
  entry: LedgerEntry;
  /** The unit after the delta — "pts". */
  points?: string;
}) {
  const Icon = entry.pending
    ? HourglassHigh
    : entry.icon
      ? ICONS[entry.icon]
      : null;
  const detail = [entry.channel, entry.context].filter(Boolean).join(" · ");
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
            "grid size-10 shrink-0 place-items-center rounded-full",
            entry.pending
              ? "bg-primary-muted text-primary"
              : "bg-muted text-foreground",
          )}
        >
          <Icon size={16} />
        </span>
      ) : null}
      <VStack className="min-w-0 flex-1" gap="none">
        <Text weight="medium">{entry.kind}</Text>
        {entry.date || detail ? (
          <Text size="sm" tone="secondary">
            {entry.date}
            {detail ? (
              <>
                {entry.date ? ". " : ""}
                {entry.channel ? (
                  <span data-slot="point-history-channel">{entry.channel}</span>
                ) : null}
                {entry.channel && entry.context ? " · " : ""}
                {entry.context ? (
                  <span data-slot="point-history-context">{entry.context}</span>
                ) : null}
              </>
            ) : null}
          </Text>
        ) : null}
      </VStack>
      <Text
        className={cn(
          "shrink-0 whitespace-nowrap",
          entry.pending && "text-primary",
        )}
        data-slot="point-history-delta"
        tone={
          entry.pending ? undefined : entry.delta > 0 ? "success" : "primary"
        }
        weight="medium"
      >
        {signed(entry.delta)} {points}
      </Text>
    </HStack>
  );
}

export { LedgerRow, signed };
