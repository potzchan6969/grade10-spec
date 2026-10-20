import { G10LogoMono } from "@grade10/design-system/components/display/g10-logo-mono";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { toast } from "@grade10/design-system/components/overlays/toast";
import { cn } from "@grade10/design-system/lib/utils";
import { ArrowsCounterClockwise, CircleNotch } from "@phosphor-icons/react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { TierBadge } from "./tier-badge";

/** The words the pass says, whoever holds it. */
type MemberPassCopy = {
  /** Read to anyone who cannot see the scannable code. */
  qrAlt: string;
  /** Names the refresh control. */
  refresh: string;
  /** Precedes the m:ss countdown to the code's refresh. */
  refreshesIn: string;
};

/**
 * How long the code on the pass has to live — the consumer mints the next
 * one before it runs out, so the pass is never out of time. A code the till
 * takes is not a state either; it is answered by the next minted token.
 */
type MemberPassState = { remainingSeconds: number };

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
  /** Seconds the code has left; the consumer mints the next before it runs out. */
  state: MemberPassState;
  /** Asks the consumer for a fresh token; nothing changes until one arrives. */
  onRefresh: () => void;
  /** A fresh token is on its way; the refresh control shows busy and the pass stays shown. */
  refreshing?: boolean;
  /** Why the last refresh was refused, toasted once per value the consumer passes. */
  refreshFailed?: string;
  className?: string;
};

const SKIN: Record<MemberPassVariant, { background: string }> = {
  silver: {
    background:
      "radial-gradient(90% 90% at 100% 0%, rgb(208 231 246 / 0.4) 0%, rgb(208 231 246 / 0) 55%), linear-gradient(173.77deg, var(--slate-900) 8.5%, var(--slate-950) 91.5%)",
  },
  gold: {
    background:
      "radial-gradient(90% 90% at 100% 0%, var(--primary-muted-hover) 0%, rgb(196 144 61 / 0) 55%), linear-gradient(173.77deg, var(--orange-900) 8.5%, var(--orange-950) 91.5%)",
  },
  black: {
    background:
      "radial-gradient(90% 90% at 100% 0%, var(--primary-muted-hover) 0%, rgb(196 144 61 / 0) 55%), linear-gradient(173.77deg, var(--orange-900) 8.5%, var(--orange-950) 91.5%)",
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
 * The member pass a till scans. The token arrives minted — this pass encodes
 * it and counts it down, and refreshing only asks the consumer for a new one,
 * so no credential is ever produced on a surface.
 *
 * A code a till takes is simply answered by the next one — the pass keeps
 * counting down and rotating rather than freezing on what was spent, and the
 * refusal of a replayed code is the till's answer, not the member's card's.
 * The square stands alone: the code it encodes is not spelled out, and an
 * email miss is the till's other path to the member.
 *
 * On a phone the pass is presented alone, so the header keeps the member's
 * email under the tier badge — the programme collects no name at registration.
 * A fresh token swaps the square in and out of view rather than snapping, so
 * staff are never mid-scan when it moves.
 */
function MemberPass({
  copy,
  email,
  tier,
  variant,
  token,
  state,
  onRefresh,
  refreshing = false,
  refreshFailed,
  className,
}: MemberPassProps) {
  const skin = SKIN[variant];

  const [shown, setShown] = useState(token);
  const [exiting, setExiting] = useState(false);

  useLayoutEffect(() => {
    if (shown === token) return;
    if (prefersReducedMotion()) {
      setShown(token);
      return;
    }
    setExiting(true);
  }, [token, shown]);

  // The swap lands the moment the square has faded out — animationend is the
  // crisp path, the timer covers a cancelled or unfired animation.
  useEffect(() => {
    if (!exiting) return;
    const settled = window.setTimeout(() => {
      setExiting(false);
      setShown(token);
    }, 400);
    return () => window.clearTimeout(settled);
  }, [exiting, token]);

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
          <TierBadge slot="member-pass-tier" tier={tier} variant={variant} />
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
          {/* Only the square moves — it fades and eases down, the token swaps
              while it is out of view, then the fresh one settles back in. */}
          <div
            className={cn(
              exiting
                ? "[&_[data-slot=member-pass-qr]]:animate-out [&_[data-slot=member-pass-qr]]:fade-out [&_[data-slot=member-pass-qr]]:zoom-out-97 [&_[data-slot=member-pass-qr]]:fill-mode-both"
                : "[&_[data-slot=member-pass-qr]]:animate-in [&_[data-slot=member-pass-qr]]:fade-in [&_[data-slot=member-pass-qr]]:zoom-in-97",
              "[&_[data-slot=member-pass-qr]]:duration-200 motion-reduce:[&_[data-slot=member-pass-qr]]:animate-none",
            )}
            key={shown}
            onAnimationEnd={() => {
              if (!exiting) return;
              setExiting(false);
              setShown(token);
            }}
          >
            <div className="mx-auto w-full max-w-56" data-slot="member-pass-qr">
              <QRCodeSVG
                bgColor="#ffffff"
                className="block h-auto w-full"
                fgColor="#000000"
                level="M"
                marginSize={2}
                size={224}
                title={copy.qrAlt}
                value={shown}
              />
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="w-full border-t border-border"
          data-slot="member-pass-divider"
        />
        <HStack align="center" className="w-full" justify="space-between">
          <HStack align="center" gap="xs">
            <span aria-hidden="true" className="inline-flex animate-spin">
              <CircleNotch color="var(--primary)" size={16} />
            </span>
            <Text
              className="whitespace-nowrap text-secondary-foreground"
              data-slot="member-pass-countdown"
              size="xs"
            >
              {copy.refreshesIn} {minutesSeconds(state.remainingSeconds)}
            </Text>
          </HStack>
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

export type {
  MemberPassCopy,
  MemberPassProps,
  MemberPassState,
  MemberPassVariant,
};
export { MemberPass };
