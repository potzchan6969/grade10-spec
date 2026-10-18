import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@grade10/design-system/components/display/card";
import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";

/** The words the summary says, whoever's membership is in it. */
type MembershipSummaryCopy = {
  title: string;
  /** Names the tier held. */
  tier: string;
  /** Names the redeemable balance. */
  balance: string;
  /** Names the qualifying-window progress, and the progress bar itself. */
  qualifying: string;
  /** Names the date the tier renews or lapses. */
  renewal: string;
};

type MembershipSummaryProps = {
  copy: MembershipSummaryCopy;
  /** The tier held, as the consumer names it. */
  tier: string;
  /** Redeemable points. Shown apart from the qualifying count, never summed. */
  balance: number;
  /** Tier points earned inside the current qualifying window. */
  qualifyingPoints: number;
  /** Tier points that keep the tier when the window closes. */
  qualifyingThreshold: number;
  /** Already formatted by the consumer. */
  renewalDate: string;
  /** The earned tier's validity and what keeps it, as one sentence. */
  tierValidity?: string;
  /**
   * How many points expire and the day they go, as one sentence the consumer
   * has already worded, and the tone it is said in. The consumer reads the
   * clock and decides both; absent where the member holds no points.
   */
  balanceExpiry?: { line: string; tone: "normal" | "warning" };
  className?: string;
};

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <HStack align="baseline" gap="sm" justify="space-between">
      <Text size="sm" tone="secondary">
        {label}
      </Text>
      <Text size="sm">{value}</Text>
    </HStack>
  );
}

/**
 * The membership figures: tier, spendable points, and the two clocks. The
 * redeemable balance and the qualifying count are two counts and stay two —
 * summing them would price a member's spending power with their retention
 * progress.
 */
function MembershipSummary({
  copy,
  tier,
  balance,
  qualifyingPoints,
  qualifyingThreshold,
  renewalDate,
  tierValidity,
  balanceExpiry,
  className,
}: MembershipSummaryProps) {
  const bounded = Math.min(qualifyingPoints, qualifyingThreshold);
  const percent =
    qualifyingThreshold > 0 ? (bounded / qualifyingThreshold) * 100 : 0;

  return (
    <Card className={cn("max-w-md", className)} data-slot="membership-summary">
      <CardHeader>
        <CardTitle>{copy.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <VStack gap="md">
          <HStack gap="lg">
            <VStack gap="xs">
              <Text size="sm" tone="secondary">
                {copy.tier}
              </Text>
              <Text data-slot="membership-tier" size="lg" weight="bold">
                {tier}
              </Text>
            </VStack>
            <VStack gap="xs">
              <Text size="sm" tone="secondary">
                {copy.balance}
              </Text>
              <Text data-slot="membership-balance" size="lg" weight="bold">
                {balance}
              </Text>
            </VStack>
          </HStack>
          <VStack gap="xs">
            <HStack align="baseline" gap="sm" justify="space-between">
              <Text size="sm" tone="secondary">
                {copy.qualifying}
              </Text>
              <Text data-slot="membership-qualifying" size="sm">
                {qualifyingPoints} / {qualifyingThreshold}
              </Text>
            </HStack>
            <div
              aria-label={copy.qualifying}
              aria-valuemax={qualifyingThreshold}
              aria-valuemin={0}
              aria-valuenow={bounded}
              className="h-2 w-full overflow-hidden rounded-full bg-muted"
              data-slot="membership-qualifying-progress"
              role="progressbar"
            >
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${percent}%` }}
              />
            </div>
          </VStack>
          <VStack gap="xs">
            <SummaryRow label={copy.renewal} value={renewalDate} />
            {tierValidity ? (
              <Text data-slot="membership-tier-validity" size="sm">
                {tierValidity}
              </Text>
            ) : null}
            {balanceExpiry ? (
              <Text
                className={
                  balanceExpiry.tone === "warning" ? "text-warning" : undefined
                }
                data-slot="membership-balance-expiry"
                size="sm"
              >
                {balanceExpiry.line}
              </Text>
            ) : null}
          </VStack>
        </VStack>
      </CardContent>
    </Card>
  );
}

export type { MembershipSummaryCopy, MembershipSummaryProps };
export { MembershipSummary };
