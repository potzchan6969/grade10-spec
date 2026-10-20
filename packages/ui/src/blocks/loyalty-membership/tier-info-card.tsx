import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import { Check } from "@phosphor-icons/react";

type TierInfoCardProps = {
  /** The tier the card describes, as the consumer names it. */
  tier: string;
  /**
   * What reaching or holding the tier asks, in the consumer's words —
   * "500 pts / year", "By invitation only".
   */
  caption?: string;
  /** The tier's benefits, each drawn behind a check. */
  benefits: string[];
  /** Draws the held tier's highlight — the primary border and its shadow. */
  currentTier?: boolean;
  className?: string;
};

/**
 * One rung on the Tiers & Benefits ladder: the tier's name, what it asks to
 * reach or keep, and its benefits as a checked list. The card the member
 * holds wears the primary border and its tinted shadow; the rest sit plain.
 * Figma's set carries no description — the card is the tier row of the
 * Tiers & Benefits section, current rung highlighted (`7227:1069`).
 */
function TierInfoCard({
  tier,
  caption,
  benefits,
  currentTier = false,
  className,
}: TierInfoCardProps) {
  return (
    <VStack
      className={cn(
        "w-full max-w-(--container-xs) rounded-2xl border bg-card p-4",
        currentTier
          ? // biome-ignore lint/plugin: the current-tier shadow is Figma's 30% tint of --primary; no alpha token exists, so it is mixed on the token
            "border-primary-border drop-shadow-[0px_8px_12px_color-mix(in_srgb,var(--primary)_30%,transparent)]"
          : "border-border",
        className,
      )}
      data-slot="tier-info-card"
    >
      <HStack
        className="w-full"
        hAlign="space-between"
        vAlign="baseline"
        gap="sm"
      >
        <Text
          className="font-semibold text-foreground"
          data-slot="tier-info-card-tier"
          size="base"
        >
          {tier}
        </Text>
        {caption ? (
          <Text
            className="text-secondary-foreground"
            data-slot="tier-info-card-caption"
            size="xs"
          >
            {caption}
          </Text>
        ) : null}
      </HStack>
      <VStack className="w-full" data-slot="tier-info-card-benefits" gap="sm">
        {benefits.map((benefit) => (
          <HStack
            className="w-full"
            data-slot="tier-info-card-benefit"
            gap="sm"
            key={benefit}
            vAlign="center"
          >
            <span
              aria-hidden
              className="inline-flex shrink-0 text-primary"
              data-slot="tier-info-card-check"
            >
              <Check size={16} weight="bold" />
            </span>
            <Text className="min-w-0 text-foreground" size="sm">
              {benefit}
            </Text>
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
}

export type { TierInfoCardProps };
export { TierInfoCard };
