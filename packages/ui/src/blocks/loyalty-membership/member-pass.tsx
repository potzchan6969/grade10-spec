import { Badge } from "@grade10/design-system/components/display/badge";
import { G10LogoMono } from "@grade10/design-system/components/display/g10-logo-mono";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { toast } from "@grade10/design-system/components/overlays/toast";
import { cn } from "@grade10/design-system/lib/utils";
import { ArrowsCounterClockwise, CircleNotch } from "@phosphor-icons/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ScanPlate } from "./scan-plate";

/** The words the pass says, whoever holds it. */
type MemberPassCopy = {
  /** Read to anyone who cannot see the scannable code. */
  qrAlt: string;
  /** Names the short typed fallback code. */
  shortCode: string;
  /** Names the refresh control. */
  refresh: string;
  /** Precedes the m:ss countdown to the code's refresh. */
  refreshesIn: string;
  /** Shown when the code's time is up. */
  expired: string;
};

/**
 * What has become of the code on the pass. A code the till has taken is not
 * one of them — the pass just keeps rotating, so exactly one holds at a time
 * and an expired code can never also be counting down.
 */
type MemberPassState =
  | { status: "live"; remainingSeconds: number }
  | { status: "expired" };

type MemberPassVariant = "silver" | "gold" | "black";

type MemberPassProps = {
  copy: MemberPassCopy;
  /** The member's account email — no name is collected at registration. */
  email: string;
  /** The tier held, as the consumer names it; drawn in caps on the badge. */
  tier: string;
  /** The skin the held tier's pass wears. */
  variant: MemberPassVariant;
  /** Opaque single-use token the scannable code encodes verbatim. The pass never mints it. */
  token: string;
  /** The same identification, short enough to read out or type. */
  fallbackCode: string;
  /** Live or out of time. The consumer decides which — a taken code is answered by minting the next. */
  state: MemberPassState;
  /** Asks the consumer for a fresh token; nothing changes until one arrives. */
  onRefresh: () => void;
  /** A fresh token is on its way; the refresh control shows busy and the pass stays shown. */
  refreshing?: boolean;
  /** Why the last refresh was refused, toasted once per value the consumer passes. */
  refreshFailed?: string;
  className?: string;
};

