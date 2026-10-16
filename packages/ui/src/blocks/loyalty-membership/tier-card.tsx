import { G10LogoMono } from "@grade10/design-system/components/display/g10-logo-mono";
import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import { CaretRight, CrownSimple } from "@phosphor-icons/react";
import type { MouseEvent } from "react";

/** The words the card says, whoever's membership is in it. */
type TierCardCopy = {
  /** Names the redeemable balance. */
  balance: string;
  /** The unit beside the balance and inside the progress count — "pts". */
  points: string;
  /** Follows the worth figure — "off at checkout". */
  worthSuffix: string;
  /** Names the qualifying-window progress, and the progress bar itself. */
  qualifying: string;
  /** Names the Benefits destination the whole card opens. */
  benefits: string;
};

type TierCardVariant = "silver" | "gold" | "black";

type TierCardProps = {
  copy: TierCardCopy;
  /** The skin the held tier's card wears. */
  variant: TierCardVariant;
  /** The tier held, as the consumer names it; drawn in caps up top. */
  tier: string;
  /** Redeemable points, formatted by the consumer — "6,900". */
  balance: string;
  /**
   * What the balance pays at checkout, formatted by the consumer — "HK$75" —
   * drawn in the tier's accent before `copy.worthSuffix`.
   */
  worth?: string;
  /** Tier points earned inside the current qualifying window. */
  qualifyingPoints?: number;
  /**
   * Tier points that keep or reach the tier. Where no threshold is supplied —
   * a tier held by invitation — no progress is drawn.
   */
  qualifyingThreshold?: number;
  /** The retain-or-upgrade ask and its day, as one sentence the consumer words. */
  retentionLine?: string;
  /** What the held tier earns, as the footer's one sentence the consumer words. */
  earnLine?: string;
  /**
   * The Tier & Benefits page's own address. Where it is given, the whole card
   * is a link to it — the Benefits label included — so its address can be
   * copied and a press with a modifier key opens it in a new tab. A plain
   * press is still reported through `onClick` where one is supplied.
   */
  href?: string;
  /** Reported on a plain press, in place of the link's own navigation. */
  onClick?: () => void;
  className?: string;
};

const SKIN: Record<
  TierCardVariant,
  {
    background: string;
    tier: string;
    ring: string;
    worth: string;
    logo: string;
    indicator: string;
  }
> = {
  silver: {
    background:
      "radial-gradient(90% 90% at 100% 0%, rgb(208 231 246 / 0.4) 0%, rgb(208 231 246 / 0) 55%), linear-gradient(165deg, var(--slate-900) 8.5%, var(--slate-950) 91.5%)",
    tier: "text-(--slate-300)",
    ring: "border-(--blue-100)",
    worth: "text-(--slate-300)",
    logo: "text-(--slate-50)",
    indicator: "from-(--slate-400) to-(--slate-200)",
  },
  gold: {
    background:
      "radial-gradient(90% 90% at 100% 0%, rgb(196 144 61 / 0.4) 0%, rgb(196 144 61 / 0) 55%), linear-gradient(165deg, var(--orange-900) 8.5%, var(--orange-950) 91.5%)",
    tier: "text-(--accent-foreground)",
    ring: "border-(--orange-400)",
    worth: "text-(--accent-foreground)",
    logo: "text-(--accent-foreground)",
    indicator: "from-(--orange-400) to-(--orange-200)",
  },
  black: {
    background:
      "radial-gradient(90% 90% at 100% 0%, rgb(255 255 255 / 0.4) 0%, rgb(255 255 255 / 0) 55%), linear-gradient(169deg, var(--gray-900) 8.5%, var(--gray-950) 91.5%)",
    tier: "text-(--secondary)",
    ring: "border-(--slate-50)",
    worth: "text-(--accent-foreground)",
    logo: "text-(--slate-50)",
    indicator: "",
  },
};

/**
 * The member's tier card: the tier's skin and wordmark, the spendable balance
 * and what it pays at checkout, the qualifying-window progress where the tier
 * names a threshold, and the Benefits link — the whole card opens the Tier &
 * Benefits page. The card carries no expiry line: the balance lapses on one
 * date after the inactivity window, and that is said where the member reads
 * their benefits.
 */
