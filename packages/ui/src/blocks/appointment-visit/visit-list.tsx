import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { VisitListRow } from "./types";

type VisitListCopy = {
  upcoming: string;
  past: string;
  open: string;
};

type VisitListProps = {
  copy: VisitListCopy;
  upcoming: readonly VisitListRow[];
  past: readonly VisitListRow[];
  /** Opens the page that manages one visit, by its id. */
  onOpen: (id: string) => void;
};

/** The collector's visits split into upcoming and past, each under its
 * heading and each opening the page that manages it. An empty half draws
 * nothing. */
function VisitList({ copy, upcoming, past, onOpen }: VisitListProps) {
  return (
    <>
      {upcoming.length > 0 ? (
        <Section
          heading={copy.upcoming}
          onOpen={onOpen}
          open={copy.open}
          rows={upcoming}
          slot="booking-list-upcoming"
        />
      ) : null}
      {past.length > 0 ? (
        <Section
          heading={copy.past}
          onOpen={onOpen}
          open={copy.open}
          rows={past}
          slot="booking-list-past"
        />
      ) : null}
    </>
  );
}

function Section({
  heading,
  open,
  rows,
  slot,
  onOpen,
}: {
  heading: string;
  open: string;
  rows: readonly VisitListRow[];
  slot: string;
  onOpen: (id: string) => void;
}) {
  return (
    <VStack data-slot={slot} gap="sm" hAlign="stretch">
      <Text as="h2" size="lg" weight="medium">
        {heading}
      </Text>
      {rows.map((row) => (
        <div
          className="grid w-full grid-cols-1 gap-2 border-b border-border py-4 last:border-b-0 sm:grid-cols-[minmax(12rem,1.2fr)_minmax(10rem,1fr)_minmax(14rem,1.4fr)_auto] sm:items-center sm:gap-6"
          data-slot="booking-list-item"
          key={row.id}
        >
          <HStack gap="sm" vAlign="center">
            <Text as="span" weight="medium">
              {row.service}
            </Text>
            <Text as="span" size="sm" tone="secondary">
              {row.status}
            </Text>
            {row.code ? (
              <Text as="span" size="sm" tone="secondary">
                {row.code}
              </Text>
            ) : null}
          </HStack>
          <Text as="span" size="sm" tone="secondary">
            {row.location}
          </Text>
          <Text as="span" size="sm">
            {row.when}
          </Text>
          <Button
            className="justify-self-start sm:justify-self-end"
            onClick={() => onOpen(row.id)}
            size="sm"
            type="button"
            variant="ghost"
          >
            {open}
          </Button>
        </div>
      ))}
    </VStack>
  );
}

export type { VisitListCopy, VisitListProps };
export { VisitList };
