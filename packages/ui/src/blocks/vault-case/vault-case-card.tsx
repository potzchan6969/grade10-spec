import { Badge } from "@grade10/design-system/components/display/badge";
import { Card } from "@grade10/design-system/components/display/card";
import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import {
  ArrowRight,
  CalendarBlank,
  CaretRight,
  Check,
  Clock,
  type Icon,
  User,
  Vault,
  Warning,
} from "@phosphor-icons/react";
import { Fragment, useId } from "react";

type VaultCasesTone =
  | "default"
  | "brand"
  | "info"
  | "success"
  | "warning"
  | "error";

type VaultCasesIcon =
  | "person"
  | "vault"
  | "calendar"
  | "clock"
  | "warning"
  | "check";

/** A worded chip: what it says, its tone, and the icon before it. */
type VaultCasesChip = {
  label: string;
  tone: VaultCasesTone;
  icon?: VaultCasesIcon;
};

/** One case as the home reads it, every part already worded. */
type VaultCasesCard = {
  id: string;
  /** The item's name; it names the card's one control. */
  title: string;
  status: VaultCasesChip;
  /** Whose move it is. */
  owner: VaultCasesChip;
  /** Opened, the lane and what was asked for, in reading order. */
  facts: readonly string[];
  /** The case reference, last on the facts line and the control's description. */
  reference: string;
  next: { label: string; tone: "primary" | "neutral" } | null;
  /** The booked visit, or the day the item went in. */
  visit: string | null;
  /** The reason staff gave for ending the case. */
  note: string | null;
};

const ICONS: Record<VaultCasesIcon, Icon> = {
  person: User,
  vault: Vault,
  calendar: CalendarBlank,
  clock: Clock,
  warning: Warning,
  check: Check,
};

const NEXT_TONE = {
  primary: "bg-primary-muted text-primary-muted-foreground",
  neutral: "bg-muted text-foreground",
} as const;

function Chip({ chip }: { chip: VaultCasesChip }) {
  const ChipIcon = chip.icon ? ICONS[chip.icon] : null;
  return (
    <Badge variant={chip.tone}>
      {ChipIcon ? <ChipIcon aria-hidden weight="bold" /> : null}
      {chip.label}
    </Badge>
  );
}

/** One case on the vault home: the item's name opens it from anywhere on the card. */
function VaultCaseCard({
  card,
  onOpen,
}: {
  card: VaultCasesCard;
  onOpen: (caseId: string) => void;
}) {
  const referenceId = useId();
  return (
    <Card className="relative isolate px-(--card-spacing)">
      <HStack align="center" gap="sm" justify="space-between">
        <h4 className="min-w-0">
          <button
            aria-describedby={referenceId}
            className="cursor-pointer text-left break-words outline-none after:absolute after:inset-0 after:z-1 after:rounded-(--radius-2xl) after:content-[''] focus-visible:after:ring-3 focus-visible:after:ring-ring/50 focus-visible:after:ring-inset"
            onClick={() => onOpen(card.id)}
            type="button"
          >
            <Text as="span" weight="medium">
              {card.title}
            </Text>
          </button>
        </h4>
        <span className="flex shrink-0 text-muted-foreground">
          <CaretRight aria-hidden size={16} />
        </span>
      </HStack>
      <HStack gap="xs" wrap>
        <Chip chip={card.status} />
        <Chip chip={card.owner} />
      </HStack>
      <Text as="p" size="sm" tone="secondary">
        {card.facts.map((fact, at) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: the facts are read in the order given
          <Fragment key={at}>
            <span>{fact}</span>
            {"\u00a0"}
            <span aria-hidden>·</span>{" "}
          </Fragment>
        ))}
        <Text
          as="span"
          className="whitespace-nowrap"
          face="mono"
          id={referenceId}
          size="sm"
          tone="secondary"
        >
          {card.reference}
        </Text>
      </Text>
      {card.next || card.visit || card.note ? (
        <VStack gap="sm">
          {card.next ? (
            <HStack
              align="center"
              className={cn(
                "rounded-(--radius-lg) px-3 py-2 text-sm font-medium [&>svg]:shrink-0",
                NEXT_TONE[card.next.tone],
              )}
              data-slot="vault-case-next"
              gap="sm"
            >
              <ArrowRight aria-hidden size={16} />
              <span>{card.next.label}</span>
            </HStack>
          ) : null}
          {card.visit ? (
            <HStack
              align="center"
              className="text-muted-foreground [&>svg]:shrink-0"
              data-slot="vault-case-visit"
              gap="sm"
            >
              <CalendarBlank aria-hidden size={16} />
              <Text size="sm" tone="secondary">
                {card.visit}
              </Text>
            </HStack>
          ) : null}
          {card.note ? (
            <Text as="p" data-slot="vault-case-note" size="sm" tone="error">
              {card.note}
            </Text>
          ) : null}
        </VStack>
      ) : null}
    </Card>
  );
}

export type { VaultCasesCard, VaultCasesChip, VaultCasesIcon, VaultCasesTone };
export { VaultCaseCard };