function TierCard({
  copy,
  variant,
  tier,
  balance,
  worth,
  qualifyingPoints,
  qualifyingThreshold,
  retentionLine,
  earnLine,
  href,
  onClick,
  className,
}: TierCardProps) {
  const skin = SKIN[variant];
  const showsProgress = qualifyingPoints != null && qualifyingThreshold != null;
  const bounded = showsProgress
    ? Math.min(qualifyingPoints, qualifyingThreshold)
    : 0;
  const percent =
    showsProgress && qualifyingThreshold > 0
      ? (bounded / qualifyingThreshold) * 100
      : 0;
  const opens = href != null || onClick != null;

  const reportPlainPress = (event: MouseEvent<HTMLAnchorElement>) => {
    if (onClick == null || event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return;
    event.preventDefault();
    onClick();
  };

  const rings = (
    <>
      <div
        aria-hidden
        className={cn(
          "absolute -top-[70px] -right-[15px] size-[184px] rounded-full border opacity-20",
          skin.ring,
        )}
        data-slot="tier-card-ring"
      />
      <div
        aria-hidden
        className={cn(
          "absolute top-[-28px] right-[139px] size-[87px] rounded-full border opacity-20",
          skin.ring,
        )}
        data-slot="tier-card-ring"
      />
    </>
  );

  const body = (
    <VStack className="w-full" gap="md">
      <HStack align="center" className="w-full" justify="space-between">
        <HStack align="center" gap="xs">
          {variant === "black" ? (
            <CrownSimple aria-hidden size={12} weight="fill" />
          ) : null}
          <Text
            className={cn(
              "tracking-[0.05em] font-semibold uppercase",
              skin.tier,
            )}
            data-slot="tier-card-tier"
            size="xs"
          >
            {tier}
          </Text>
        </HStack>
        <G10LogoMono
          aria-hidden
          className={cn("h-4 w-auto", skin.logo)}
          data-slot="tier-card-logo"
        />
      </HStack>
      <VStack className="w-full" gap="xs">
        <Text size="xs" tone="muted" weight="medium">
          {copy.balance}
        </Text>
        <HStack align="baseline" gap="xs" className="w-full">
          <span
            className={cn(
              "bg-gradient-to-b bg-clip-text font-sans text-5xl leading-none font-semibold text-transparent",
              variant === "silver"
                ? "from-(--slate-50) to-(--slate-500)"
                : "from-(--gray-50) to-(--gray-400)",
            )}
            data-slot="tier-card-balance"
          >
            {balance}
          </span>
          <Text size="base" tone="muted" weight="medium">
            {copy.points}
          </Text>
        </HStack>
        {worth ? (
          <Text data-slot="tier-card-worth" size="xs" tone="muted">
            <span className={cn("font-semibold", skin.worth)}>{worth}</span>
            {` ${copy.worthSuffix}`}
          </Text>
        ) : null}
      </VStack>
      {showsProgress ? (
        <VStack className="w-full" gap="sm">
          <VStack className="w-full" gap="sm">
            <HStack
              align="center"
              className="w-full"
              gap="sm"
              justify="space-between"
            >
              <Text size="xs" tone="muted" weight="medium">
                {copy.qualifying}
              </Text>
              <Text data-slot="tier-card-qualifying" size="xs" tone="muted">
                {`${qualifyingPoints} / ${qualifyingThreshold} ${copy.points}`}
              </Text>
            </HStack>
            <div
              aria-label={copy.qualifying}
              aria-valuemax={qualifyingThreshold}
              aria-valuemin={0}
              aria-valuenow={bounded}
              className="h-2 w-full overflow-hidden rounded-full bg-(--slate-50)/10"
              data-slot="tier-card-qualifying-progress"
              role="progressbar"
            >
              <div
                className={cn(
                  "h-full rounded-md bg-gradient-to-r",
                  skin.indicator,
                )}
                style={{ width: `${percent}%` }}
              />
            </div>
          </VStack>
          {retentionLine ? (
            <Text data-slot="tier-card-retention" size="xs" tone="muted">
              {retentionLine}
            </Text>
          ) : null}
        </VStack>
      ) : null}
      <HStack
        align="center"
        className="w-full border-t border-(--gray-200)/10 pt-4"
        gap="sm"
        justify="space-between"
      >
        {earnLine ? (
          <Text data-slot="tier-card-earn" size="xs" tone="muted">
            {earnLine}
          </Text>
        ) : null}
        <HStack align="center" className="ml-auto" gap="xs">
          <Text data-slot="tier-card-benefits" size="xs" tone="muted">
            {copy.benefits}
          </Text>
          <CaretRight aria-hidden color="var(--muted-foreground)" size={12} />
        </HStack>
      </HStack>
    </VStack>
  );

  const cardClass = cn(
    "relative block w-(--container-sm) overflow-clip rounded-(--radius-3xl) p-5 shadow-[0px_24px_48px_-24px_rgb(0_0_0/0.5)]",
    opens &&
      "cursor-pointer outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
    className,
  );

  if (href != null) {
    return (
      <a
        className={cardClass}
        data-slot="tier-card"
        href={href}
        onClick={reportPlainPress}
        style={{ backgroundImage: skin.background }}
      >
        {rings}
        {body}
      </a>
    );
  }
  if (onClick != null) {
    return (
      <button
        className={cn(cardClass, "text-left")}
        data-slot="tier-card"
        onClick={onClick}
        style={{ backgroundImage: skin.background }}
        type="button"
      >
        {rings}
        {body}
      </button>
    );
  }
  return (
    <div
      className={cardClass}
      data-slot="tier-card"
      style={{ backgroundImage: skin.background }}
    >
      {rings}
      {body}
    </div>
  );
}

export type { TierCardCopy, TierCardProps, TierCardVariant };
export { TierCard };
