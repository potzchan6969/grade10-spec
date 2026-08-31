import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@grade10/design-system/components/display/card";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import { QRCodeSVG } from "qrcode.react";

/** The words the card says, whoever holds it. */
type MemberCardCopy = {
  /** Read to anyone who cannot see the scannable code. */
  qrAlt: string;
  /** Names the short typed fallback code. */
  fallbackCode: string;
  /** Names the refresh control. */
  refresh: string;
  /** Precedes the seconds-remaining figure. */
  expiresIn: string;
  /** The unit the countdown counts in — "s". */
  secondsUnit: string;
  /** Shown when the code's time is up. */
  expired: string;
  /** Shown when the code has already been presented somewhere. */
  used: string;
};

/**
 * Where and when a code was already used — the same fact the till names when
 * it refuses a replay. Both halves arrive worded: a place needs a name the
 * consumer holds, and an instant needs a language and a zone this package is
 * forbidden to know.
 */
type MemberCardUse = {
  /** The place, as a member would name it — never a domain or a raw id. */
  place: string;
  /** When it happened, already formatted. */
  when: string;
};

/**
 * What has become of the code on the card. Exactly one holds at a time, so a
 * spent code can never also be counting down.
 */
type MemberCardState =
  | { status: "live"; remainingSeconds: number }
  | { status: "expired" }
  | { status: "used"; firstUse: MemberCardUse };

type MemberCardProps = {
  copy: MemberCardCopy;
  displayName: string;
  /** The tier held, as the consumer names it. */
  tier: string;
  /** Opaque single-use token the scannable code encodes verbatim. The card never mints it. */
  token: string;
  /** The same identification, short enough to read out or type. */
  fallbackCode: string;
  /** Live, out of time, or already used. The consumer decides which. */
  state: MemberCardState;
  /** Asks the consumer for a fresh token; nothing changes until one arrives. */
  onRefresh: () => void;
  className?: string;
};

/**
 * The member card a till scans or reads. The token arrives minted — this card
 * encodes it and counts it down, and refreshing only asks the consumer for a
 * new one, so no credential is ever produced on a surface.
 *
 * A code that has been scanned says where and when, because the till refusing
 * the second scan says exactly that: the member standing at the counter reads
 * the same sentence as the staff member serving them.
 *
 * The QR plate keeps fixed colours for the same reason the authenticator QR
 * does: phone scanners expect dark modules on a light field, and a palette
 * that inverts under dark mode produces a code that does not scan.
 */
function MemberCard({
  copy,
  displayName,
  tier,
  token,
  fallbackCode,
  state,
  onRefresh,
  className,
}: MemberCardProps) {
  const spent = state.status !== "live";

  return (
    <Card
      className={cn("max-w-sm", className)}
      data-expired={state.status === "expired" || undefined}
      data-slot="member-card"
      data-used={state.status === "used" || undefined}
    >
      <CardHeader>
        <CardTitle>{displayName}</CardTitle>
        <Text data-slot="member-card-tier" size="sm" tone="secondary">
          {tier}
        </Text>
      </CardHeader>
      <CardContent>
        <VStack gap="md">
          <div
            aria-hidden={spent || undefined}
            className={cn(
              "w-fit rounded-(--radius-md) bg-white p-3",
              spent && "opacity-30",
            )}
            data-slot="member-card-qr"
          >
            <QRCodeSVG
              bgColor="#ffffff"
              fgColor="#000000"
              level="M"
              marginSize={4}
              size={192}
              title={copy.qrAlt}
              value={token}
            />
          </div>
          <VStack gap="xs">
            <Text size="sm" tone="secondary">
              {copy.fallbackCode}
            </Text>
            <Text
              className="font-mono tracking-widest"
              data-slot="member-card-fallback-code"
              size="lg"
              weight="medium"
            >
              {fallbackCode}
            </Text>
          </VStack>
          <HStack align="center" gap="sm" justify="space-between">
            <CardState copy={copy} state={state} />
            <Button
              onClick={onRefresh}
              size="sm"
              type="button"
              variant="outline"
            >
              {copy.refresh}
            </Button>
          </HStack>
        </VStack>
      </CardContent>
    </Card>
  );
}

/** The one line that says what the code is worth right now. */
function CardState({
  copy,
  state,
}: {
  copy: MemberCardCopy;
  state: MemberCardState;
}) {
  if (state.status === "used") {
    return (
      <VStack data-slot="member-card-used" gap="xs">
        <Text size="sm" tone="error">
          {copy.used}
        </Text>
        <Text data-slot="member-card-first-use" size="sm" tone="secondary">
          {state.firstUse.place} · {state.firstUse.when}
        </Text>
      </VStack>
    );
  }
  if (state.status === "expired") {
    return (
      <Text data-slot="member-card-expired" size="sm" tone="error">
        {copy.expired}
      </Text>
    );
  }
  return (
    <Text data-slot="member-card-countdown" size="sm" tone="secondary">
      {copy.expiresIn} {state.remainingSeconds}
      {copy.secondsUnit}
    </Text>
  );
}

export type { MemberCardCopy, MemberCardProps, MemberCardState, MemberCardUse };
export { MemberCard };