const SKIN: Record<MemberPassVariant, { background: string; badge: string }> = {
  silver: {
    background:
      "radial-gradient(90% 90% at 100% 0%, rgb(208 231 246 / 0.4) 0%, rgb(208 231 246 / 0) 55%), linear-gradient(173.77deg, var(--slate-900) 8.5%, var(--slate-950) 91.5%)",
    badge: "border-slate-300 text-slate-300",
  },
  gold: {
    background:
      "radial-gradient(90% 90% at 100% 0%, var(--primary-muted-hover) 0%, rgb(196 144 61 / 0) 55%), linear-gradient(173.77deg, var(--orange-900) 8.5%, var(--orange-950) 91.5%)",
    badge: "border-primary text-primary",
  },
  black: {
    background:
      "radial-gradient(90% 90% at 100% 0%, var(--primary-muted-hover) 0%, rgb(196 144 61 / 0) 55%), linear-gradient(173.77deg, var(--orange-900) 8.5%, var(--orange-950) 91.5%)",
    badge: "border-primary-foreground text-primary-foreground",
  },
};

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Seconds as the countdown's m:ss figure. */
function minutesSeconds(seconds: number) {
  const safe = Math.max(0, Math.floor(seconds));
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, "0")}`;
}

/**
 * The member pass a till scans or reads. The token arrives minted — this
 * pass encodes it and counts it down, and refreshing only asks the consumer
 * for a new one, so no credential is ever produced on a surface.
 *
 * A code a till takes is simply answered by the next one — the pass keeps
 * counting down and rotating rather than freezing on what was spent, and the
 * refusal of a replayed code is the till's answer, not the member's card's.
 *
 * On a phone the pass is presented alone, so the code area keeps the member's
 * email under the tier badge — the programme collects no name at registration.
 * A fresh token swaps the code area in and out of view rather than snapping,
 * so staff are never mid-scan when the square moves.
 */
function MemberPass({
  copy,
  email,
  tier,
  variant,
  token,
  fallbackCode,
  state,
  onRefresh,
  refreshing = false,
  refreshFailed,
  className,
}: MemberPassProps) {
  const skin = SKIN[variant];
  const expired = state.status === "expired";

  const [shown, setShown] = useState({ token, code: fallbackCode });
  const [exiting, setExiting] = useState(false);

  useLayoutEffect(() => {
    if (shown.token === token && shown.code === fallbackCode) return;
    if (prefersReducedMotion()) {
      setShown({ token, code: fallbackCode });
      return;
    }
    setExiting(true);
  }, [token, fallbackCode, shown]);

  // The swap lands the moment the square has faded out — animationend is the
  // crisp path, the timer covers a cancelled or unfired animation.
  useEffect(() => {
    if (!exiting) return;
    const settled = window.setTimeout(() => {
      setExiting(false);
      setShown({ token, code: fallbackCode });
    }, 400);
    return () => window.clearTimeout(settled);
  }, [exiting, token, fallbackCode]);

  // A refused refresh is an event, not a state — it toasts once per reason
  // rather than sitting inline under the control.
  const lastRefusalRef = useRef<string | null>(null);
  useEffect(() => {
    if (!refreshFailed) {
      lastRefusalRef.current = null;
      return;
    }
    if (lastRefusalRef.current === refreshFailed) return;
    lastRefusalRef.current = refreshFailed;
    toast.error(refreshFailed);
  }, [refreshFailed]);

  return (
    <div
      className={cn(
        "w-full max-w-(--container-xs) overflow-clip rounded-(--radius-4xl) drop-shadow-[0px_30px_30px_rgb(0_0_0/0.15)]",
        className,
      )}
      data-expired={expired || undefined}
      data-slot="member-pass"
    >
      <VStack
        className="w-full overflow-clip px-5 py-6"
        gap="sm"
        style={{ backgroundImage: skin.background }}
      >
        <HStack align="center" className="w-full" justify="space-between">
          <G10LogoMono
            aria-hidden
            className="h-4 w-auto shrink-0 text-primary-foreground"
            data-slot="member-pass-logo"
          />
          <Badge
            className={cn("bg-transparent uppercase", skin.badge)}
            data-slot="member-pass-tier"
            variant="outline"
          >
            {tier}
          </Badge>
        </HStack>
        <Text
          className="w-full text-muted-foreground"
          data-slot="member-pass-email"
          size="xs"
        >
          {email}
        </Text>
      </VStack>
      <VStack className="w-full bg-card p-5" gap="md" hAlign="center">
        <div
          aria-live="polite"
          className="w-full"
          data-slot="member-pass-code-area"
        >
          {/* Only the square moves — it fades and eases down, the pair swaps
              while it is out of view, then the fresh one settles back in. The
              caption and code never animate. */}
          <div
            className={cn(
              exiting
                ? "[&_[data-slot=member-pass-qr]]:animate-out [&_[data-slot=member-pass-qr]]:fade-out [&_[data-slot=member-pass-qr]]:zoom-out-97 [&_[data-slot=member-pass-qr]]:fill-mode-both"
                : "[&_[data-slot=member-pass-qr]]:animate-in [&_[data-slot=member-pass-qr]]:fade-in [&_[data-slot=member-pass-qr]]:zoom-in-97",
              "[&_[data-slot=member-pass-qr]]:duration-200 motion-reduce:[&_[data-slot=member-pass-qr]]:animate-none",
            )}
            key={`${shown.token}|${shown.code}`}
            onAnimationEnd={() => {
              if (!exiting) return;
              setExiting(false);
              setShown({ token, code: fallbackCode });
            }}
          >
            <ScanPlate
              alt={copy.qrAlt}
              caption={copy.shortCode}
              code={shown.code}
              dimmed={expired}
              size={224}
              slot="member-pass"
              value={shown.token}
              variant="flat"
            />
          </div>
        </div>
        <div
          aria-hidden="true"
          className="w-full border-t border-border"
          data-slot="member-pass-divider"
        />
        <HStack align="center" className="w-full" justify="space-between">
          <PassState copy={copy} state={state} />
          <Button
            leading={<ArrowsCounterClockwise aria-hidden="true" />}
            loading={refreshing}
            onClick={() => {
              if (!refreshing) onRefresh();
            }}
            size="sm"
            type="button"
            variant="outline"
          >
            {copy.refresh}
          </Button>
        </HStack>
      </VStack>
    </div>
  );
}

/** The footer's one line: what the code is worth right now. */
function PassState({
  copy,
  state,
}: {
  copy: MemberPassCopy;
  state: MemberPassState;
}) {
  if (state.status === "expired") {
    return (
      <Text data-slot="member-pass-expired" size="xs" tone="error">
        {copy.expired}
      </Text>
    );
  }
  return (
    <HStack align="center" gap="xs">
      <span aria-hidden="true" className="inline-flex animate-spin">
        <CircleNotch color="var(--primary)" size={20} />
      </span>
      <Text
        className="whitespace-nowrap text-secondary-foreground"
        data-slot="member-pass-countdown"
        size="xs"
      >
        {copy.refreshesIn} {minutesSeconds(state.remainingSeconds)}
      </Text>
    </HStack>
  );
}

export type {
  MemberPassCopy,
  MemberPassProps,
  MemberPassState,
  MemberPassVariant,
};
export { MemberPass };
