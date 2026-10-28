import { Step } from "@grade10/design-system/components/display/step";
import { Stepper } from "@grade10/design-system/components/display/stepper";
import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";
import { CampaignGiftArt } from "./campaign-gift-art";

/**
 * What the band at the foot of the card says at a glance:
 * - `act`: something for the member to do.
 * - `wait`: waiting on us, or try again.
 * - `won`: the gift is theirs.
 * - `off`: nothing more here for them.
 */
type CampaignWayTone = "act" | "wait" | "won" | "off";

type CampaignWayCardProps = {
  /** How one takes part, in a word or two: "Sign-up win", "Photo hunt". */
  kindLabel: string;
  title: string;
  description?: string | null;
  /** The gift's name, written beside its picture. */
  rewardLabel: string;
  rewardImageUrl?: string | null;
  /**
   * The picture across the card's top, cropped to fill: the scene of this way
   * to win. Absent, the top shows the gift itself, large.
   */
  coverImageUrl?: string | null;
  /** How to take part, in order; none, and the card lists nothing. */
  steps?: readonly string[];
  tone: CampaignWayTone;
  /**
   * Where a sent entry has got to: the stage names in order and the one it is
   * at. Absent, the band draws no track.
   */
  track?: { stages: readonly string[]; at: number };
  /** The consumer's name for the member's state, carried as `data-step`. */
  step?: string;
  /** The band's own words and the one next step. */
  children?: ReactNode;
};

const BAND: Record<CampaignWayTone, string> = {
  act: "bg-primary-muted",
  wait: "bg-warning-muted",
  won: "bg-success-muted",
  off: "bg-muted text-secondary-foreground",
};

/**
 * One way to win a campaign's gift. The top never changes — the gift, the
 * kind, the title and how to take part — and the band at the foot is where
 * the member stands, toned so a glance down the page tells "do this" from
 * "waiting", "won" and "closed". The ways stack as full-width sections of one
 * page, not tiles that lead elsewhere: the picture sits beside the words on a
 * wide screen and above them on a narrow one.
 */
function CampaignWayCard({
  kindLabel,
  title,
  description,
  rewardLabel,
  rewardImageUrl,
  coverImageUrl,
  steps = [],
  tone,
  track,
  step,
  children,
}: CampaignWayCardProps) {
  const off = tone === "off";
  return (
    <article
      className="grid overflow-hidden rounded-2xl border border-border bg-card text-card-foreground md:grid-cols-[2fr_3fr] md:grid-rows-[auto_1fr_auto]"
      data-slot="campaign-way"
      data-step={step}
      data-tone={tone}
    >
      {coverImageUrl ? (
        <img
          alt=""
          className={cn(
            "h-40 w-full object-cover md:row-span-3 md:h-full md:min-h-64",
            off && "opacity-50 grayscale",
          )}
          data-slot="campaign-way-cover"
          src={coverImageUrl}
        />
      ) : (
        <div
          className="grid h-40 place-items-center bg-primary-muted md:row-span-3 md:h-full md:min-h-64"
          data-slot="campaign-way-cover"
        >
          <CampaignGiftArt dimmed={off} imageUrl={rewardImageUrl} size="lg" />
        </div>
      )}

      <VStack className="p-5" gap="xs">
        <span className="text-xs font-bold tracking-widest text-primary uppercase">
          {kindLabel}
        </span>
        <h3 className="text-xl leading-tight font-bold text-balance">
          {title}
        </h3>
        {description ? (
          <Text size="sm" tone="secondary">
            {description}
          </Text>
        ) : null}
        <HStack data-slot="campaign-way-gift" gap="sm" vAlign="center">
          {coverImageUrl ? (
            <CampaignGiftArt dimmed={off} imageUrl={rewardImageUrl} size="sm" />
          ) : null}
          <Text size="sm" weight="medium">
            {rewardLabel}
          </Text>
        </HStack>
      </VStack>

      {steps.length > 0 ? (
        <ol
          className="m-0 grid list-none content-start gap-3 px-5 pb-5"
          data-slot="campaign-way-steps"
        >
          {steps.map((one, at) => (
            <li className="grid grid-cols-[1.5rem_1fr] gap-3 text-sm" key={one}>
              <span
                aria-hidden
                className="grid size-6 place-items-center rounded-full bg-muted text-xs font-bold"
              >
                {at + 1}
              </span>
              <span>{one}</span>
            </li>
          ))}
        </ol>
      ) : (
        <div />
      )}

      <VStack
        className={cn("border-t border-border px-5 py-4", BAND[tone])}
        data-slot="campaign-way-band"
        gap="sm"
        hAlign="start"
      >
        {track ? (
          <Stepper aria-label={title} data-slot="campaign-way-track">
            {track.stages.map((stage, at) => (
              <Step
                key={stage}
                label={stage}
                showLeadingConnector={at > 0}
                showTrailingConnector={at < track.stages.length - 1}
                state={
                  at < track.at
                    ? "completed"
                    : at === track.at
                      ? "progress"
                      : "upcoming"
                }
              />
            ))}
          </Stepper>
        ) : null}
        {children}
      </VStack>
    </article>
  );
}

export type { CampaignWayCardProps, CampaignWayTone };
export { CampaignWayCard };
