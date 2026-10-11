import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { VisitTone } from "./types";

const BADGE = {
  plain: "default",
  ink: "brand",
  info: "info",
  ok: "success",
  warn: "warning",
  bad: "error",
} as const satisfies Record<VisitTone, string>;

type VisitPhaseHeaderCopy = {
  /** The badge's word for where it stands. */
  phase: string;
  /** The line beside the badge. */
  note?: string;
  title: string;
  /** The line under the title. */
  lede?: string;
};

type VisitPhaseHeaderProps = {
  copy: VisitPhaseHeaderCopy;
  tone: VisitTone;
};

/** Where a visit or a ticket stands, its heading and the line under it;
 * read out as it changes. */
function VisitPhaseHeader({ copy, tone }: VisitPhaseHeaderProps) {
  return (
    <VStack aria-live="polite" data-slot="phase-header" gap="sm">
      <HStack gap="sm" vAlign="center">
        <Badge variant={BADGE[tone]}>{copy.phase}</Badge>
        {copy.note ? (
          <Text as="span" size="sm" tone="secondary">
            {copy.note}
          </Text>
        ) : null}
      </HStack>
      <Text as="h2" size="xl" weight="bold">
        {copy.title}
      </Text>
      {copy.lede ? (
        <Text as="p" tone="secondary">
          {copy.lede}
        </Text>
      ) : null}
    </VStack>
  );
}

export type { VisitPhaseHeaderCopy, VisitPhaseHeaderProps };
export { VisitPhaseHeader };
